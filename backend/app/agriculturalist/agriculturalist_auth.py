# ============================================================
# AGRICULTURALIST AUTHENTICATION
# backend/app/agriculturalist/agriculturalist_auth.py
# ============================================================

import os

from datetime import (
    datetime,
    timedelta,
    timezone,
)

from typing import Optional

from jose import (
    JWTError,
    jwt,
)

from fastapi import (
    Depends,
    HTTPException,
    status,
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials,
)


# ============================================================
# JWT CONFIGURATION
# ============================================================

SECRET_KEY = (
    os.getenv("SECRET_KEY")
    or os.getenv("JWT_SECRET_KEY")
    or "CHANGE_THIS_SECRET_KEY"
)

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256",
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "1440",
    )
)


# ============================================================
# SECURITY
# ============================================================

security = HTTPBearer(
    auto_error=False
)


# ============================================================
# CREATE AGRICULTURALIST TOKEN
# ============================================================

def create_agriculturalist_token(
    agriculturalist_id: str,
    email: str,
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {

        "sub": str(
            agriculturalist_id
        ),

        "email": email,

        "role": "agriculturalist",

        "user_type": "agriculturalist",

        "exp": expire,
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return token


# ============================================================
# DECODE TOKEN
# ============================================================

def decode_agriculturalist_token(
    token: str,
) -> dict:

    if not token:

        raise HTTPException(

            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),

            detail=(
                "Agriculturalist token is missing."
            ),

            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[
                ALGORITHM
            ],
        )

        return payload

    except JWTError as error:

        print(
            "AGRICULTURALIST JWT ERROR:",
            str(error),
        )

        raise HTTPException(

            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),

            detail=(
                "Invalid or expired "
                "agriculturalist authentication token."
            ),

            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


# ============================================================
# CURRENT AGRICULTURALIST
# ============================================================

def get_current_agriculturalist(
    credentials: Optional[
        HTTPAuthorizationCredentials
    ] = Depends(security),
):

    # --------------------------------------------------------
    # CHECK AUTHORIZATION HEADER
    # --------------------------------------------------------

    if credentials is None:

        raise HTTPException(

            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),

            detail=(
                "Agriculturalist authentication required."
            ),

            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # --------------------------------------------------------
    # GET TOKEN
    # --------------------------------------------------------

    token = credentials.credentials

    if not token:

        raise HTTPException(

            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),

            detail=(
                "Agriculturalist token is missing."
            ),

            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # --------------------------------------------------------
    # DECODE TOKEN
    # --------------------------------------------------------

    payload = decode_agriculturalist_token(
        token
    )

    # --------------------------------------------------------
    # CHECK ROLE
    # --------------------------------------------------------

    role = payload.get(
        "role"
    )

    user_type = payload.get(
        "user_type"
    )

    if (
        role != "agriculturalist"
        and
        user_type != "agriculturalist"
    ):

        raise HTTPException(

            status_code=(
                status.HTTP_403_FORBIDDEN
            ),

            detail=(
                "Agriculturalist access required."
            ),
        )

    # --------------------------------------------------------
    # GET AGRICULTURALIST ID
    # --------------------------------------------------------

    agriculturalist_id = payload.get(
        "sub"
    )

    if not agriculturalist_id:

        raise HTTPException(

            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),

            detail=(
                "Invalid agriculturalist token: "
                "missing agriculturalist ID."
            ),

            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # --------------------------------------------------------
    # RETURN CURRENT AGRICULTURALIST
    # --------------------------------------------------------

    return {

        "_id": str(
            agriculturalist_id
        ),

        "email": payload.get(
            "email"
        ),

        "role": "agriculturalist",

        "user_type": "agriculturalist",
    }