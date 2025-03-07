from fastapi import APIRouter, HTTPException
from ._models import DemoItem


router = APIRouter()
items = {}

@router.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}

@router.get("/items")
def read_item(item_id: int):
    print(item_id)
    return items.get(item_id, {"error": "Item not found"})

@router.post("/items/")
def create_item(item: DemoItem):
    item_id = len(items) + 1
    items[item_id] = item.model_dump()
    return {"item_id": item_id, **item.model_dump()}