from ultralytics import YOLO
import cv2
import os

# Load the general YOLOv8n model
model = YOLO('yolov8n.pt')  # Make sure to have the correct path to the model file

# Path to the image file
image_dir = './app/helpers/model/images/'  # Replace with your image path
image_paths = [os.path.join(image_dir, img) for img in os.listdir(image_dir) if img.endswith(('.jpeg', '.jpg', '.png'))]

for image_path in image_paths:
    image = cv2.imread(image_path)

    # Resize image for faster processing
    image_resized = cv2.resize(image, (640, 480))

    # Run detection
    results = model.predict(source=image_resized)

    detected_classes = {}  # Dictionary to hold detected classes and their status

    # Loop through detected boxes and update the dictionary
    for box in results[0].boxes:
        class_id = int(box.cls)
        class_name = results[0].names[class_id]  # Get the class name from the results
        detected_classes[class_name] = True

    # Print results for the current image
    print(f"Image {os.path.basename(image_path)}:")
    for class_name, detected in detected_classes.items():
        print(f"  {class_name.capitalize()} detected: {detected}")

    # Show results
    annotated_image = results[0].plot()
    cv2.imshow('Detected PPE', annotated_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
