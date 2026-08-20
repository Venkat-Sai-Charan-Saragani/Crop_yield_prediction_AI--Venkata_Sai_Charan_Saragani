import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError


# ==========================================
# LOAD ENVIRONMENT
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(
    BASE_DIR / ".env"
)


# ==========================================
# ENVIRONMENT VARIABLES
# ==========================================

MONGODB_URL = os.getenv(
    "MONGODB_URL"
)

DATABASE_NAME = os.getenv(
    "DATABASE_NAME"
)


if not MONGODB_URL:
    raise RuntimeError(
        "MONGODB_URL is not configured in backend/.env"
    )


if not DATABASE_NAME:
    raise RuntimeError(
        "DATABASE_NAME is not configured in backend/.env"
    )


# ==========================================
# MONGODB CLIENT
# ==========================================

client = MongoClient(
    MONGODB_URL,

    # Connection settings
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000,

    # TLS
    tls=True,

    # Retry operations
    retryWrites=True,

    # Keep connection alive
    maxPoolSize=50,
    minPoolSize=5,
)


# ==========================================
# DATABASE
# ==========================================

db = client[DATABASE_NAME]


# ==========================================
# COLLECTIONS
# ==========================================

user_collections = db["users"]

farm_collections = db["farms"]

crop_collections = db["crops"]

prediction_collections = db["predictions"]


# ==========================================
# GET DATABASE
# ==========================================

def get_database():

    return db


# ==========================================
# TEST DATABASE CONNECTION
# ==========================================

def test_database_connection():

    try:

        result = client.admin.command(
            "ping"
        )

        print(
            "MongoDB connection successful:",
            result
        )

        return True

    except PyMongoError as error:

        print(
            "MongoDB connection failed:"
        )

        print(error)

        return False