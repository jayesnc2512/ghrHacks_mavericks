# app/routes/app_routes.py
from fastapi import APIRouter, HTTPException, Body
from ._models import UserLogin, UserDetails,CreateUser
from ..controllers.auth_controller import authController


router = APIRouter()

@router.post("/create-user")
async def create_user(user: CreateUser):
    try:
        result=authController.createUser(user)
        if result["status"]==200:
            return {"status":200,"message": "User created successfully", "data": result}
        else:
            return {"status": 400, "message": result["message"]}
    except Exception as err:
        print(f"Error in create user router",err)
        raise HTTPException(status_code=400, detail="Invalid credentials")



@router.post('/kiosk-login')
async def kioskLogin(user:UserLogin):
    try:
        res=authController.kioskLogin(user)
        if res:
            return {"status":200,"message": "Login successful","user":res}
        raise HTTPException(status_code=400, detail="Invalid credentials")
    except Exception as e:
        print("error in kiosk-login router",e)
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
        
@router.post('/user-login')
async def userLogin(user:UserLogin):
    try:
        user= authController.userLogin(user)
        if user:
            return {"status":200,"message": "Login successful","user":user}
    except:
        raise HTTPException(status_code=400, detail="Invalid credentials")
