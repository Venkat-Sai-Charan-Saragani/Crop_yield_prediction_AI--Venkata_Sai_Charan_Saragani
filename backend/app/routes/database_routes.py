from fastapi import APIRouter
from backend.app.database.mongodb import get_database

router = APIRouter()

@router.get("/database")
def database():
    db = get_database()
    return {
        "message" : "MondoDB Connected Sucessfully",
        "database" : db.name,
        "collections" : db.list_collection_names()
    }