# ============================================================
# NOTIFICATION MODEL
# ============================================================

from datetime import datetime, timezone


def notification_document(
    recipient_type: str,
    recipient_id: str,
    title: str,
    message: str,
    notification_type: str,
    prediction_id: str | None = None,
    consultation_id: str | None = None,
):

    return {

        "recipient_type":
            recipient_type,

        "recipient_id":
            recipient_id,

        "title":
            title,

        "message":
            message,

        "notification_type":
            notification_type,

        "prediction_id":
            prediction_id,

        "consultation_id":
            consultation_id,

        "is_read":
            False,

        "created_at":
            datetime.now(
                timezone.utc
            ),

    }