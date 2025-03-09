from IPython.display import Markdown
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.messages import HumanMessage
from langchain.document_loaders import TextLoader
from langchain.memory import ConversationBufferMemory
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


from pathlib import Path
import json
from ironpdf import *
import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import base64
import mimetypes

from typing import Dict

from dotenv import load_dotenv
import os
import textwrap
import shutil

# Load .env file
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
persist_directory = './db'





class helpers():
    session_chains: Dict[str, RetrievalQA] = {}
    session_history: Dict[str, list] = {}  # Track the session history for each session
    history_directory = './session_history'  # Directory to store session histories
    responseFormat="I want only plain text with punctuations nothing else"

      

    @staticmethod
    async def createEmbeddings(file_path):
        try:
            print("createEmbeddings")
            print(file_path)

            pdf_loader = PyPDFLoader(file_path)
            pages = pdf_loader.load_and_split()
            print(len(pages))
            context = "\n\n".join(str(p.page_content) for p in pages)

            text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=500)
            texts = text_splitter.split_text(context)
            embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=GOOGLE_API_KEY)            
            return [embeddings, texts]
        except Exception as e:
            print(f"Error in createEmbeddings: {e}")
            return None

    @staticmethod
    async def createVectorDB(texts, embeddings):
        try:
            # Create and persist the Chroma object
            Chroma.from_texts(texts, embeddings, persist_directory=persist_directory)
            print("Saved vectorDB")
        except Exception as e:
            print(f"Error in createVectorDB: {e}")

    @staticmethod
    async def loadVectorIndex():
        try:
            embeddings =  GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
            vector_index =  Chroma(persist_directory=persist_directory, embedding_function=embeddings).as_retriever(search_kwargs={"k": 5})
            return vector_index
        except Exception as e:
            print(f"Error in loadVectorIndex: {e}")
            return None

    @staticmethod
    async def loadModel(vector_index, model):
        try:
            qa_chain =  RetrievalQA.from_chain_type(model, retriever=vector_index, return_source_documents=True)
            return qa_chain
        except Exception as e:
            print(f"Error in loadModel: {e}")
            return None

    @staticmethod
    def loadSessionHistory(session_id: str):
        try:
            session_file = Path(helpers.history_directory) / f"{session_id}.json"
            if session_file.exists():
                with open(session_file, 'r') as f:
                    helpers.session_history[session_id] = json.load(f)
                print(f"Loaded history for session {session_id}")
            else:
                print(f"No previous history found for session {session_id}")
        except Exception as e:
            print(f"Error loading session history for {session_id}: {e}")



    @staticmethod
    def saveSessionHistory(session_id: str):
        try:
            # Save JSON file
            session_file = Path(helpers.history_directory) / f"{session_id}.json"
            with open(session_file, 'w') as f:
                json.dump(helpers.session_history[session_id], f, indent=4)
            print(f"Saved history for session {session_id} as JSON.")

            # Save PDF file with text wrapping
            pdf_file = Path(helpers.history_directory) / f"{session_id}.pdf"
            doc = SimpleDocTemplate(str(pdf_file), pagesize=letter)
            styles = getSampleStyleSheet()
            story = []

            history = helpers.session_history[session_id]
            for item in history:
                user_text = item['user']
                assistant_text = item['assistant']

                # Add User text
                user_paragraph = Paragraph(f"<b>User:</b> {user_text}", styles['Normal'])
                story.append(user_paragraph)

                # Add Assistant text
                assistant_paragraph = Paragraph(f"<b>Assistant:</b> {assistant_text}", styles['Normal'])
                story.append(assistant_paragraph)

                # Add a spacer between each entry
                story.append(Spacer(1, 12))

            # Build the PDF
            doc.build(story)
            print(f"Saved history for session {session_id} as PDF.")

        except Exception as e:
            print(f"Error saving session history for {session_id}: {e}")




    @staticmethod
    async def createChatSession(session_id: str, vector_index, model):
        try:
            if session_id not in helpers.session_history:
                qa_chain = RetrievalQA.from_chain_type(
                    model, retriever=vector_index, return_source_documents=True
                    )
                helpers.session_history[session_id] = [] 
                
                print("new session")
                helpers.session_chains[session_id] = qa_chain
                
            return helpers.session_chains[session_id]
        except Exception as e:
            print(f"Error in createChatSession: {e}")
            # return None
        


    @staticmethod
    async def extract_pdf_pages_as_images(pdf_path, output_folder, dpi=96):
        try:
            pdf = PdfDocument.FromFile(pdf_path)
            output_path = f"{output_folder}/*.png"
            pdf.RasterizeToImageFiles(output_path, DPI=dpi)
            print(f"PDF pages successfully extracted as images to {output_folder}.")
            return output_folder
        except Exception as e:
            print(f"Error in pdf to image convresion: {e}")
            return None


    @staticmethod
    async def chat_with_rag(session_id: str, reqChat: str,language,qa_chain):
        try:
            history = helpers.session_history.get(session_id, [])
            previous_conversation = "\n".join([f"User: {item['user']}\nAssistant: {item['assistant']}" for item in history])


            question = f"You're a industrial safety expert (female).give proper answer descriptive. do not ask unneccesary questions. Structure of the answer should be plain text format,  bullet points if needed. also consider the current timestamp of the previous chats and their effect. Strictly answer in {language}, keep the hard terms in english only.do not repeat the prvious chats again and again, just consider them while answering . refer to the prev chat is required.Here is the prev conversation: {previous_conversation} . Here's the question: {reqChat}"
            qa_chain = helpers.session_chains.get(session_id)
            
            if qa_chain:
                result = qa_chain.invoke({"query": question})
                print(result["result"])
                if session_id in helpers.session_history:
                    helpers.session_history[session_id].append({"user": reqChat, "assistant": result["result"]})

                # Save the updated session history to a file
                helpers.saveSessionHistory(session_id)
                return result["result"]
            
            else:
                return "Session not found."
        except Exception as e:
            print(f"Error in chat_with_rag: {e}")
            return None
        
    @staticmethod
    def describeImage(image_path, api_key2):
        try:
            genai.configure(api_key=api_key2)
            print(image_path)
            prompt = (
                "Summarize the report in image"
            )

            model = genai.GenerativeModel("gemini-1.5-flash")

            # Read the image file
            with open(image_path, "rb") as image_file:
                image_content = image_file.read()

            # Encode the image content to base64
            encoded_image = base64.b64encode(image_content).decode('utf-8')

            # Generate content using the model
            response = model.generate_content([{'mime_type': 'image/jpeg', 'data': encoded_image}, prompt])
            
           
            # Return the LLM's response
            return response.text

        except Exception as e:
            print(f"Unexpected error in describeImage: {e}")
            return None
        
    @staticmethod
    async def generate_combined_description(output_folder: str, google_api_key: str, session_id):
        try:
            folder_path = os.path.abspath(output_folder)
            if not os.path.exists(folder_path):
                raise FileNotFoundError(f"Folder {output_folder} not found.")

            image_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if not image_files:
                raise FileNotFoundError("No images found in the folder.")

            combined_description = ""
            descriptions = {}

            for image_file in image_files:
                image_path = os.path.join(folder_path, image_file)
                description = helpers.describeImage(image_path, google_api_key)
                descriptions[image_file] = description
                combined_description += f"\n\nDescription for {image_file}:\n{description}"
            
           
            if session_id in helpers.session_history:     
                helpers.session_history[session_id].append({"user": "Medical report uploaded by user", "assistant": combined_description})
            else:
                # If session doesn't exist, initialize it
                helpers.session_history[session_id] = [{"user": "Medical report uploaded by user", "assistant": combined_description}]
            
            helpers.saveSessionHistory(session_id)

            if os.path.exists(folder_path):
                shutil.rmtree(folder_path)

            return combined_description
        except Exception as e:
            print(f"Error in generate_combined_description: {e}")
            return str(e)