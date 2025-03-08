from fastapi import APIRouter, HTTPException, Body
from ._models import checkImages,KioskLog
import base64
from app.DB.mongodb import mongodb_client
from pymongo.errors import PyMongoError
from datetime import datetime
from app.helpers.emailSend import send_email


from ..controllers.check_controller import checkController

# router = APIRouter()
router = APIRouter()

@router.post("/check-image")
async def checkImages(body: checkImages):
    try:
        result = await checkController.checkImages(body.empID, body.images)
        if result:
            return {"message": "Image uploaded successfully", "status": 200, "data": result}
        else:
            return {"status": 500, "message": "Internal Server Error"}
    except Exception as err:
        print(f"Error in check Router", err)
        raise HTTPException(status_code=400, detail="Internal Server Error")
    

@router.post("/face-detect")
async def checkImages(body: checkImages):
    try:
        result = checkController.faceDetect(body.empID, body.images)
        if result:
            return {"message": "Image uploaded successfully", "status": 200, "data": result}
        else:
            return {"status": 500, "message": "Internal Server Error"}
    except Exception as err:
        print(f"Error in check Router", err)
        raise HTTPException(status_code=400, detail="Internal Server Error")


@router.post("/kiosk-log")
async def sendLog(body: KioskLog):
    try:
        print("you are called")

        # Access the kioskLogs collection
        kiosk_logs_collection = mongodb_client.get_collection("kioskLogs")

        # Convert Pydantic model to dictionary
        log_data = body.model_dump()

        # Add a timestamp to the log data
        log_data['timestamp'] = datetime.utcnow()

        # Insert the log data into the kioskLogs collection
        result = kiosk_logs_collection.insert_one(log_data)
        email_body=f"Hello\n Employee ID:{body.empID}\n\n was detected not following proper KIT \n \n logs:{log_data['log']} "
        send_email(email_body)
        
        if result.inserted_id:
            return {"message": "Log added successfully", "status": 200, "log_id": str(result.inserted_id)}
        else:
            return {"status": 500, "message": "Failed to add log"}
    except PyMongoError as err:
        print(f"Error adding log to database: {err}")
        raise HTTPException(status_code=500, detail="Database Error")
    except Exception as err:
        print(f"Unexpected error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
