
# app/controllers/auth_controller.py
from app.DB.mongodb import mongodb_client
from app.routes._models import UserLogin, UserDetails
from pymongo.collection import Collection
from typing import Dict, Optional
from bson import ObjectId
from pymongo.errors import PyMongoError



class authController:
    collection: Collection = mongodb_client.get_collection("users")

    def kioskLogin(cred):
        try:
            query = {}
            if cred.empID:
                query["empID"] = cred.empID
            else:
                return None
        
            user = authController.collection.find_one(query)  
            print("user",user)
            if user and user.get("password") == cred.password:
                print("password in db",user.get("password"))
                print(cred.password)
                return {
                    "empID": user["empID"],
                    "name": user["name"],
                    "role": user["role"],
                    "dept":user["dept"]
                }
            return None
        except Exception as e:
            print("error in authController.kioskLogin",e)
    

    def userLogin(cred):
        try:
            query = {}
            if cred.userID:
                query["userID"] = cred.userID
            else:
                return None
        
            user = authController.collection.find_one(query)  
            print("user",user)
            if user and user.get("password") == cred.password:
                print("password in db",user.get("password"))
                print(cred.password)
                return {
                    "empID": user["empID"],
                    "name": user["name"],
                    "role": user["role"],
                    "dept":user["dept"]
                }
            return None
        except Exception as e:
            print("error in authController.kioskLogin",e)
    

    

   # Controller function to create a user
    def createUser(user):
        try:
            user_data = user.dict()  # Convert user to dictionary format
            # Check if a user with the same userID or empID already exists
            existing_user = authController.collection.find_one({
                "$or": [
                    {"userID": user_data.get("userID")},
                    {"empID": user_data.get("empID")}
                ]
            })

            if existing_user:
                return {"status":400,"message": "User already exists"}

            # If no such user exists, insert the new user
            result = authController.collection.insert_one(user_data)
            print("result",result)
            # Return inserted_id as a string
            return {"status": 200 , "data": str(result)}
        
        except PyMongoError as e:
            print(f"Database error occurred: {e}")
            return {"status": 500, "message": "Database error occurred"}
