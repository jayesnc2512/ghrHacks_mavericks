import cv2
import numpy as np
import os
import pickle
import time
from collections import Counter
from sklearn.preprocessing import Normalizer
from deepface import DeepFace

# Define paths
EMBEDDING_FILE = "app/helpers/model/face_embeddings.pkl"
SAVED_FACES_DIR = "app/helpers/model/Saved_faces"

# Load FaceNet model
print("🔄 Loading DeepFace model...")
model_name = "Facenet"
model = DeepFace.build_model(model_name)
print("✅ DeepFace model loaded!")

# Function to get face embedding using DeepFace
def get_embedding(image):
    temp_path = "temp_face.jpg"
    cv2.imwrite(temp_path, image)

    try:
        embeddings = DeepFace.represent(temp_path, model_name=model_name, enforce_detection=False)
        if embeddings:
            return embeddings[0]['embedding']
    except Exception as e:
        print(f"⚠️ Error extracting embedding: {e}")
    
    os.remove(temp_path)
    return None

# Load saved face embeddings
def load_saved_faces(directory):
    known_face_embeddings = []
    known_face_names = []

    if not os.path.exists(directory):
        print(f"⚠️ Directory {directory} does not exist. No faces loaded.")
        return np.empty((0, 128)), []

    for person_name in os.listdir(directory):
        person_folder = os.path.join(directory, person_name)
        if os.path.isdir(person_folder):
            for filename in os.listdir(person_folder):
                if filename.endswith((".jpg", ".png", ".jpeg")):
                    image_path = os.path.join(person_folder, filename)
                    img = cv2.imread(image_path)

                    if img is None:
                        print(f"⚠️ Could not read {image_path}")
                        continue
                    
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
                    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
                    
                    for (x, y, w, h) in faces:
                        face = img[y:y+h, x:x+w]
                        embedding = get_embedding(face)
                        if embedding is not None:
                            known_face_embeddings.append(embedding)
                            known_face_names.append(person_name)

    if known_face_embeddings:
        known_face_embeddings = np.array(known_face_embeddings)
        print(f"✅ Loaded {len(known_face_names)} known faces.")
    else:
        known_face_embeddings = np.empty((0, 128))
        print("⚠️ No face embeddings found in saved faces.")

    return known_face_embeddings, known_face_names

# Load embeddings from cache or generate them
if os.path.exists(EMBEDDING_FILE):
    print("🔄 Loading cached face embeddings...")
    with open(EMBEDDING_FILE, "rb") as f:
        known_face_embeddings, known_face_names = pickle.load(f)
    print(f"✅ Loaded {len(known_face_names)} known faces from cache.")
else:
    print("🔄 Extracting face embeddings...")
    known_face_embeddings, known_face_names = load_saved_faces(SAVED_FACES_DIR)

    with open(EMBEDDING_FILE, "wb") as f:
        pickle.dump((known_face_embeddings, known_face_names), f)
    print(f"✅ Saved {len(known_face_names)} face embeddings to cache.")

# Normalize embeddings
if known_face_embeddings.size > 0:
    normalizer = Normalizer(norm='l2')
    known_face_embeddings = normalizer.fit_transform(known_face_embeddings)
else:
    print("⚠️ No known face embeddings available! Exiting...")
    exit()

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Function to detect face in multiple frames until a known face is found
def detect_face_until_known(video_capture, duration=5):
    detected_names = []

    while True:
        start_time = time.time()

        while (time.time() - start_time) < duration:
            ret, frame = video_capture.read()
            if not ret:
                print("❌ Failed to retrieve frame from webcam")
                break

            # Detect face and get name
            detected_name, frame_with_boxes = detect_face(frame)

            if detected_name != "Unknown":
                detected_names.append(detected_name)

            # Show the frame with detection
            cv2.imshow("Face Detection", frame_with_boxes)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        if detected_names:
            most_common_name = Counter(detected_names).most_common(1)[0][0]
            print(f"👤 Detected Person: {most_common_name}")
            return most_common_name
        else:
            print("🔄 No known face detected. Retrying...")

# Function to detect face and return name along with processed frame
def detect_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    detected_name = "Unknown"

    for (x, y, w, h) in faces:
        face = frame[y:y+h, x:x+w]
        emb = get_embedding(face)
        if emb is None:
            continue
        
        emb = np.expand_dims(emb, axis=0)
        emb = normalizer.transform(emb)

        if len(known_face_embeddings) == 0:
            print("⚠️ No known faces to compare!")
            return "Unknown", frame

        distances = np.linalg.norm(known_face_embeddings - emb, axis=1)
        min_index = np.argmin(distances)

        if distances[min_index] < 0.6:
            detected_name = known_face_names[min_index]

        # Draw bounding box and name
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, detected_name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    return detected_name, frame

# Start webcam and continuously recognize until a known face is detected
video_capture = cv2.VideoCapture(0)
detected_person = detect_face_until_known(video_capture)
video_capture.release()
cv2.destroyAllWindows()
