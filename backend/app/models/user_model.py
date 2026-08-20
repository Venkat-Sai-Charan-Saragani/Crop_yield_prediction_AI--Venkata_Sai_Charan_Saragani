from typing import Optional

from pydantic import BaseModel, EmailStr

from backend.app.schemas.user_schema import UserRegister

from backend.app.utils.password import hash_password


# ============================================================
# NORMAL USER
# ============================================================

def create_user_document(
    user: UserRegister
):
    """
    Creates a normal YieldSenseAI user.

    Every user created through normal registration
    automatically receives role = "user".
    """

    return {

        "full_name":
            user.full_name,

        "email":
            user.email,

        "password":
            hash_password(
                user.password
            ),

        # ====================================================
        # AUTHENTICATION
        # ====================================================

        "auth_provider":
            "local",

        "google_id":
            None,

        # ====================================================
        # ROLE
        # ====================================================
        # IMPORTANT:
        # Never accept this value from frontend registration.
        # Normal users are ALWAYS created as "user".

        "role":
            "user",

        # ====================================================
        # PROFILE
        # ====================================================

        "phone_number":
            None,

        "date_of_birth":
            None,

        "location": {

            "state":
                None,

            "district":
                None,

            "village":
                None

        },

        "profile_image":
            None

    }


# ============================================================
# GOOGLE USER
# ============================================================

def create_google_user_document(

    full_name: str,

    email: str,

    google_id: str,

    profile_image: Optional[str] = None

):
    """
    Creates a Google-authenticated normal user.

    Google registration also ALWAYS creates role = "user".
    """

    return {

        "full_name":
            full_name,

        "email":
            email,

        # Google users don't have a local password.

        "password":
            None,

        # ====================================================
        # AUTHENTICATION
        # ====================================================

        "auth_provider":
            "google",

        "google_id":
            google_id,

        # ====================================================
        # ROLE
        # ====================================================
        # IMPORTANT:
        # Google registration can NEVER create an admin.

        "role":
            "user",

        # ====================================================
        # PROFILE
        # ====================================================

        "phone_number":
            None,

        "date_of_birth":
            None,

        "location": {

            "state":
                None,

            "district":
                None,

            "village":
                None

        },

        "profile_image":
            profile_image

    }


# ============================================================
# USER UPDATE MODEL
# ============================================================

class UserUpdate(BaseModel):

    full_name: Optional[str] = None

    email: Optional[EmailStr] = None

    phone: Optional[str] = None

    location: Optional[str] = None

    farm_name: Optional[str] = None

    profile_image: Optional[str] = None

    # ========================================================
    # DO NOT ADD ROLE HERE
    # ========================================================
    #
    # A normal user must not be able to send:
    #
    # {
    #     "role": "admin"
    # }
    #
    # Role changes should only happen through
    # protected backend/admin functionality.