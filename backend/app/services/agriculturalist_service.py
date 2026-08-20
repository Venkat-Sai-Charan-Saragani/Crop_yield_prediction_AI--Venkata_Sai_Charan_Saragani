# ============================================================
# AGRICULTURALIST SERVICE
# backend/app/services/agriculturalist_service.py
# ============================================================

from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException
from passlib.context import CryptContext

from backend.app.database.agriculturalist_db import (
    agriculturalist_collection,
)

from backend.app.models.agriculturalist_model import (
    agriculturalist_document,
)

from backend.app.agriculturalist.agriculturalist_auth import (
    create_agriculturalist_token,
)


# ============================================================
# PASSWORD HASHING
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


# ============================================================
# HELPERS
# ============================================================

def get_object_id(value):
    """
    Safely convert a value into MongoDB ObjectId.
    """

    if value is None:
        return None

    try:
        return ObjectId(str(value))

    except Exception:
        return None


def serialize_datetime(value):
    """
    Convert datetime values to ISO strings.
    Leave other values unchanged.
    """

    if hasattr(value, "isoformat"):
        return value.isoformat()

    return value


# ============================================================
# SERIALIZE AGRICULTURALIST
# ============================================================

def serialize_agriculturalist(document):

    if not document:
        return None

    document_id = document.get("_id")

    reviewed_by = document.get(
        "reviewed_by"
    )

    return {

        "id":
            str(document_id)
            if document_id is not None
            else None,

        "_id":
            str(document_id)
            if document_id is not None
            else None,

        "full_name":
            document.get(
                "full_name",
                "",
            ),

        "name":
            document.get(
                "full_name",
                "",
            ),

        "email":
            document.get(
                "email",
                "",
            ),

        "profile_image":
            document.get(
                "profile_image",
                None,
            ),

        "specialization":
            document.get(
                "specialization",
                "",
            ),

        "experience_years":
            document.get(
                "experience_years",
                0,
            ),

        "state":
            document.get(
                "state",
                "",
            ),

        "district":
            document.get(
                "district",
                "",
            ),

        # ====================================================
        # VERIFICATION INFORMATION
        # ====================================================

        "government_id":
            document.get(
                "government_id",
                "",
            ),

        "issuing_authority":
            document.get(
                "issuing_authority",
                "",
            ),

        "verification_document":
            document.get(
                "verification_document",
                None,
            ),

        "verification_document_name":
            document.get(
                "verification_document_name",
                None,
            ),

        "verification_submitted_at":
            serialize_datetime(
                document.get(
                    "verification_submitted_at"
                )
            ),

        "reviewed_at":
            serialize_datetime(
                document.get(
                    "reviewed_at"
                )
            ),

        "reviewed_by":
            (
                str(reviewed_by)
                if reviewed_by
                else None
            ),

        "rejection_reason":
            document.get(
                "rejection_reason",
                "",
            ),

        # ====================================================
        # ACCOUNT
        # ====================================================

        "availability":
            document.get(
                "availability",
                False,
            ),

        "status":
            document.get(
                "status",
                "pending",
            ),

        "is_active":
            document.get(
                "status",
                "pending",
            ) == "active",

        "role":
            "agriculturalist",

        # ====================================================
        # TIMESTAMPS
        # ====================================================

        "created_at":
            serialize_datetime(
                document.get(
                    "created_at"
                )
            ),

        "updated_at":
            serialize_datetime(
                document.get(
                    "updated_at"
                )
            ),
    }


# ============================================================
# FIND AGRICULTURALIST BY ID
# ============================================================

def find_agriculturalist_by_id(
    agriculturalist_id: str,
):

    object_id = get_object_id(
        agriculturalist_id
    )

    if object_id is None:
        return None

    try:

        return agriculturalist_collection.find_one(
            {
                "_id": object_id
            }
        )

    except Exception as error:

        print(
            "FIND AGRICULTURALIST ERROR:",
            error,
        )

        return None


# ============================================================
# GET AGRICULTURALIST BY ID
# ============================================================
#
# IMPORTANT:
# This is the function that fixes:
#
# ImportError:
# cannot import name 'get_agriculturalist_by_id'
#
# ============================================================

