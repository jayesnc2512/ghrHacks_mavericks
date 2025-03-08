import torch
import cv2
import numpy as np
from PIL import Image
import time
import sound

# Load YOLOv5 model
print("🔄 Loading YOLOv5 model...")
model = torch.hub.load("ultralytics/yolov5", "custom", path="app/helpers/model/fire.pt", force_reload=True)
print("✅ Model loaded successfully!")

# Class labels from YAML
class_labels = ["Fire"]

# Parameters
DETECTION_THRESHOLD = 0.4  # Minimum confidence to consider a fire detection
TIME_WINDOW = 5  # Time window in seconds
MIN_FIRE_FRAMES = 0.3  # Fire should be detected in at least 50% of frames in the window

def detect_fire(frame):
    """
    Detects fire in the given frame.

    Args:
        frame (numpy.ndarray): Input image frame.

    Returns:
        float: Confidence score if fire is detected, else 0.
        numpy.ndarray: Processed frame with bounding boxes.
    """
    img_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    results = model(img_pil)
    df = results.pandas().xyxy[0]
    
    max_conf = 0  # Store highest confidence in this frame
    for _, row in df.iterrows():
        x1, y1, x2, y2 = int(row["xmin"]), int(row["ymin"]), int(row["xmax"]), int(row["ymax"])
        conf = row["confidence"]
        cls = int(row["class"])
        
        if class_labels[cls] == "Fire" and conf >= DETECTION_THRESHOLD:
            max_conf = max(max_conf, conf)
            label = f"{class_labels[cls]} ({conf:.2f})"
            
            # Draw bounding box and label
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

    return max_conf, frame


def analyze_fire_detection(video_source=0):
    """
    Captures video frames and analyzes fire detection over a 5-second window.

    Args:
        video_source: Camera index or video file path.
    """
    cap = cv2.VideoCapture(video_source)
    fire_confidences = []
    start_time = time.time()

    if not cap.isOpened():
        print("❌ Error: Could not open video source.")
        return

    print("🎥 Starting Fire Detection... Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Error: Failed to retrieve frame from webcam.")
            break
        
        fire_conf, processed_frame = detect_fire(frame)
        fire_confidences.append(fire_conf if fire_conf > 0 else 0)  # Store confidence scores

        # Remove old frames beyond the time window
        current_time = time.time()
        if current_time - start_time >= TIME_WINDOW:
            fire_frames = sum(1 for conf in fire_confidences if conf > 0)  # Count fire detections
            avg_confidence = sum(fire_confidences) / len(fire_confidences) if fire_confidences else 0
            fire_percentage = fire_frames / len(fire_confidences)

            # Fire alert logic
            if fire_percentage >= MIN_FIRE_FRAMES and avg_confidence >= DETECTION_THRESHOLD:
                print(f"🔥 Fire detected in {fire_percentage * 100:.2f}% of frames! Avg confidence: {avg_confidence:.2f}")
                sound.play_alert()
            else:
                print("✅ No significant fire detected.")

            # Reset buffer and timer
            fire_confidences.clear()
            start_time = time.time()

        cv2.imshow("Fire Detection", processed_frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            print("🛑 Stopping fire detection...")
            break

    cap.release()
    cv2.destroyAllWindows()


def main():
    """
    Main function to start fire detection.
    """
    analyze_fire_detection(video_source=0)  # Use 0 for webcam or replace with a video file path


if __name__ == "__main__":
    main()
