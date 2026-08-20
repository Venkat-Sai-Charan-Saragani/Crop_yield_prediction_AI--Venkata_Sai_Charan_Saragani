# ============================================================
# ADMIN AUTHENTICATION DEPENDENCIES
# backend/app/auth/admin_dependencies.py
# ============================================================

from typing import Any, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)

from backend.app.utils.jwt import decode_access_token


# ============================================================
# SECURITY
# ============================================================

security = HTTPBearer(
    auto_error=False
)


# ============================================================
# GET CURRENT ADMIN
# ============================================================

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
) -> Dict[str, Any]:

    # --------------------------------------------------------
    # CHECK AUTHORIZATION HEADER
    # --------------------------------------------------------

    if credentials is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "Administrator authentication required."
            ),
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    # --------------------------------------------------------
    # GET JWT TOKEN
    # --------------------------------------------------------

    token = credentials.credentials


    if not token:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "Administrator authentication "
                "token is missing."
            ),
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    # --------------------------------------------------------
    # DECODE JWT TOKEN
    # --------------------------------------------------------

    try:

        payload = decode_access_token(
            token
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "Invalid or expired "
                "administrator token."
            ),
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    # --------------------------------------------------------
    # MAKE SURE PAYLOAD EXISTS
    # --------------------------------------------------------

    if not payload:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "Invalid administrator "
                "authentication token."
            ),
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    # --------------------------------------------------------
    # CHECK ADMIN ROLE
    # --------------------------------------------------------

    role = (
        payload.get("role")
        or payload.get("user_role")
    )


    if role != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Administrator privileges "
                "are required."
            ),
        )


    # --------------------------------------------------------
    # GET ADMIN ID
    #
    # Your admin login JWT uses:
    #
    # "sub": str(existing_user["_id"])
    #
    # Therefore we normalize "sub" into "_id"
    # so admin_routes.py can safely use:
    #
    # current_admin["_id"]
    # --------------------------------------------------------

    admin_id = (
        payload.get("sub")
        or payload.get("_id")
        or payload.get("id")
        or payload.get("user_id")
    )


    # --------------------------------------------------------
    # ADMIN ID IS REQUIRED
    # --------------------------------------------------------

    if not admin_id:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "Invalid administrator token: "
                "missing administrator ID."
            ),
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    # --------------------------------------------------------
    # NORMALIZE ADMIN PAYLOAD
    # --------------------------------------------------------

    admin_payload: Dict[str, Any] = {

        # MongoDB-compatible admin ID
        "_id":
            str(admin_id),

        # Also expose standard ID names
        "id":
            str(admin_id),

        "user_id":
            str(admin_id),

        # JWT subject
        "sub":
            str(admin_id),

        # Admin email
        "email":
            payload.get(
                "email",
                ""
            ),

        # Guaranteed admin role
        "role":
            "admin",

    }


    # --------------------------------------------------------
    # KEEP OPTIONAL JWT FIELDS
    # --------------------------------------------------------

    if "exp" in payload:

        admin_payload["exp"] = (
            payload["exp"]
        )


    if "iat" in payload:

        admin_payload["iat"] = (
            payload["iat"]
        )


    # --------------------------------------------------------
    # RETURN CURRENT ADMIN
    # --------------------------------------------------------

    return admin_payload