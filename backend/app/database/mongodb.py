import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

# Path to backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]


#collections
user_collections = db["users"]
farm_collections = db["farms"]
crop_collections = db["crops"]

def get_database():
    return db