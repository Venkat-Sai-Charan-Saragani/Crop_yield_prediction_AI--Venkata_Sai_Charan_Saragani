from datetime import datetime, timezone


def chat_message_document(
    conversation_id: str,
    sender_id: str,
    receiver_id: str,
    message: str,
):
    return {
        "conversation_id":
            conversation_id,

        "sender_id":
            str(sender_id),

        "receiver_id":
            str(receiver_id),

        "message":
            message.strip(),

        "is_read": False,

        "created_at":
            datetime.now(timezone.utc),
    }