from bson import ObjectId

from backend.app.database.mongodb import get_database

from backend.app.models.user_model import (
    create_user_document,
    create_google_user_document,
)

from backend.app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    UserProfileUpdate,
)

from backend.app.utils.password import (
    verify_password
)

from backend.app.utils.jwt import (
    create_access_token
)

from backend.app.utils.google_auth import (
    verify_google_code
)


# ============================================================
# DATABASE
# ============================================================

db = get_database()

user_collection = db["users"]


# ============================================================
# NORMAL REGISTER
# ============================================================

def register_user(
    user: UserRegister
):

    existing_user = user_collection.find_one(
        {
            "email": user.email
        }
    )

    if existing_user:

        return {
            "success": False,
            "message": "Email already registered"
        }

    user_document = create_user_document(
        user
    )

    result = user_collection.insert_one(
        user_document
    )

    return {
        "success": True,
        "message": "User Registered Successfully",
        "user_id": str(result.inserted_id)
    }


# ============================================================
# NORMAL LOGIN
# ============================================================

def login_user(
    user: UserLogin
):

    existing_user = user_collection.find_one(
        {
            "email": user.email
        }
    )

    if not existing_user:

        return {
            "success": False,
            "message": "User not found"
        }

    # --------------------------------------------------------
    # Google-only account
    # --------------------------------------------------------

    if not existing_user.get(
        "password"
    ):

        return {
            "success": False,
            "message": (
                "This account uses Google Login. "
                "Please continue with Google."
            )
        }

    # --------------------------------------------------------
    # Verify password
    # --------------------------------------------------------

    password_valid = verify_password(
        user.password,
        existing_user["password"]
    )

    if not password_valid:

        return {
            "success": False,
            "message": "Invalid password"
        }

    # ========================================================
    # CREATE JWT
    #
    # IMPORTANT:
    # Use "sub", NOT "user_id"
    #
    # get_current_user() reads:
    #
    # payload.get("sub")
    # ========================================================

    access_token = create_access_token(
        {
            "sub": str(
                existing_user["_id"]
            )
        }
    )

    return {
        "success": True,
        "message": "Login Successful",
        "access_token": access_token,
        "token_type": "bearer"
    }


# ============================================================
# HELPER
# VERIFY GOOGLE ACCOUNT
# ============================================================

def get_google_user_from_code(
    code: str
):

    if not code:
        return None

    google_user = verify_google_code(
        code
    )

    if not google_user:
        return None

    if not google_user.get(
        "email_verified",
        False
    ):

        return None

    google_id = google_user.get(
        "google_id"
    )

    email = google_user.get(
        "email"
    )

    full_name = google_user.get(
        "full_name"
    )

    profile_image = google_user.get(
        "profile_image"
    )

    if not google_id or not email:
        return None

    return {
        "google_id": google_id,
        "email": email,
        "full_name": full_name or "Google User",
        "profile_image": profile_image
    }


# ============================================================
# GOOGLE REGISTER
# ============================================================

def google_register_user(
    code: str
):

    # --------------------------------------------------------
    # VERIFY GOOGLE ACCOUNT
    # --------------------------------------------------------

    google_user = get_google_user_from_code(
        code
    )

    if not google_user:

        return {
            "success": False,
            "message": "Invalid or unverified Google account"
        }

    google_id = google_user[
        "google_id"
    ]

    email = google_user[
        "email"
    ]

    full_name = google_user[
        "full_name"
    ]

    profile_image = google_user[
        "profile_image"
    ]

    # --------------------------------------------------------
    # CHECK GOOGLE ID
    # --------------------------------------------------------

    existing_user = user_collection.find_one(
        {
            "google_id": google_id
        }
    )

    if existing_user:

        return {
            "success": False,
            "message": (
                "This Google account is already "
                "registered. Please login."
            )
        }

    # --------------------------------------------------------
    # CHECK EMAIL
    # --------------------------------------------------------

    existing_email_user = user_collection.find_one(
        {
            "email": email
        }
    )

    if existing_email_user:

        return {
            "success": False,
            "message": (
                "An account with this email already "
                "exists. Please login."
            )
        }

    # --------------------------------------------------------
    # CREATE GOOGLE USER
    # --------------------------------------------------------

    user_document = create_google_user_document(
        full_name=full_name,
        email=email,
        google_id=google_id,
        profile_image=profile_image
    )

    result = user_collection.insert_one(
        user_document
    )

    # --------------------------------------------------------
    # Registration does not create JWT.
    # User goes back to Login.
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "Google Registration Successful",
        "user_id": str(result.inserted_id)
    }


