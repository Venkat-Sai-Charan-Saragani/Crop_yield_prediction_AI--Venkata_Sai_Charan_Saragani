# ============================================================
# NOTIFICATION SERVICE
# ============================================================

from bson import ObjectId

from fastapi import HTTPException

from backend.app.database.agriculturalist_db import (
    notification_collection
)

from backend.app.models.notification_model import (
    notification_document
)


# ============================================================
# CREATE NOTIFICATION
# ============================================================

def create_notification(
    recipient_type: str,
    recipient_id: str,
    title: str,
    message: str,
    notification_type: str,
    prediction_id: str | None = None,
    consultation_id: str | None = None,
):

    document = notification_document(

        recipient_type=
            recipient_type,

        recipient_id=
            recipient_id,

        title=
            title,

        message=
            message,

        notification_type=
            notification_type,

        prediction_id=
            prediction_id,

        consultation_id=
            consultation_id,

    )

    result = notification_collection.insert_one(
        document
    )

    return str(
        result.inserted_id
    )


# ============================================================
# GET NOTIFICATIONS
# ============================================================

def get_notifications(
    recipient_type: str,
    recipient_id: str
):

    notifications = list(
        notification_collection.find(
            {
                "recipient_type":
                    recipient_type,

                "recipient_id":
                    recipient_id,

            }
        ).sort(
            "created_at",
            -1
        ).limit(100)
    )

    output = []

    for notification in notifications:

        output.append({

            "id":
                str(notification["_id"]),

            "title":
                notification.get(
                    "title"
                ),

            "message":
                notification.get(
                    "message"
                ),

            "notification_type":
                notification.get(
                    "notification_type"
                ),

            "prediction_id":
                notification.get(
                    "prediction_id"
                ),

            "consultation_id":
                notification.get(
                    "consultation_id"
                ),

            "is_read":
                notification.get(
                    "is_read",
                    False
                ),

            "created_at":
                notification.get(
                    "created_at"
                ),

        })

    return {

        "success":
            True,

        "notifications":
            output,

        "unread_count":
            sum(
                1
                for item in output
                if not item["is_read"]
            ),

    }


# ============================================================
# MARK AS READ
# ============================================================

def mark_notification_read(
    notification_id: str,
    recipient_type: str,
    recipient_id: str
):

    try:

        object_id = ObjectId(
            notification_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid notification ID."
        )

    result = notification_collection.update_one(

        {
            "_id":
                object_id,

            "recipient_type":
                recipient_type,

            "recipient_id":
                recipient_id,

        },

        {
            "$set":
                {
                    "is_read":
                        True
                }
        }

    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Notification not found."
        )

    return {

        "success":
            True,

        "message":
            "Notification marked as read."

    }