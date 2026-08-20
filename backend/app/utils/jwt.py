from datetime import datetime, timedelta, timezone
from pathlib import Path
import os

from dotenv import load_dotenv
from jose import JWTError, jwt


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

env_path = Path(__file__).resolve().parents[3] / ".env"

load_dotenv(dotenv_path=env_path)


# ============================================================
# JWT CONFIGURATION
# ============================================================

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "30"
    )
)


if not SECRET_KEY:

    raise RuntimeError(
        "SECRET_KEY is not configured in .env"
    )


# ============================================================
# CREATE ACCESS TOKEN
# ============================================================

def create_access_token(data: dict):

    to_encode = data.copy()


    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )


    to_encode.update({
        "exp": expire
    })


    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


    return encoded_jwt


# ============================================================
# VERIFY TOKEN
# ============================================================

def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )


        return payload


    except JWTError:

        return None


# ============================================================
# DECODE ACCESS TOKEN
#
# Optional compatibility helper
# ============================================================

def decode_access_token(token: str):

    return verify_token(token)