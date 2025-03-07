import cv2
from inference_sdk import InferenceHTTPClient

# Initialize the InferenceHTTPClient with your API key
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="oWW9w4FYndkZO5g4VTUE"
)

# Path to your image
image_path = "backend"  # Replace with your actual image path

# Load the image using OpenCV
image = cv2.imread(image_path)

# Perform inference by passing the image path as a string
model_id = "ppe-rqnu9/4"  # Replace with your actual model ID
result = CLIENT.infer(image_path, model_id=model_id)

# Process the results and draw the bounding boxes
predictions = result.get("predictions", [])
for prediction in predictions:
    x = int(prediction['x'])
    y = int(prediction['y'])
    width = int(prediction['width'])
    height = int(prediction['height'])
    class_name = prediction['class']
    confidence = prediction['confidence']

    # Calculate the top-left and bottom-right points of the bounding box
    top_left = (x - width // 2, y - height // 2)
    bottom_right = (x + width // 2, y + height // 2)

    # Draw the bounding box on the image
    cv2.rectangle(image, top_left, bottom_right, (0, 255, 0), 2)
    
    # Construct and put the label above the bounding box
    label = f"{class_name}: {confidence:.2f}"
    cv2.putText(image, label, (top_left[0], top_left[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Display the image with bounding boxes
cv2.imshow("Detected Image", image)
cv2.waitKey(0)

# Save the image with bounding boxes
output_path = "output_image.jpg"  # Specify the output file name
cv2.imwrite(output_path, image)

# Close the OpenCV windows
cv2.destroyAllWindows()
