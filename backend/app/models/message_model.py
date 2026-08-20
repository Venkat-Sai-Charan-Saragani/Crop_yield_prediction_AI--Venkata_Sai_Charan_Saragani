# ============================================================
# MESSAGE MODEL
# ============================================================

from datetime import datetime, timezone


def message_document(
    consultation_id: str,
    sender_type: str,
    sender_id: str,
    message: str,
):

    return {

        "consultation_id":
            consultation_id,

        "sender_type":
            sender_type,

        "sender_id":
            sender_id,

        "message":
            message.strip(),

        "is_read":
            False,

        "created_at":
            datetime.now(
                timezone.utc
            ),

    }