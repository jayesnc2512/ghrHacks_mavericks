import cv2
import torch
from ultralytics import YOLO

class ModelAPI:
    model = YOLO("helpers/model/ppe.pt")  # Load your YOLOv8 model file

    @staticmethod
    def analyze_safety_gear(predictions, person_box):
        safety_gear = {
            "Helmet": False,
            "Mask": False,
            "Vest": False,
            "Gloves": False,
            "Shoes": False,
            "Goggles": False,
        }

        for detection in predictions:
            label = detection["name"]
            gear_center_x = detection["x"]
            gear_center_y = detection["y"]

            # Check if gear is inside the person box
            if (person_box["x_min"] <= gear_center_x <= person_box["x_max"] and
                    person_box["y_min"] <= gear_center_y <= person_box["y_max"]):
                if label in safety_gear:
                    safety_gear[label] = True

        return safety_gear

    @staticmethod
    def process_inference(img_path):
        results = ModelAPI.model.predict(img_path)  # Run YOLOv8 inference
        predictions = results[0].boxes  # Get detected objects

        output = {
            "total_persons": 0,
            "persons": []
        }

        for box in predictions:
            x_min, y_min, x_max, y_max = box.xyxy[0].tolist()
            label = ModelAPI.model.names[int(box.cls[0])]  # Get class label

            if label == "Person":
                person_box = {
                    "x_min": x_min,
                    "x_max": x_max,
                    "y_min": y_min,
                    "y_max": y_max
                }
                safety_gear = ModelAPI.analyze_safety_gear(predictions, person_box)

                output["total_persons"] += 1
                output["persons"].append({
                    "person_box": person_box,
                    "safety_gear": safety_gear
                })

        return output

