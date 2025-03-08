import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from utils.audio_to_text import getTextFromAudio
import base64
import aiofiles
import json
from pydantic import BaseModel
import re

from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
import google.generativeai as genai
from helpers import helpers
from utils.eleven_labs import text_to_audio
from utils.process_response import process_response
from utils.lipSync import lip_sync_message
from utils.emailer import sendEmail

import asyncio


load_dotenv()

# Access environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_API_KEY2 = os.getenv("GOOGLE_API_KEY2")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY is not set in the .env file")
if not GOOGLE_API_KEY2:
    raise RuntimeError("GOOGLE_API_KEY2 is not set in the .env file")

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

session_descriptions = {}


# Define request body model
class ImageUrls(BaseModel):
    ogImageUrl: str
    susImageUrl: str

class SessionId(BaseModel):
    session_id: str

# Define request body model
class Terms(BaseModel):
    registeredName: str
    suspiciousTerm: str

class ChatsBody(BaseModel):
    reqChat:str
    session_id:str


class SearchRequest(BaseModel):
    brand_name: str
    manufacturer_name: str

class ReportDesc(BaseModel):
    session_id: str
   
class MailBody(BaseModel):
    session_id:str
    client_email:str

def read_cache(CACHE_FILE):
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as file:
            return json.load(file)
    return {}

# Helper function to write to the cache file
def write_cache(data,CACHE_FILE):
    with open(CACHE_FILE, "w") as file:
        json.dump(data, file, indent=4)

  
@app.post("/api/delete_session")
async def delete_session(session_id: SessionId):
    try:
        if session_id.session_id in helpers.session_chains:
            del helpers.session_chains[session_id.session_id]
        return {"message": "Session deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/create_session")
async def create_session():
    try:
        # Generate a new unique session ID
        session_id = str(uuid.uuid4())
        return {"session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

      
@app.post("/api/chat")
async def chat_rag(chats_body: ChatsBody):
    try:
        # Initialize the model
        model = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            google_api_key=GOOGLE_API_KEY,
            temperature=0.2,
            convert_system_message_to_human=True
        )

        # Load the vector index and QA chain
        vector_index = await helpers.loadVectorIndex()

        # Create or retrieve the chat session
        qa_chain = await helpers.createChatSession(chats_body.session_id, vector_index, model)
        language="english"
        # Perform the chat with the RAG model
        result = await helpers.chat_with_rag(chats_body.session_id, chats_body.reqChat,language,qa_chain)

        # Return the result
        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/audio_chat")
async def upload_audio(session_id: str = Form(...), file: UploadFile = File(...), language: str = Form(...)):
    try:
        # Ensure the 'temp_files' directory exists
        os.makedirs('temp_files', exist_ok=True)

        file_location = f"temp_files/{file.filename}"
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())  # Use 'await' for async file read

        text = getTextFromAudio(file_location)

        model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=GOOGLE_API_KEY2,
            temperature=0.2,
            convert_system_message_to_human=True
        )

        # Load the vector index and QA chain
        vector_index = await helpers.loadVectorIndex()
        os.remove(file_location)

        # Create or retrieve the chat session
        qa_chain = await helpers.createChatSession(session_id, vector_index, model)

        # Perform the chat with the RAG model
        response = await helpers.chat_with_rag(session_id, text,language,qa_chain)
      
        audio_file= text_to_audio(response)
        with open(audio_file, "rb") as file:
            audio_data = file.read()
            encoded_audio = base64.b64encode(audio_data).decode('utf-8')

        os.remove(audio_file)  # Delete the file after reading

        # lipsync= lip_sync_message("audio_sync")

        message_chunks = [response[i:i+70] for i in range(0, len(response), 70)]

        for chunk in message_chunks:
            with open('audios/message_0.json', 'r') as file:
                lipsync = json.load(file)
        

        print("res",response)

        return {
            "userQuery":text,
            "text": response,
            "audio": encoded_audio,
            "lipsync":lipsync
        }
        
        # return {"result": response}

        # return {"message": text, "session_id": session_id}
    
    except Exception as e:
        print("errr",e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/describe_report")
async def describe_report(file: UploadFile = File(...), session_id: str = Form(...)):
    try:
        pdf_path = f"uploads/{file.filename}"
        with open(pdf_path, "wb") as pdf_file:
            pdf_file.write(await file.read())

        output_folder = "temp_images"
        image_paths = await helpers.extract_pdf_pages_as_images(pdf_path, output_folder)
        combined_description = await helpers.generate_combined_description(output_folder, GOOGLE_API_KEY, session_id)
        
        
        return {"descriptions": combined_description}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"report problem: {e}")

@app.post("/api/verify-mail")
async def send_email(mail_body:MailBody):
    try:
        pdf_path = f"session_history/{mail_body.session_id}.pdf"
        done= sendEmail(mail_body.client_email,pdf_path)
        if done:
            return {"data":done }
        else:
            raise HTTPException(status_code=500, detail=f"report problem: {e}")
            
    except Exception as e:
        print(f"erre",e)
        raise HTTPException(status_code=500, detail=f"report problem: {e}")

    
# async def read_json(file):
#     async with aiofiles.open(file,mode='r',encoding='utf8') as f:
#         data=await f.read()
#     return json.loads(data)