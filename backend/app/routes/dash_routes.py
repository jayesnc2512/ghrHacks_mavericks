from fastapi import APIRouter, HTTPException
from pymongo.errors import PyMongoError
from app.DB.mongodb import mongodb_client
from bson import ObjectId

router = APIRouter()

@router.get("/kiosk-logs")
async def get_kiosk_logs():
    try:
        # Access the kioskLogs collection
        kiosk_logs_collection = mongodb_client.get_collection("kioskLogs")

        # Fetch all logs from the kioskLogs collection
        logs_cursor = kiosk_logs_collection.find()
        
        # Convert cursor to list of logs and format ObjectId for JSON serialization
        logs = [
            {**log, "_id": str(log["_id"])} 
            for log in logs_cursor
        ]

        return {"status": 200, "data": logs}
    except PyMongoError as err:
        print(f"Error fetching logs from database: {err}")
        raise HTTPException(status_code=500, detail="Database Error")
    except Exception as err:
        print(f"Unexpected error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/start-cctv")
async def invoke_camera():
    try:
        

        return {"status":200,"data":"hello"}
    except Exception as err:
        print(f"Error in invokeccamera",err)
        raise HTTPException(status_code=500, detail="Internal Server Error")

