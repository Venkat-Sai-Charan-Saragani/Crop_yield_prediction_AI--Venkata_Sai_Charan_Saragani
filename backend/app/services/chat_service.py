from bson import ObjectId
from datetime import datetime, timezone

from backend.app.database.mongodb import (
    prediction_collections,
)

from backend.app.models.chat_model import (
    chat_message_document,
)


# ============================================================
# DATABASE
# ============================================================

def get_database():
    """
    Return the MongoDB database used by the application.
    """

    return prediction_collections.database


# ============================================================
# CHAT COLLECTION
# ============================================================

def get_chat_collection():
    """
    Return the chat_messages collection.
    """

    return get_database()["chat_messages"]


# ============================================================
# USERS COLLECTION
# ============================================================

def get_users_collection():
    """
    Return the users collection.
    """

    return get_database()["users"]


# ============================================================
# CONVERSATION ID
# ============================================================

def make_conversation_id(
    user_one: str,
    user_two: str,
) -> str:

    ids = sorted(
        [
            str(user_one),
            str(user_two),
        ]
    )

    return f"{ids[0]}_{ids[1]}"


# ============================================================
# SEND MESSAGE
# ============================================================

def send_message(
    sender_id: str,
    receiver_id: str,
    message: str,
):

    sender_id = str(sender_id).strip()
    receiver_id = str(receiver_id).strip()
    message = (message or "").strip()

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if not sender_id:

        return {
            "success": False,
            "message": "Sender ID is required.",
        }

    if not receiver_id:

        return {
            "success": False,
            "message": "Receiver ID is required.",
        }

    if not message:

        return {
            "success": False,
            "message": "Message cannot be empty.",
        }

    # --------------------------------------------------------
    # VALIDATE RECEIVER ID
    # --------------------------------------------------------

    if not ObjectId.is_valid(receiver_id):

        return {
            "success": False,
            "message": "Invalid receiver ID.",
        }

    # --------------------------------------------------------
    # FIND RECEIVER
    # --------------------------------------------------------

    users = get_users_collection()

    receiver = users.find_one(
        {
            "_id": ObjectId(receiver_id)
        }
    )

    if not receiver:

        return {
            "success": False,
            "message": "Recipient not found.",
        }

    # --------------------------------------------------------
    # CREATE CONVERSATION ID
    # --------------------------------------------------------

    conversation_id = make_conversation_id(
        sender_id,
        receiver_id,
    )

    # --------------------------------------------------------
    # CREATE MESSAGE DOCUMENT
    # --------------------------------------------------------

    document = chat_message_document(
        conversation_id=conversation_id,

        sender_id=sender_id,

        receiver_id=receiver_id,

        message=message,
    )

    # --------------------------------------------------------
    # INSERT MESSAGE
    # --------------------------------------------------------

    collection = get_chat_collection()

    result = collection.insert_one(
        document
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    created_at = document.get(
        "created_at"
    )

    if hasattr(
        created_at,
        "isoformat"
    ):

        created_at = created_at.isoformat()

    return {

        "success": True,

        "message":
            "Message sent successfully.",

        "data": {

            "id":
                str(
                    result.inserted_id
                ),

            "conversation_id":
                conversation_id,

            "sender_id":
                sender_id,

            "receiver_id":
                receiver_id,

            "message":
                message,

            "is_read":
                False,

            "created_at":
                created_at,
        },
    }


# ============================================================
# GET CONVERSATION
# ============================================================

def get_conversation(
    current_user_id: str,
    other_user_id: str,
):

    current_user_id = str(
        current_user_id
    ).strip()

    other_user_id = str(
        other_user_id
    ).strip()

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if not current_user_id:

        return {
            "success": False,
            "message": "Current user ID is required.",
            "messages": [],
        }

    if not other_user_id:

        return {
            "success": False,
            "message": "Other user ID is required.",
            "messages": [],
        }

    # --------------------------------------------------------
    # CREATE CONVERSATION ID
    # --------------------------------------------------------

    conversation_id = make_conversation_id(
        current_user_id,
        other_user_id,
    )

    collection = get_chat_collection()

    # --------------------------------------------------------
    # GET MESSAGES
    # --------------------------------------------------------

    documents = list(
        collection.find(
            {
                "conversation_id":
                    conversation_id
            }
        ).sort(
            "created_at",
            1
        )
    )

    result = []

    for document in documents:

        created_at = document.get(
            "created_at"
        )

        if hasattr(
            created_at,
            "isoformat"
        ):

            created_at = (
                created_at.isoformat()
            )

        result.append(
            {

                "id":
                    str(
                        document["_id"]
                    ),

                "conversation_id":
                    conversation_id,

                "sender_id":
                    str(
                        document.get(
                            "sender_id",
                            ""
                        )
                    ),

                "receiver_id":
                    str(
                        document.get(
                            "receiver_id",
                            ""
                        )
                    ),

                "message":
                    document.get(
                        "message",
                        ""
                    ),

                "is_read":
                    bool(
                        document.get(
                            "is_read",
                            False
                        )
                    ),

                "created_at":
                    created_at,
            }
        )

    # --------------------------------------------------------
    # MARK RECEIVED MESSAGES AS READ
    # --------------------------------------------------------

    collection.update_many(
        {
            "conversation_id":
                conversation_id,

            "receiver_id":
                current_user_id,

            "is_read":
                False,
        },

        {
            "$set": {
                "is_read": True
            }
        },
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "success": True,

        "conversation_id":
            conversation_id,

        "messages":
            result,
    }