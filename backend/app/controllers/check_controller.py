# app/controllers/auth_controller.py
from app.DB.mongodb import mongodb_client
from pymongo.collection import Collection
from typing import Dict, Optional
from bson import ObjectId
from pymongo.errors import PyMongoError
from ..helpers.model.checkImage import detect_safety_gear
from ..helpers.modelAPI import ModelAPI
import base64
from ..helpers.face import detect_face,base64_to_image




class checkController:
    @staticmethod
    async def checkImages(empId, images):
        try:
            saved_images = []
            for idx, image_base64 in enumerate(images):
                # Decode the base64 image (synchronously)
                image_data = base64.b64decode(image_base64.split(",")[1])
                # Save the decoded image data to a file (synchronously)
                # image_path = f"./app/helpers/model/images/{empId}_image_{idx + 1}.png"  
                # with open(image_path, "wb") as image_file:
                #     image_file.write(image_data)
                #     saved_images.append(image_path)
            
            # Call the asynchronous function properly using await
            detection_results1 = await ModelAPI.process_inference(images[0])
            detection_results2 = await ModelAPI.process_inference(images[1])

            
            return [detection_results1, detection_results2]

        except Exception as e:
            print(f"Error saving images: {e}")
            return None
        
    def faceDetect(images):
        try:
            saved_images = []
            for idx, image_base64 in enumerate(images):
                # Decode the base64 image (synchronously)
                image_data = base64.b64decode(image_base64.split(",")[1])
                # Save the decoded image data to a file (synchronously)
                # image_path = f"./app/helpers/model/images/{empId}_image_{idx + 1}.png"  
                # with open(image_path, "wb") as image_file:
                #     image_file.write(image_data)
                #     saved_images.append(image_path)
            
            # Call the asynchronous function properly using await
            image1=base64_to_image(images[0])
            image2=base64_to_image(images[1])

            detection_results1 = detect_face(image1)
            detection_results2 = detect_face(image2)


            
            return [detection_results1, detection_results2]

        except Exception as e:
            print(f"Error saving images: {e}")
            return None