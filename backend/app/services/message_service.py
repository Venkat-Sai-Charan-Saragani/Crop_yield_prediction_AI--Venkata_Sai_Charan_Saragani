# ============================================================
# MESSAGE SERVICE
# ============================================================

from datetime import datetime, timezone

from bson import ObjectId

from fastapi import HTTPException

from backend.app.database.agriculturalist_db import (
    consultation_collection,
    message_collection,
)

from backend.app.services.notification_service import (
    create_notification
)

from backend.app.models.message_model import (
    message_document
)


# ============================================================
# CHECK CONSULTATION ACCESS
# ============================================================

def get_consultation_for_participant(
    consultation_id: str,
    participant_type: str,
    participant_id: str
):

    try:

        object_id = ObjectId(
            consultation_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid consultation ID."
        )

    consultation = consultation_collection.find_one(
        {
            "_id":
                object_id
        }
    )

    if not consultation:

        raise HTTPException(
            status_code=404,
            detail="Consultation not found."
        )

    allowed = False

    if (
        participant_type ==
        "user"
        and
        consultation.get(
            "user_id"
        ) == participant_id
    ):

        allowed = True

    if (
        participant_type ==
        "agriculturalist"
        and
        consultation.get(
            "agriculturalist_id"
        ) == participant_id
    ):

        allowed = True

    if not allowed:

        raise HTTPException(

            status_code=403,

            detail=
                "You do not have access to this consultation."

        )

    return consultation


# ============================================================
# SEND MESSAGE
# ============================================================

def send_message(
    consultation_id: str,
    sender_type: str,
    sender_id: str,
    message: str
):

    consultation = get_consultation_for_participant(

        consultation_id,

        sender_type,

        sender_id

    )

    if consultation.get(
        "status"
    ) != "open":

        raise HTTPException(

            status_code=400,

            detail=
                "This consultation is closed."

        )

    document = message_document(

        consultation_id=
            consultation_id,

        sender_type=
            sender_type,

        sender_id=
            sender_id,

        message=
            message,

    )

    result = message_collection.insert_one(
        document
    )

    now = datetime.now(
        timezone.utc
    )

    consultation_collection.update_one(

        {
            "_id":
                consultation["_id"]
        },

        {
            "$set":
                {
                    "updated_at":
                        now
                }
        }

    )

    if sender_type == "user":

        recipient_type = "agriculturalist"

        recipient_id = consultation[
            "agriculturalist_id"
        ]

        title = "New message from user"

    else:

        recipient_type = "user"

        recipient_id = consultation[
            "user_id"
        ]

        title = "New message from agriculturalist"

    create_notification(

        recipient_type=
            recipient_type,

        recipient_id=
            recipient_id,

        title=
            title,

        message=
            message[:150],

        notification_type=
            "new_message",

        consultation_id=
            consultation_id,

        prediction_id=
            consultation.get(
                "prediction_id"
            ),

    )

    return {

        "success":
            True,

        "message":
            "Message sent successfully.",

        "data":
            {

                "id":
                    str(result.inserted_id),

                "consultation_id":
                    consultation_id,

                "sender_type":
                    sender_type,

                "sender_id":
                    sender_id,

                "message":
                    message,

                "created_at":
                    document["created_at"],

            }

    }


# ============================================================
# GET MESSAGES
# ============================================================

def get_messages(
    consultation_id: str,
    participant_type: str,
    participant_id: str
):

    get_consultation_for_participant(

        consultation_id,

        participant_type,

        participant_id

    )

    messages = list(
        message_collection.find(
            {
                "consultation_id":
                    consultation_id
            }
        ).sort(
            "created_at",
            1
        )
    )

    output = []

    for item in messages:

        output.append({

            "id":
                str(item["_id"]),

            "consultation_id":
                item.get(
                    "consultation_id"
                ),

            "sender_type":
                item.get(
                    "sender_type"
                ),

            "sender_id":
                item.get(
                    "sender_id"
                ),

            "message":
                item.get(
                    "message"
                ),

            "is_read":
                item.get(
                    "is_read",
                    False
                ),

            "created_at":
                item.get(
                    "created_at"
                ),

        })

    return {

        "success":
            True,

        "messages":
            output

    }