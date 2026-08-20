from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.app.utils.jwt import decode_access_token
from backend.app.database.mongodb import get_database

from bson import ObjectId


security = HTTPBearer()


db = get_database()

admin_collection = db["admins"]


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:

        payload = decode_access_token(token)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired admin token",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    if not payload:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    admin_id = payload.get("admin_id")

    role = payload.get("role")


    if not admin_id:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing admin ID",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    if role != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required",
        )


    try:

        admin = admin_collection.find_one(
            {
                "_id": ObjectId(admin_id)
            }
        )

    except Exception:

        admin = None


    if not admin:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Administrator account not found",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    return admin