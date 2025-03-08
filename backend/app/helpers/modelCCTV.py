import cv2
import os
import json
import matplotlib.pyplot as plt
from typing import List, Dict, Tuple, Optional
from DB.mongodb import mongodb_client
from ultralytics import YOLO


class VideoObjectDetection:
    model_path = "helpers/model/ppe.pt"  # Path to your trained YOLOv8 model
    model = YOLO(model_path)

    @staticmethod
    def resize_frame(frame, max_width=480, max_height=320) -> cv2.Mat:
        if frame is None or frame.size == 0:
            return frame
        height, width = frame.shape[:2]
        if width > max_width or height > max_height:
            scaling_factor = min(max_width / width, max_height / height)
            frame = cv2.resize(frame, (int(width * scaling_factor), int(height * scaling_factor)))
        return frame

    @staticmethod
    def process_frame(frame: cv2.Mat, prediction_classes: List[str]) -> Tuple[Optional[cv2.Mat], Dict]:
        if frame is None or frame.size == 0:
            print("Error: Received an empty frame.")
            return None, {}

        try:
            frame = VideoObjectDetection.resize_frame(frame)
            result = VideoObjectDetection.model(frame)[0]

            predictions = result.boxes.data.tolist()  # Extract bounding box data
            class_names = VideoObjectDetection.model.names  # Get class labels

            results = {
                "total_persons": 0,
                "persons": {}
            }
            person_counter = 1

            persons = []  # List to store person bounding boxes

            for detection in predictions:
                x, y, width, height, confidence, class_idx = detection
                class_name = class_names[int(class_idx)]

                if class_name == 'Person':
                    person_box = {
                        "x_min": x - width / 2,
                        "x_max": x + width / 2,
                        "y_min": y - height / 2,
                        "y_max": y + height / 2
                    }
                    persons.append((person_counter, person_box))
                    person_counter += 1

            # Analyze safety gear for each person
            for person_id, person_box in persons:
                safety_gear = VideoObjectDetection.analyze_safety_gear(predictions, person_box, prediction_classes)

                if any(not safety_gear[cls] for cls in prediction_classes):
                    results["total_persons"] += 1
                    results["persons"][f"Person {person_id}"] = {
                        "safety_gear": safety_gear
                    }

            VideoObjectDetection.draw_bounding_boxes(frame, predictions, class_names)
            return frame, results

        except Exception as e:
            print(f"Error processing frame: {e}")
            return None, {}

    @staticmethod
    def draw_bounding_boxes(image: cv2.Mat, predictions: List[List], class_names: Dict[int, str]) -> None:
        for prediction in predictions:
            x, y, width, height, confidence, class_idx = prediction
            class_name = class_names[int(class_idx)]

            top_left = (int(x - width // 2), int(y - height // 2))
            bottom_right = (int(x + width // 2), int(y + height // 2))

            # Draw bounding box
            cv2.rectangle(image, top_left, bottom_right, (0, 255, 0), 2)

            # Add label with class and confidence score
            label = f"{class_name}: {confidence:.2f}"
            cv2.putText(image, label, (top_left[0], top_left[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    @staticmethod
    def analyze_safety_gear(predictions: List[List], person_box: Dict, required_classes: List[str]) -> Dict[str, bool]:
        safety_gear = {cls: False for cls in required_classes}

        for detection in predictions:
            x, y, _, _, _, class_idx = detection
            class_name = VideoObjectDetection.model.names[int(class_idx)]

            if class_name in required_classes:
                if (person_box['x_min'] <= x <= person_box['x_max'] and
                        person_box['y_min'] <= y <= person_box['y_max']):
                    safety_gear[class_name] = True

        return safety_gear

    @staticmethod
    def display_frame(frame: cv2.Mat) -> None:
        """Display a frame using matplotlib."""
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        plt.imshow(frame_rgb)
        plt.axis('off')
        plt.draw()
        plt.pause(0.01)  # Increased pause for smoother updates

    @staticmethod
    def detect_from_video(video_path: str, site: str, prediction_classes: str, target_fps=3) -> None:
        prediction_classes = prediction_classes.split(",")
        output_dir = "output_frames"
        os.makedirs(output_dir, exist_ok=True)
        cctv_logs_collection = mongodb_client.get_collection("cctvLogs")

        try:
            if video_path in ["1", "0", "2"]:
                video_path = int(video_path)

            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                print("Error opening video capture")
                return

            original_fps = cap.get(cv2.CAP_PROP_FPS) if cap.get(cv2.CAP_PROP_FPS) > 0 else 30
            frame_interval = max(1, int(original_fps / target_fps))
            frame_number = 0

            log_interval_frames = int(5 * original_fps)
            last_log_frame = -log_interval_frames

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                if frame_number % frame_interval == 0:
                    processed_frame, results = VideoObjectDetection.process_frame(frame, prediction_classes)
                    if processed_frame is not None:
                        VideoObjectDetection.display_frame(processed_frame)

                if frame_number - last_log_frame >= log_interval_frames:
                    video_timestamp = frame_number / original_fps
                    logs = []

                    if results["total_persons"] > 0:
                        for person, info in results["persons"].items():
                            if any(not v for v in info["safety_gear"].values()):
                                logs.append({
                                    "person": person,
                                    "safety_gear": info["safety_gear"]
                                })

                    if logs:
                        frame_log = {
                            "camera": video_path,
                            "site": site,
                            "video_timestamp_seconds": video_timestamp,
                            "frame_name": f"{site}_{video_timestamp:.2f}",
                            "required_prediction": prediction_classes,
                            "prediction": logs
                        }

                        if cctv_logs_collection is not None:
                            cctv_logs_collection.insert_one(frame_log)
                            print(f"Inserted log for frame at {video_timestamp:.2f} seconds into MongoDB.")

                        frame_filename = os.path.join(output_dir, f"{site}_{video_timestamp:.2f}.jpg")
                        cv2.imwrite(frame_filename, processed_frame)
                        print(f"Saved frame as {frame_filename}")

                        last_log_frame = frame_number

                frame_number += 1

            cap.release()

        except Exception as err:
            print(f"Error in detect_from_video: {err}")