def get_agriculturalist_by_id(
    agriculturalist_id: str,
):

    object_id = get_object_id(
        agriculturalist_id
    )

    if object_id is None:

        raise HTTPException(
            status_code=400,
            detail="Invalid agriculturalist ID.",
        )

    agriculturalist = (
        agriculturalist_collection.find_one(
            {
                "_id": object_id
            }
        )
    )

    if not agriculturalist:

        raise HTTPException(
            status_code=404,
            detail="Agriculturalist not found.",
        )

    return {
        "success": True,
        "agriculturalist":
            serialize_agriculturalist(
                agriculturalist
            ),
    }


# ============================================================
# GET ADMIN AGRICULTURALIST
# ============================================================
#
# Compatibility alias.
#
# Some existing code may import:
#
# get_admin_agriculturalist
#
# Keep both names available.
#
# ============================================================

def get_admin_agriculturalist(
    agriculturalist_id: str,
):

    return get_agriculturalist_by_id(
        agriculturalist_id
    )


# ============================================================
# FIND USER BY ID
# ============================================================

def find_user_by_id(
    user_id: str,
):

    try:

        from backend.app.database import (
            users_collection,
        )

    except Exception as error:

        print(
            "USER DATABASE IMPORT ERROR:",
            error,
        )

        return None

    if not user_id:
        return None

    user_object_id = get_object_id(
        user_id
    )

    if user_object_id is None:
        return None

    try:

        return users_collection.find_one(
            {
                "_id": user_object_id
            }
        )

    except Exception as error:

        print(
            "USER LOOKUP ERROR:",
            error,
        )

        return None


# ============================================================
# REGISTER AGRICULTURALIST
# ============================================================

def register_agriculturalist(
    data,
):

    # ========================================================
    # CLEAN INPUT
    # ========================================================

    email = (
        str(
            getattr(
                data,
                "email",
                "",
            )
        )
        .strip()
        .lower()
    )

    full_name = (
        str(
            getattr(
                data,
                "full_name",
                "",
            )
            or ""
        )
        .strip()
    )

    specialization = (
        getattr(
            data,
            "specialization",
            "",
        )
        or ""
    ).strip()

    government_id = (
        str(
            getattr(
                data,
                "government_id",
                "",
            )
            or ""
        )
        .strip()
    )

    password = (
        getattr(
            data,
            "password",
            "",
        )
        or ""
    )

    # ========================================================
    # VALIDATION
    # ========================================================

    if not full_name:

        raise HTTPException(
            status_code=400,
            detail="Full name is required.",
        )

    if not email:

        raise HTTPException(
            status_code=400,
            detail="Email is required.",
        )

    if not password:

        raise HTTPException(
            status_code=400,
            detail="Password is required.",
        )

    if len(password) < 6:

        raise HTTPException(
            status_code=400,
            detail=(
                "Password must be at least "
                "6 characters long."
            ),
        )

    if not government_id:

        raise HTTPException(
            status_code=400,
            detail="Government ID is required.",
        )

    # ========================================================
    # CHECK EXISTING ACCOUNT
    # ========================================================

    existing = (
        agriculturalist_collection.find_one(
            {
                "email": email
            }
        )
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail=(
                "An agriculturalist account "
                "with this email already exists."
            ),
        )

    # ========================================================
    # HASH PASSWORD
    # ========================================================

    try:

        hashed_password = (
            pwd_context.hash(
                password
            )
        )

    except Exception as error:

        print(
            "PASSWORD HASH ERROR:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to secure account password.",
        )

    # ========================================================
    # CREATE DOCUMENT
    # ========================================================

    document = agriculturalist_document(

        full_name=
            full_name,

        email=
            email,

        hashed_password=
            hashed_password,

        specialization=
            specialization,

        government_id=
            government_id,

        experience_years=
            getattr(
                data,
                "experience_years",
                0,
            ),

        state=(
            getattr(
                data,
                "state",
                "",
            )
            or ""
        ).strip(),

        district=(
            getattr(
                data,
                "district",
                "",
            )
            or ""
        ).strip(),
    )

    # ========================================================
    # ROLE
    # ========================================================

    document["role"] = (
        "agriculturalist"
    )

    # ========================================================
    # ACCOUNT STATUS
    # ========================================================

    document["status"] = (
        "pending"
    )

    document["availability"] = (
        False
    )

    # ========================================================
    # VERIFICATION INFORMATION
    # ========================================================

    document["issuing_authority"] = (
        getattr(
            data,
            "issuing_authority",
            "",
        )
        or ""
    ).strip()

    document["verification_document"] = (
        getattr(
            data,
            "verification_document",
            None,
        )
    )

    document["verification_document_name"] = (
        getattr(
            data,
            "verification_document_name",
            None,
        )
    )

    now = datetime.now(
        timezone.utc
    )

    document["verification_submitted_at"] = now
    document["reviewed_at"] = None
    document["reviewed_by"] = None
    document["rejection_reason"] = ""
    document["created_at"] = now
    document["updated_at"] = now

    # ========================================================
    # INSERT INTO MONGODB
    # ========================================================

    try:

        result = (
            agriculturalist_collection
            .insert_one(
                document
            )
        )

    except Exception as error:

        print(
            "AGRICULTURALIST REGISTER ERROR:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to create "
                "agriculturalist account."
            ),
        )

    # ========================================================
    # SAVED DOCUMENT
    # ========================================================

    saved_document = {
        **document,
        "_id":
            result.inserted_id,
    }

    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "success":
            True,

        "message":
            (
                "Registration submitted successfully. "
                "Your account is now pending admin verification."
            ),

        "status":
            "pending",

        "role":
            "agriculturalist",

        "agriculturalist":
            serialize_agriculturalist(
                saved_document
            ),
    }


