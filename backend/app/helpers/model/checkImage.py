from ultralytics import YOLO
import cv2
import os

def detect_safety_gear():
    try:
        # Example usage
        model_path = './app/helpers/model/best2.pt'  # Replace with your model path
        image_dir = './app/helpers/model/images/'  # Replace with your image directory

        # Load the trained model
        model = YOLO(model_path)

        # Define the class IDs
        HARDHAT_CLASS_ID = 0
        MASK_CLASS_ID = 1
        SAFETY_VEST_CLASS_ID = 7

        # Get all image paths in the directory
        image_paths = [os.path.join(image_dir, img) for img in os.listdir(image_dir) if img.endswith(('.jpeg', '.jpg', '.png'))]

        res = []
        for image_path in image_paths:
            image = cv2.imread(image_path)

            if image is None:
                print(f"Error loading image: {image_path}")
                continue

            # Run the model on the original image
            results = model.predict(source=image, save=False, show=False)

            # Initialize detection flags
            hardhat_detected = False
            safety_vest_detected = False
            mask_detected = False

            # Check the detections
            for box in results[0].boxes:
                if int(box.cls) == HARDHAT_CLASS_ID:
                    hardhat_detected = True
                elif int(box.cls) == SAFETY_VEST_CLASS_ID:
                    safety_vest_detected = True
                elif int(box.cls) == MASK_CLASS_ID:
                    mask_detected = True

            # Create the result dictionary
            detection_result = {
                "hardhat": hardhat_detected,
                "vest": safety_vest_detected,
                "mask": mask_detected
            }
            res.append(detection_result)

            # Print detection results
            print(f"Image {os.path.basename(image_path)}: {detection_result}")

            # Save the annotated image with a unique name
            annotated_image = results[0].plot()

            # Display the annotated image in a window
            # cv2.imshow('Detected Image', annotated_image)

            # Wait for a key press to close the window (optional for debugging)
            # cv2.destroyAllWindows()

            # Save the annotated image
            output_image_path = f'./app/helpers/model/detected/detected_{os.path.basename(image_path)}'
            cv2.imwrite(output_image_path, annotated_image)

            print(f"Processing complete. The output image is saved as '{output_image_path}'.")

        # Clean up the image directory by deleting processed images
        for image_path in image_paths:
            try:
                os.remove(image_path)  # Delete the image file
                print(f"Deleted image: {image_path}")
            except OSError as e:
                print(f"Error deleting image {image_path}: {e}")

        return res
    except Exception as e:
        print(f"Error processing image: {e}")

# Call the function
# detect_safety_gear()
