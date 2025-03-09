from helpers import helpers
from dotenv import load_dotenv
import os
import asyncio
import traceback

# Load .env file
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

async def createDBmain():
    try:
        path = "./data/data.pdf"
        
        if not os.path.exists(path):
            print(f"File not found: {path}")
            return None

        if not GOOGLE_API_KEY:
            print("Warning: GOOGLE_API_KEY is not set")
            return None


        [embeddings, texts] = await helpers.createEmbeddings(path)
        if embeddings and texts:
            await helpers.createVectorDB(texts, embeddings)
            print("Vector database created successfully.")
            return True
        else:
            print("Failed to create embeddings or texts.")
            return None
    except Exception as e:
        print(f"Error in createDBmain: {e}")
        traceback.print_exc()
        return None

if __name__ == "__main__":
    asyncio.run(createDBmain())