# ============================================================
# LOGIN AGRICULTURALIST
# ============================================================

def login_agriculturalist(
    data,
):

    email = (
        str(
            getattr(
                data,
                "email",
                "",
            )
        )
        .strip()
        .lower()
    )

    password = (
        getattr(
            data,
            "password",
            "",
        )
        or ""
    )

    # ========================================================
    # FIND ACCOUNT
    # ========================================================

    agriculturalist = (
        agriculturalist_collection.find_one(
            {
                "email": email
            }
        )
    )

    if not agriculturalist:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    # ========================================================
    # PASSWORD
    # ========================================================

    stored_password = (
        agriculturalist.get(
            "hashed_password"
        )
        or agriculturalist.get(
            "password"
        )
        or ""
    )

    if not stored_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    # ========================================================
    # VERIFY PASSWORD
    # ========================================================

    try:

        password_valid = (
            pwd_context.verify(
                password,
                stored_password,
            )
        )

    except Exception:

        password_valid = False

    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    # ========================================================
    # ACCOUNT STATUS
    # ========================================================

    account_status = (
        agriculturalist.get(
            "status",
            "pending",
        )
    )

    # ========================================================
    # PENDING
    # ========================================================

    if account_status == "pending":

        raise HTTPException(
            status_code=403,
            detail=(
                "Your agriculturalist account "
                "is awaiting admin verification."
            ),
        )

    # ========================================================
    # REJECTED
    # ========================================================

    if account_status == "rejected":

        rejection_reason = (
            agriculturalist.get(
                "rejection_reason",
                "",
            )
        )

        if rejection_reason:

            raise HTTPException(
                status_code=403,
                detail=(
                    "Your agriculturalist application "
                    "was rejected. Reason: "
                    + rejection_reason
                ),
            )

        raise HTTPException(
            status_code=403,
            detail=(
                "Your agriculturalist application "
                "was rejected by the administrator."
            ),
        )

    # ========================================================
    # SUSPENDED
    # ========================================================

    if account_status == "suspended":

        raise HTTPException(
            status_code=403,
            detail=(
                "Your agriculturalist account "
                "has been suspended."
            ),
        )

    # ========================================================
    # ONLY ACTIVE ACCOUNTS CAN LOGIN
    # ========================================================

    if account_status != "active":

        raise HTTPException(
            status_code=403,
            detail=(
                "Your agriculturalist account "
                "is not approved."
            ),
        )

    # ========================================================
    # CREATE TOKEN
    # ========================================================

    token = (
        create_agriculturalist_token(
            str(
                agriculturalist["_id"]
            ),
            agriculturalist["email"],
        )
    )

    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "success":
            True,

        "message":
            "Login successful.",

        "token":
            token,

        "access_token":
            token,

        "role":
            "agriculturalist",

        "agriculturalist":
            serialize_agriculturalist(
                agriculturalist
            ),
    }


# ============================================================
# GET AVAILABLE AGRICULTURALISTS
# ============================================================

def get_available_agriculturalists():

    try:

        agriculturalists = (
            agriculturalist_collection.find(
                {
                    "status": "active",
                    "availability": True,
                }
            )
            .sort(
                "created_at",
                -1,
            )
        )

        agriculturalist_list = []

        for agriculturalist in agriculturalists:

            agriculturalist_list.append(
                serialize_agriculturalist(
                    agriculturalist
                )
            )

        return {

            "success":
                True,

            "count":
                len(
                    agriculturalist_list
                ),

            "agriculturalists":
                agriculturalist_list,
        }

    except Exception as error:

        print(
            "GET AVAILABLE AGRICULTURALISTS ERROR:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to retrieve "
                "available agriculturalists."
            ),
        )


