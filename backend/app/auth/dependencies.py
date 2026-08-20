from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId

from backend.app.utils.jwt import verify_token
from backend.app.database.mongodb import get_database


# ============================================================
# HTTP BEARER
# ============================================================

security = HTTPBearer(
    auto_error=True
)


# ============================================================
# DATABASE
# ============================================================

db = get_database()

user_collection = db["users"]


# ============================================================
# GET CURRENT USER
# ============================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    # --------------------------------------------------------
    # Get JWT token
    # --------------------------------------------------------

    token = credentials.credentials


    # --------------------------------------------------------
    # Verify JWT
    # --------------------------------------------------------

    payload = verify_token(token)

    if payload is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )


    # --------------------------------------------------------
    # Get user ID from JWT
    #
    # IMPORTANT:
    # JWT must contain:
    #
    # {
    #     "sub": "<mongodb-user-id>"
    # }
    # --------------------------------------------------------

    user_id = payload.get("sub")


    if not user_id:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user ID",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )


    # --------------------------------------------------------
    # Validate MongoDB ObjectId
    # --------------------------------------------------------

    if not ObjectId.is_valid(user_id):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: invalid user ID",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )


    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    current_user = user_collection.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )


    if not current_user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )


    # --------------------------------------------------------
    # Convert ObjectId to string
    # --------------------------------------------------------

    current_user["_id"] = str(
        current_user["_id"]
    )


    # --------------------------------------------------------
    # Return current user
    # --------------------------------------------------------

    return current_user