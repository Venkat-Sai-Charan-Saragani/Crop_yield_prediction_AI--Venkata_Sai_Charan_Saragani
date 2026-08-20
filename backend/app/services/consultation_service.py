# ============================================================
# CONSULTATION SERVICE
# ============================================================

from datetime import datetime, timezone

from bson import ObjectId

from fastapi import HTTPException

from backend.app.database.agriculturalist_db import (
    consultation_collection
)

from backend.app.database.agriculturalist_db import (
    agriculturalist_collection
)

from backend.app.models.consultation_model import (
    consultation_document
)

from backend.app.services.notification_service import (
    create_notification
)


# ============================================================
# CREATE CONSULTATION
# ============================================================

def create_consultation(
    user_id: str,
    agriculturalist_id: str,
    prediction_id: str | None = None
):

    try:

        agriculturalist_object_id = ObjectId(
            agriculturalist_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid agriculturalist ID."
        )

    agriculturalist = agriculturalist_collection.find_one(
        {
            "_id":
                agriculturalist_object_id,

            "status":
                "active",

        }
    )

    if not agriculturalist:

        raise HTTPException(

            status_code=404,

            detail=
                "Agriculturalist not found."

        )

    existing_query = {

        "user_id":
            user_id,

        "agriculturalist_id":
            agriculturalist_id,

        "status":
            "open",

    }

    existing = consultation_collection.find_one(
        existing_query
    )

    if existing:

        return {

            "success":
                True,

            "message":
                "Existing consultation opened.",

            "consultation":
                serialize_consultation(
                    existing
                )

        }

    document = consultation_document(

        user_id=
            user_id,

        agriculturalist_id=
            agriculturalist_id,

        prediction_id=
            prediction_id,

    )

    result = consultation_collection.insert_one(
        document
    )

    consultation_id = str(
        result.inserted_id
    )

    create_notification(

        recipient_type=
            "agriculturalist",

        recipient_id=
            agriculturalist_id,

        title=
            "New consultation request",

        message=
            "A user has requested agricultural guidance.",

        notification_type=
            "consultation_request",

        prediction_id=
            prediction_id,

        consultation_id=
            consultation_id,

    )

    return {

        "success":
            True,

        "message":
            "Consultation created successfully.",

        "consultation":
            serialize_consultation(
                {
                    **document,
                    "_id":
                        result.inserted_id
                }
            )

    }


# ============================================================
# SERIALIZE
# ============================================================

def serialize_consultation(
    document
):

    return {

        "id":
            str(document["_id"]),

        "user_id":
            document.get(
                "user_id"
            ),

        "agriculturalist_id":
            document.get(
                "agriculturalist_id"
            ),

        "prediction_id":
            document.get(
                "prediction_id"
            ),

        "status":
            document.get(
                "status"
            ),

        "created_at":
            document.get(
                "created_at"
            ),

        "updated_at":
            document.get(
                "updated_at"
            ),

    }


# ============================================================
# USER CONSULTATIONS
# ============================================================

def get_user_consultations(
    user_id: str
):

    consultations = list(
        consultation_collection.find(
            {
                "user_id":
                    user_id
            }
        ).sort(
            "updated_at",
            -1
        )
    )

    return {

        "success":
            True,

        "consultations":
            [
                serialize_consultation(
                    item
                )
                for item in consultations
            ]

    }


# ============================================================
# AGRICULTURALIST CONSULTATIONS
# ============================================================

def get_agriculturalist_consultations(
    agriculturalist_id: str
):

    consultations = list(
        consultation_collection.find(
            {
                "agriculturalist_id":
                    agriculturalist_id
            }
        ).sort(
            "updated_at",
            -1
        )
    )

    return {

        "success":
            True,

        "consultations":
            [
                serialize_consultation(
                    item
                )
                for item in consultations
            ]

    }