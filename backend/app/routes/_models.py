from pydantic import BaseModel,conlist
from typing import Optional,Dict
from typing import List



# Define a Pydantic model for item
class DemoItem(BaseModel):
    name: str
    description: str
    price: float
    quantity: int

class Emp(BaseModel):
    empID:str
    password:str

class UserLogin(BaseModel):
    empID:Optional[str]=None
    userID:Optional[str]=None
    password:str


class CreateUser(BaseModel):
    empID:Optional[str]=None
    userID:Optional[str]=None
    password:str
    name:str
    role:Optional[str]=None
    dept:Optional[str]=None

class UserDetails(BaseModel):
    empID:Optional[str]=None
    userID:Optional[str]=None
    password:str
    name:str
    role:Optional[str]=None
    dept:Optional[str]=None


class checkImages(BaseModel):
    empID: str
    images: List[str]


class LogDetails(BaseModel):
    gloves: bool
    helmet: bool
    glasses: bool
    jacket: bool
    boots: bool

class KioskLog(BaseModel):
    empID: str
    log: LogDetails
    