# ============================================================
# GOOGLE LOGIN
# ============================================================

def google_login_user(
    code: str
):

    google_user = get_google_user_from_code(
        code
    )

    if not google_user:

        return {
            "success": False,
            "message": "Invalid or unverified Google account"
        }

    google_id = google_user[
        "google_id"
    ]

    email = google_user[
        "email"
    ]

    full_name = google_user[
        "full_name"
    ]

    profile_image = google_user[
        "profile_image"
    ]

    # --------------------------------------------------------
    # FIND BY GOOGLE ID
    # --------------------------------------------------------

    existing_user = user_collection.find_one(
        {
            "google_id": google_id
        }
    )

    # --------------------------------------------------------
    # IF NOT FOUND, FIND BY EMAIL
    # --------------------------------------------------------

    if not existing_user:

        existing_user = user_collection.find_one(
            {
                "email": email
            }
        )

    # ========================================================
    # EXISTING USER
    # ========================================================

    if existing_user:

        # ----------------------------------------------------
        # Link Google account to local account
        # ----------------------------------------------------

        if not existing_user.get(
            "google_id"
        ):

            user_collection.update_one(
                {
                    "_id": existing_user["_id"]
                },
                {
                    "$set": {
                        "google_id": google_id,
                        "profile_image": profile_image
                    }
                }
            )

        # ====================================================
        # CREATE JWT
        #
        # IMPORTANT:
        # Use "sub", NOT "user_id"
        # ====================================================

        access_token = create_access_token(
            {
                "sub": str(
                    existing_user["_id"]
                )
            }
        )

        return {
            "success": True,
            "message": "Google Login Successful",
            "access_token": access_token,
            "token_type": "bearer"
        }

    # ========================================================
    # NEW USER DURING GOOGLE LOGIN
    #
    # If someone chooses Google Login and doesn't
    # have an account, create the account automatically.
    # ========================================================

    user_document = create_google_user_document(
        full_name=full_name,
        email=email,
        google_id=google_id,
        profile_image=profile_image
    )

    result = user_collection.insert_one(
        user_document
    )

    # ========================================================
    # CREATE JWT FOR NEW GOOGLE USER
    #
    # IMPORTANT:
    # Use "sub", NOT "user_id"
    # ========================================================

    access_token = create_access_token(
        {
            "sub": str(
                result.inserted_id
            )
        }
    )

    return {
        "success": True,
        "message": "Google Registration Successful",
        "access_token": access_token,
        "token_type": "bearer"
    }


# ============================================================
# UPDATE PROFILE
# ============================================================

def update_user_profile(
    user_id: str,
    profile: UserProfileUpdate
):

    # --------------------------------------------------------
    # Validate ObjectId
    # --------------------------------------------------------

    if not ObjectId.is_valid(user_id):

        return {
            "success": False,
            "message": "Invalid user ID"
        }

    update_data = profile.model_dump(
        exclude_none=True
    )

    if not update_data:

        return {
            "success": False,
            "message": "No data provided to update"
        }

    result = user_collection.update_one(
        {
            "_id": ObjectId(user_id)
        },
        {
            "$set": update_data
        }
    )

    if result.modified_count == 0:

        return {
            "success": False,
            "message": "Profile not updated"
        }

    return {
        "success": True,
        "message": "Profile updated successfully"
    }


# ============================================================
# GET PROFILE
# ============================================================

def get_user_profile(
    current_user
):

    return {
        "success": True,
        "user": {

            "id": str(
                current_user["_id"]
            ),

            "full_name": current_user.get(
                "full_name"
            ),

            "email": current_user.get(
                "email"
            ),

            "phone_number": current_user.get(
                "phone_number"
            ),

            "date_of_birth": current_user.get(
                "date_of_birth"
            ),

            "location": current_user.get(
                "location"
            ),

            "profile_image": current_user.get(
                "profile_image"
            )
        }
    }