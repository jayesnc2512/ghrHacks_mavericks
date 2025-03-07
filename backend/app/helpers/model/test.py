from ultralytics import YOLO
import cv2

# Load the trained model
model = YOLO('best2.pt')

# Path to the video file
video_path = 'example_video.mp4'  # Replace with your video path

# Open the video file
video = cv2.VideoCapture(video_path)

# Get video parameters
fps = video.get(cv2.CAP_PROP_FPS)
width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
fourcc = cv2.VideoWriter_fourcc(*'mp4v')

# Output video file
output_video_path = 'detected_video.mp4'
out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

while video.isOpened():
    ret, frame = video.read()
    if not ret:
        break

    # Resize frame for faster processing
    frame_resized = cv2.resize(frame, (640, 480))  # Resize to 640x480 for faster processing

    # Run the model on the resized frame
    results = model.predict(source=frame_resized, imgsz=(640, 480), save=False, show=False)

    # Filter out the "machinery" class from the results
    filtered_boxes = []

    for box in results[0].boxes:
        if int(box.cls) not in [6,8,9]:
            filtered_boxes.append(box)
            # Plot the filtered results

    results[0].boxes = filtered_boxes
    annotated_frame = results[0].plot()

    # Resize annotated frame back to original size
    annotated_frame = cv2.resize(annotated_frame, (width, height))

    # Write the frame to the output video file
    out.write(annotated_frame)

    # Display the frame in a window
    cv2.imshow('Real-Time Detection', annotated_frame)

    # Press 'q' to exit the video display
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release video objects
video.release()
out.release()
cv2.destroyAllWindows()

print(f"Processing complete. The output video is saved as '{output_video_path}'.")
