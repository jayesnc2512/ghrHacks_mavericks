import os
import google.generativeai as genai
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.responses import JSONResponse

# Configure the API key
genai.configure(api_key="AIzaSyDPJ-ITFibp-ShZJBWplJ9_O2NYmjdfakk")

# Upload function to send file to Gemini
def upload_to_gemini(path, mime_type=None):
    file = genai.upload_file(path, mime_type=mime_type)
    print(f"Uploaded file '{file.display_name}' as: {file.uri}")
    return file

# Create the model with generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
)

# FastAPI app
def getTextFromAudio(file_location):
    try:
        uploaded_file = upload_to_gemini(file_location, mime_type="audio/m4a")

        # Start a chat session with the uploaded file
        chat_session = model.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": [uploaded_file],
                },
            ]
        )

        # Send a message requesting transcription
        response = chat_session.send_message("Please transcribe this audio.strictly give nothing should be there just text")
        print("response", response)

        # Access candidates directly from response
        if response.candidates:
            transcribed_text = response.candidates[0].content.parts[0].text
            
            return transcribed_text
        else:
            raise Exception("No transcription candidates found in the response.")
    except Exception as e:
        print("error", e)
