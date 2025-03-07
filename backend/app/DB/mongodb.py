# app/db/mongodb.py
from pymongo import MongoClient
# from pymongo.errors import ConnectionError
from typing import Optional

class MongoDBClient:
    def __init__(self, db_url: str, db_name: str):
        try:
            self.client = MongoClient(db_url, serverSelectionTimeoutMS=5000)  # 5 seconds timeout
            self.db = self.client[db_name]
            # Test the connection
            self.client.admin.command('ping')
            print("MongoDB connection established.")
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            raise

    def get_collection(self, collection_name: str):
        return self.db[collection_name]

# Create a single instance of MongoDBClient
mongodb_client = MongoDBClient(
    db_url="mongodb+srv://Jayesh:nfqyqIcoqAMWkjfQ@cluster0.57baeh6.mongodb.net/kongsberg?retryWrites=true&w=majority",
    db_name="kongsberg"  # Replace with your database name
)