# ============================================================
# GET AGRICULTURALIST PROFILE
# ============================================================

def get_agriculturalist_profile(
    agriculturalist_id: str,
):

    return get_agriculturalist_by_id(
        agriculturalist_id
    )


# ============================================================
# UPDATE AGRICULTURALIST PROFILE
# ============================================================

def update_agriculturalist_profile(
    agriculturalist_id: str,
    data,
):

    object_id = get_object_id(
        agriculturalist_id
    )

    if object_id is None:

        raise HTTPException(
            status_code=400,
            detail="Invalid agriculturalist ID.",
        )

    existing = (
        agriculturalist_collection.find_one(
            {
                "_id": object_id
            }
        )
    )

    if not existing:

        raise HTTPException(
            status_code=404,
            detail="Agriculturalist not found.",
        )

    # ========================================================
    # CONVERT PYDANTIC MODEL
    # ========================================================

    if hasattr(
        data,
        "model_dump",
    ):

        update_data = data.model_dump(
            exclude_none=True
        )

    elif hasattr(
        data,
        "dict",
    ):

        update_data = data.dict(
            exclude_none=True
        )

    else:

        update_data = {}

    # ========================================================
    # PROTECTED ACCOUNT FIELDS
    # ========================================================

    protected_fields = [

        "email",

        "password",

        "hashed_password",

        "role",

        "status",

        "reviewed_by",

        "reviewed_at",

        "rejection_reason",

    ]

    for field in protected_fields:

        update_data.pop(
            field,
            None,
        )

    # ========================================================
    # PROTECTED VERIFICATION FIELDS
    # ========================================================

    verification_fields = [

        "government_id",

        "issuing_authority",

        "verification_document",

        "verification_document_name",

        "verification_submitted_at",

    ]

    for field in verification_fields:

        update_data.pop(
            field,
            None,
        )

    # ========================================================
    # NOTHING TO UPDATE
    # ========================================================

    if not update_data:

        return get_agriculturalist_profile(
            agriculturalist_id
        )

    # ========================================================
    # UPDATED TIMESTAMP
    # ========================================================

    update_data["updated_at"] = (
        datetime.now(
            timezone.utc
        )
    )

    # ========================================================
    # UPDATE DATABASE
    # ========================================================

    try:

        result = (
            agriculturalist_collection
            .update_one(

                {
                    "_id": object_id
                },

                {
                    "$set":
                        update_data
                },
            )
        )

    except Exception as error:

        print(
            "AGRICULTURALIST PROFILE UPDATE ERROR:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to update "
                "agriculturalist profile."
            ),
        )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Agriculturalist not found.",
        )

    return get_agriculturalist_profile(
        agriculturalist_id
    )


# ============================================================
# ADMIN
# GET PENDING AGRICULTURALISTS
# ============================================================

def get_pending_agriculturalists():

    try:

        cursor = (
            agriculturalist_collection
            .find(
                {
                    "status": "pending"
                }
            )
            .sort(
                "created_at",
                -1,
            )
        )

        agriculturalists = []

        for document in cursor:

            agriculturalists.append(
                serialize_agriculturalist(
                    document
                )
            )

        return {

            "success":
                True,

            "count":
                len(
                    agriculturalists
                ),

            "agriculturalists":
                agriculturalists,

        }

    except Exception as error:

        print(
            "GET PENDING AGRICULTURALISTS ERROR:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load pending "
                "agriculturalists."
            ),
        )


# ============================================================
# ADMIN
# GET ALL AGRICULTURALISTS
# ============================================================

def get_all_agriculturalists():

    try:

        cursor = (
            agriculturalist_collection
            .find({})
            .sort(
                "created_at",
                -1,
            )
        )

        agriculturalists = []

        for document in cursor:

            agriculturalists.append(
                serialize_agriculturalist(
                    document
                )
            )

        return {

            "success":
                True,

            "count":
                len(
                    agriculturalists
                ),

            "agriculturalists":
                agriculturalists,

        }

    except Exception as error:

        print(
            "GET ALL AGRICULTURALISTS ERROR:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load "
                "agriculturalists."
            ),
        )


# ============================================================
# ADMIN
# GET AGRICULTURALIST VERIFICATION REQUESTS
# ============================================================
#
# Kept for compatibility with existing admin routes.
#
# ============================================================

