from fastapi import APIRouter, HTTPException
from pymongo.errors import PyMongoError
from app.DB.mongodb import mongodb_client
from bson import ObjectId
from ..helpers.modelCCTV import VideoObjectDetection
import threading



from pydantic import BaseModel
from typing import List

router = APIRouter()

class CCTVRequest(BaseModel):
    video: str
    site: str
    prediction_classes: List[str]
cctv_threads = {}


class StopCCTVRequest(BaseModel):
    site: str

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
    

@router.get("/cctv-logs")
async def get_kiosk_logs():
    try:
        # Access the kioskLogs collection
        kiosk_logs_collection = mongodb_client.get_collection("cctvLogs")

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

@router.post("/start-cctv")
async def invoke_camera(data: CCTVRequest):
    try:
        video = data.video
        site = data.site
        prediction_classes = data.prediction_classes

        # For demonstration, print the received values
        print("Video:", video)
        print("Site:", site)
        print("Prediction Classes:", prediction_classes)
        if site in cctv_threads:
            return {"status": 400, "error": "Camera already running for this site"}

        stop_event = threading.Event()

        thread = threading.Thread(
            target=VideoObjectDetection.detect_from_video,
            args=(video, site, ",".join(prediction_classes))
        )
        thread.start()
        cctv_threads[site] = {"thread": thread, "stop_event": stop_event}

        # Perform any necessary logic here, e.g., starting a camera process
        return {"status": 200, "data": "Camera invoked successfully"}
    
    except Exception as err:
        print(f"Error in invokeccamera",err)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

@router.post("/stop-cctv")
async def stop_all_cameras():
    """API to stop all running CCTV threads."""
    if not cctv_threads:
        return {"status": 400, "error": "No active cameras to stop"}

    for site in list(cctv_threads.keys()):  # Iterate over a copy of keys
        cctv_threads[site]["stop_event"].set()  # Signal the thread to stop
        del cctv_threads[site]  # Remove entry

    return {"status": 200, "message": "All cameras stopped successfully"}
