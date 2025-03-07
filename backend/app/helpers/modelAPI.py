import asyncio
import cv2
import os
from inference_sdk import InferenceHTTPClient

class ModelAPI:
    @staticmethod
    async def model(img):
        CLIENT = InferenceHTTPClient(
            api_url="https://detect.roboflow.com",
            api_key="oWW9w4FYndkZO5g4VTUE"
        )
        # Use await to call async method
        result = await CLIENT.infer_async(img, model_id="ppe-rqnu9/4")
        return result

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
            if detection['class'] in safety_gear:
                gear_center_x = detection['x']
                gear_center_y = detection['y']

                # Check if gear is inside the person box
                if (person_box['x_min'] <= gear_center_x <= person_box['x_max'] and
                        person_box['y_min'] <= gear_center_y <= person_box['y_max']):
                    safety_gear[detection['class']] = True
        
        return safety_gear

    @staticmethod
    async def process_inference(img):
        modelResult = await ModelAPI.model(img)
        predictions = modelResult['predictions']
        
        # Initialize output dictionary
        results = {
            "total_persons": 0,
            "persons": []
        }

        # Loop through predictions to find persons and their gear
        for detection in predictions:
            if detection['class'] == 'Person':
                person_box = {
                    "x_min": detection['x'] - detection['width'] / 2,
                    "x_max": detection['x'] + detection['width'] / 2,
                    "y_min": detection['y'] - detection['height'] / 2,
                    "y_max": detection['y'] + detection['height'] / 2
                }
                
                # Analyze safety gear for the detected person
                safety_gear = ModelAPI.analyze_safety_gear(predictions, person_box)
                
                # Append person info to results
                results["total_persons"] += 1
                results["persons"].append({
                    "person_box": person_box,
                    "safety_gear": safety_gear
                })

        return results