def get_agriculturalist_verification_requests():

    result = get_pending_agriculturalists()

    return {

        "success":
            result["success"],

        "count":
            result["count"],

        "requests":
            result["agriculturalists"],

        "agriculturalists":
            result["agriculturalists"],

    }


# ============================================================
# ADMIN
# REVIEW AGRICULTURALIST
# ============================================================

def review_agriculturalist(
    agriculturalist_id: str,
    decision: str,
    admin_id: str | None = None,
    rejection_reason: str | None = None,
):

    # ========================================================
    # VALIDATE ID
    # ========================================================

    object_id = get_object_id(
        agriculturalist_id
    )

    if object_id is None:

        raise HTTPException(
            status_code=400,
            detail="Invalid agriculturalist ID.",
        )

    # ========================================================
    # NORMALIZE DECISION
    # ========================================================

    decision = (
        str(decision)
        .strip()
        .lower()
    )

    if decision not in [
        "approve",
        "reject",
    ]:

        raise HTTPException(
            status_code=400,
            detail=(
                "Decision must be "
                "'approve' or 'reject'."
            ),
        )

    # ========================================================
    # FIND AGRICULTURALIST
    # ========================================================

    agriculturalist = (
        agriculturalist_collection.find_one(
            {
                "_id": object_id
            }
        )
    )

    if not agriculturalist:

        raise HTTPException(
            status_code=404,
            detail="Agriculturalist not found.",
        )

    # ========================================================
    # CHECK CURRENT STATUS
    # ========================================================

    current_status = (
        agriculturalist.get(
            "status",
            "pending",
        )
    )

    if current_status != "pending":

        raise HTTPException(
            status_code=400,
            detail=(
                "This agriculturalist application "
                "has already been reviewed."
            ),
        )

    now = datetime.now(
        timezone.utc
    )

    # ========================================================
    # APPROVE
    # ========================================================

    if decision == "approve":

        update_data = {

            "status":
                "active",

            "availability":
                True,

            "reviewed_at":
                now,

            "reviewed_by":
                admin_id,

            "rejection_reason":
                "",

            "updated_at":
                now,

        }

        message = (
            "Agriculturalist application "
            "approved successfully."
        )

    # ========================================================
    # REJECT
    # ========================================================

    else:

        clean_reason = (
            rejection_reason
            or ""
        ).strip()

        if not clean_reason:

            raise HTTPException(
                status_code=400,
                detail=(
                    "A rejection reason "
                    "is required."
                ),
            )

        update_data = {

            "status":
                "rejected",

            "availability":
                False,

            "reviewed_at":
                now,

            "reviewed_by":
                admin_id,

            "rejection_reason":
                clean_reason,

            "updated_at":
                now,

        }

        message = (
            "Agriculturalist application "
            "rejected."
        )

    # ========================================================
    # UPDATE DATABASE
    # ========================================================

    try:

        result = (
            agriculturalist_collection
            .update_one(

                {
                    "_id": object_id
                },

                {
                    "$set":
                        update_data
                },

            )
        )

    except Exception as error:

        print(
            "AGRICULTURALIST REVIEW ERROR:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to update "
                "agriculturalist application."
            ),
        )

    # ========================================================
    # CHECK UPDATE
    # ========================================================

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Agriculturalist not found.",
        )

    # ========================================================
    # GET UPDATED DOCUMENT
    # ========================================================

    updated = (
        agriculturalist_collection.find_one(
            {
                "_id": object_id
            }
        )
    )

    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "success":
            True,

        "message":
            message,

        "agriculturalist":
            serialize_agriculturalist(
                updated
            ),

    }


# ============================================================
# ADMIN
# APPROVE AGRICULTURALIST
# ============================================================

def approve_agriculturalist(
    agriculturalist_id: str,
    admin_id: str | None = None,
):

    return review_agriculturalist(

        agriculturalist_id=
            agriculturalist_id,

        decision=
            "approve",

        admin_id=
            admin_id,

    )


# ============================================================
# ADMIN
# REJECT AGRICULTURALIST
# ============================================================

def reject_agriculturalist(
    agriculturalist_id: str,
    admin_id: str | None = None,
    rejection_reason: str | None = None,
):

    return review_agriculturalist(

        agriculturalist_id=
            agriculturalist_id,

        decision=
            "reject",

        admin_id=
            admin_id,

        rejection_reason=
            rejection_reason,

    )