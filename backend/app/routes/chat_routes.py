from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from backend.app.database.chat_collections import (
    conversations_collection,
    chat_messages_collection,
)

from backend.app.database.mongodb import (
    prediction_collections,
)

from backend.app.auth.dependencies import (
    get_current_user,
)

from backend.app.agriculturalist.agriculturalist_auth import (
    get_current_agriculturalist,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


# ============================================================
# DATABASE
# ============================================================

def get_users_collection():
    return prediction_collections.database["users"]


# ============================================================
# USER -> AGRICULTURALIST
# SEND MESSAGE
#
# POST /chat/message
# ============================================================

@router.post("/message")
def send_message(
    data: dict,
    current_user=Depends(get_current_user),
):

    receiver_id = str(
        data.get("receiver_id") or ""
    ).strip()

    message = (
        data.get("message") or ""
    ).strip()

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if not receiver_id:
        raise HTTPException(
            status_code=400,
            detail="Receiver ID is required.",
        )

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )

    user_id = str(
        current_user["_id"]
    )

    # --------------------------------------------------------
    # VALIDATE AGRICULTURALIST ID
    # --------------------------------------------------------

    if not ObjectId.is_valid(receiver_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid agriculturalist ID.",
        )

    created = datetime.now(timezone.utc)

    # --------------------------------------------------------
    # FIND CONVERSATION
    # --------------------------------------------------------

    conversation = (
        conversations_collection.find_one(
            {
                "user_id": user_id,
                "agriculturalist_id": receiver_id,
            }
        )
    )

    # --------------------------------------------------------
    # CREATE CONVERSATION
    # --------------------------------------------------------

    if not conversation:

        conversation_result = (
            conversations_collection.insert_one(
                {
                    "user_id": user_id,
                    "agriculturalist_id": receiver_id,
                    "last_message": message,
                    "last_message_at": created,
                    "created_at": created,
                    "updated_at": created,
                }
            )
        )

        conversation_id = str(
            conversation_result.inserted_id
        )

    else:

        conversation_id = str(
            conversation["_id"]
        )

        conversations_collection.update_one(
            {
                "_id": conversation["_id"]
            },
            {
                "$set": {
                    "last_message": message,
                    "last_message_at": created,
                    "updated_at": created,
                }
            },
        )

    # --------------------------------------------------------
    # SAVE MESSAGE
    # --------------------------------------------------------

    message_result = (
        chat_messages_collection.insert_one(
            {
                "conversation_id": conversation_id,
                "sender_id": user_id,
                "receiver_id": receiver_id,
                "message": message,
                "is_read": False,
                "created_at": created,
            }
        )
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "Message sent successfully.",
        "chat_message": {
            "id": str(
                message_result.inserted_id
            ),
            "conversation_id": conversation_id,
            "sender_id": user_id,
            "receiver_id": receiver_id,
            "message": message,
            "is_read": False,
            "created_at": created.isoformat(),
        },
    }


# ============================================================
# USER GET ALL CONVERSATIONS
#
# GET /chat/user/conversations
#
# IMPORTANT:
# This MUST be above:
#
# /chat/user/{agriculturalist_id}
# ============================================================

@router.get("/user/conversations")
def get_user_conversations(
    current_user=Depends(get_current_user),
):

    user_id = str(
        current_user["_id"]
    )

    # --------------------------------------------------------
    # FIND ALL USER CONVERSATIONS
    # --------------------------------------------------------

    conversations_cursor = (
        conversations_collection.find(
            {
                "user_id": user_id
            }
        ).sort(
            "last_message_at",
            -1
        )
    )

    conversations = []

    for conversation in conversations_cursor:

        conversation_id = str(
            conversation["_id"]
        )

        agriculturalist_id = str(
            conversation.get(
                "agriculturalist_id",
                ""
            )
        )

        last_message_at = (
            conversation.get(
                "last_message_at"
            )
        )

        if hasattr(
            last_message_at,
            "isoformat"
        ):
            last_message_at = (
                last_message_at.isoformat()
            )

        # ----------------------------------------------------
        # UNREAD MESSAGES
        # ----------------------------------------------------

        unread_count = (
            chat_messages_collection.count_documents(
                {
                    "conversation_id": conversation_id,
                    "receiver_id": user_id,
                    "is_read": False,
                }
            )
        )

        conversations.append(
            {
                "id": conversation_id,
                "conversation_id": conversation_id,
                "user_id": user_id,
                "agriculturalist_id": agriculturalist_id,
                "last_message": conversation.get(
                    "last_message",
                    ""
                ),
                "last_message_at": last_message_at,
                "unread_count": unread_count,
            }
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "User conversations loaded successfully.",
        "conversations": conversations,
    }


# ============================================================
# USER GET ONE CONVERSATION
#
# GET /chat/user/{agriculturalist_id}
# ============================================================

@router.get("/user/{agriculturalist_id}")
def get_user_conversation(
    agriculturalist_id: str,
    current_user=Depends(get_current_user),
):

    user_id = str(
        current_user["_id"]
    )

    agriculturalist_id = str(
        agriculturalist_id
    ).strip()

    # --------------------------------------------------------
    # VALIDATE AGRICULTURALIST ID
    # --------------------------------------------------------

    if not ObjectId.is_valid(
        agriculturalist_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid agriculturalist ID.",
        )

    # --------------------------------------------------------
    # FIND CONVERSATION
    # --------------------------------------------------------

    conversation = (
        conversations_collection.find_one(
            {
                "user_id": user_id,
                "agriculturalist_id": agriculturalist_id,
            }
        )
    )

    # --------------------------------------------------------
    # NO CONVERSATION
    # --------------------------------------------------------

    if not conversation:

        return {
            "success": True,
            "conversation": None,
            "messages": [],
        }

    conversation_id = str(
        conversation["_id"]
    )

    # --------------------------------------------------------
    # GET MESSAGES
    # --------------------------------------------------------

    messages_cursor = (
        chat_messages_collection.find(
            {
                "conversation_id": conversation_id
            }
        ).sort(
            "created_at",
            1
        )
    )

    messages = []

    for item in messages_cursor:

        created_at = item.get(
            "created_at"
        )

        if hasattr(
            created_at,
            "isoformat"
        ):
            created_at = (
                created_at.isoformat()
            )

        messages.append(
            {
                "id": str(
                    item["_id"]
                ),
                "conversation_id": conversation_id,
                "sender_id": str(
                    item.get(
                        "sender_id",
                        ""
                    )
                ),
                "receiver_id": str(
                    item.get(
                        "receiver_id",
                        ""
                    )
                ),
                "message": item.get(
                    "message",
                    ""
                ),
                "is_read": bool(
                    item.get(
                        "is_read",
                        False
                    )
                ),
                "created_at": created_at,
            }
        )

    # --------------------------------------------------------
    # MARK AGRICULTURALIST MESSAGES AS READ
    # --------------------------------------------------------

    chat_messages_collection.update_many(
        {
            "conversation_id": conversation_id,
            "receiver_id": user_id,
            "is_read": False,
        },
        {
            "$set": {
                "is_read": True
            }
        },
    )

    # --------------------------------------------------------
    # LAST MESSAGE DATE
    # --------------------------------------------------------

    last_message_at = (
        conversation.get(
            "last_message_at"
        )
    )

    if hasattr(
        last_message_at,
        "isoformat"
    ):
        last_message_at = (
            last_message_at.isoformat()
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "success": True,
        "conversation": {
            "id": conversation_id,
            "user_id": user_id,
            "agriculturalist_id": agriculturalist_id,
            "last_message": conversation.get(
                "last_message",
                ""
            ),
            "last_message_at": last_message_at,
        },
        "messages": messages,
    }


# ============================================================
# OLD USER CONVERSATION ROUTE
#
# GET /chat/{agriculturalist_id}
#
# KEPT FOR BACKWARD COMPATIBILITY
# ============================================================

@router.get("/{agriculturalist_id}")
def get_conversation(
    agriculturalist_id: str,
    current_user=Depends(get_current_user),
):

    return get_user_conversation(
        agriculturalist_id=agriculturalist_id,
        current_user=current_user,
    )


# ============================================================
# AGRICULTURALIST GET ALL CONVERSATIONS
#
# GET /chat/agriculturalist/conversations
# ============================================================

@router.get(
    "/agriculturalist/conversations"
)
def get_agriculturalist_conversations(
    current_agriculturalist=Depends(
        get_current_agriculturalist
    ),
):

    agriculturalist_id = str(
        current_agriculturalist["_id"]
    )

    # --------------------------------------------------------
    # FIND CONVERSATIONS
    # --------------------------------------------------------

    conversations_cursor = (
        conversations_collection.find(
            {
                "agriculturalist_id":
                    agriculturalist_id
            }
        ).sort(
            "last_message_at",
            -1
        )
    )

    conversations = []

    for conversation in conversations_cursor:

        conversation_id = str(
            conversation["_id"]
        )

        user_id = str(
            conversation.get(
                "user_id",
                ""
            )
        )

        last_message_at = (
            conversation.get(
                "last_message_at"
            )
        )

        if hasattr(
            last_message_at,
            "isoformat"
        ):
            last_message_at = (
                last_message_at.isoformat()
            )

        # ----------------------------------------------------
        # COUNT UNREAD FARMER MESSAGES
        # ----------------------------------------------------

        unread_count = (
            chat_messages_collection.count_documents(
                {
                    "conversation_id":
                        conversation_id,

                    "receiver_id":
                        agriculturalist_id,

                    "is_read":
                        False,
                }
            )
        )

        conversations.append(
            {
                "id":
                    conversation_id,

                "conversation_id":
                    conversation_id,

                "user_id":
                    user_id,

                "agriculturalist_id":
                    agriculturalist_id,

                "last_message":
                    conversation.get(
                        "last_message",
                        ""
                    ),

                "last_message_at":
                    last_message_at,

                "unread_count":
                    unread_count,
            }
        )

    return {
        "success": True,
        "message":
            "Agriculturalist conversations loaded successfully.",
        "conversations":
            conversations,
    }


# ============================================================
# AGRICULTURALIST GET ONE CONVERSATION
#
# GET /chat/agriculturalist/conversations/{user_id}
# ============================================================

@router.get(
    "/agriculturalist/conversations/{user_id}"
)
def get_agriculturalist_conversation(
    user_id: str,
    current_agriculturalist=Depends(
        get_current_agriculturalist
    ),
):

    user_id = str(
        user_id
    ).strip()

    agriculturalist_id = str(
        current_agriculturalist["_id"]
    )

    # --------------------------------------------------------
    # VALIDATE USER ID
    # --------------------------------------------------------

    if not ObjectId.is_valid(
        user_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid farmer ID.",
        )

    # --------------------------------------------------------
    # FIND CONVERSATION
    # --------------------------------------------------------

    conversation = (
        conversations_collection.find_one(
            {
                "user_id": user_id,
                "agriculturalist_id":
                    agriculturalist_id,
            }
        )
    )

    # --------------------------------------------------------
    # NO CONVERSATION
    # --------------------------------------------------------

    if not conversation:

        return {
            "success": True,
            "conversation": None,
            "messages": [],
        }

    conversation_id = str(
        conversation["_id"]
    )

    # --------------------------------------------------------
    # GET MESSAGES
    # --------------------------------------------------------

    messages_cursor = (
        chat_messages_collection.find(
            {
                "conversation_id":
                    conversation_id
            }
        ).sort(
            "created_at",
            1
        )
    )

    messages = []

    for item in messages_cursor:

        created_at = item.get(
            "created_at"
        )

        if hasattr(
            created_at,
            "isoformat"
        ):
            created_at = (
                created_at.isoformat()
            )

        messages.append(
            {
                "id":
                    str(
                        item["_id"]
                    ),

                "conversation_id":
                    conversation_id,

                "sender_id":
                    str(
                        item.get(
                            "sender_id",
                            ""
                        )
                    ),

                "receiver_id":
                    str(
                        item.get(
                            "receiver_id",
                            ""
                        )
                    ),

                "message":
                    item.get(
                        "message",
                        ""
                    ),

                "is_read":
                    bool(
                        item.get(
                            "is_read",
                            False
                        )
                    ),

                "created_at":
                    created_at,
            }
        )

    # --------------------------------------------------------
    # MARK FARMER MESSAGES AS READ
    # --------------------------------------------------------

    chat_messages_collection.update_many(
        {
            "conversation_id":
                conversation_id,

            "receiver_id":
                agriculturalist_id,

            "is_read":
                False,
        },
        {
            "$set": {
                "is_read":
                    True
            }
        },
    )

    # --------------------------------------------------------
    # LAST MESSAGE DATE
    # --------------------------------------------------------

    last_message_at = (
        conversation.get(
            "last_message_at"
        )
    )

    if hasattr(
        last_message_at,
        "isoformat"
    ):
        last_message_at = (
            last_message_at.isoformat()
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "success": True,

        "conversation": {
            "id":
                conversation_id,

            "user_id":
                user_id,

            "agriculturalist_id":
                agriculturalist_id,

            "last_message":
                conversation.get(
                    "last_message",
                    ""
                ),

            "last_message_at":
                last_message_at,
        },

        "messages":
            messages,
    }


# ============================================================
# AGRICULTURALIST SEND MESSAGE
#
# POST /chat/agriculturalist/conversations/{user_id}
# ============================================================

@router.post(
    "/agriculturalist/conversations/{user_id}"
)
def agriculturalist_send_message(
    user_id: str,
    data: dict,
    current_agriculturalist=Depends(
        get_current_agriculturalist
    ),
):

    user_id = str(
        user_id
    ).strip()

    agriculturalist_id = str(
        current_agriculturalist["_id"]
    )

    message = (
        data.get("message") or ""
    ).strip()

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )

    if not ObjectId.is_valid(
        user_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid farmer ID.",
        )

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    users_collection = (
        get_users_collection()
    )

    user = users_collection.find_one(
        {
            "_id":
                ObjectId(user_id)
        }
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Farmer not found.",
        )

    created = datetime.now(
        timezone.utc
    )

    # --------------------------------------------------------
    # FIND CONVERSATION
    # --------------------------------------------------------

    conversation = (
        conversations_collection.find_one(
            {
                "user_id":
                    user_id,

                "agriculturalist_id":
                    agriculturalist_id,
            }
        )
    )

    # --------------------------------------------------------
    # CREATE CONVERSATION
    # --------------------------------------------------------

    if not conversation:

        conversation_result = (
            conversations_collection.insert_one(
                {
                    "user_id":
                        user_id,

                    "agriculturalist_id":
                        agriculturalist_id,

                    "last_message":
                        message,

                    "last_message_at":
                        created,

                    "created_at":
                        created,

                    "updated_at":
                        created,
                }
            )
        )

        conversation_id = str(
            conversation_result.inserted_id
        )

    else:

        conversation_id = str(
            conversation["_id"]
        )

        conversations_collection.update_one(
            {
                "_id":
                    conversation["_id"]
            },
            {
                "$set": {

                    "last_message":
                        message,

                    "last_message_at":
                        created,

                    "updated_at":
                        created,
                }
            },
        )

    # --------------------------------------------------------
    # SAVE MESSAGE
    # --------------------------------------------------------

    message_result = (
        chat_messages_collection.insert_one(
            {
                "conversation_id":
                    conversation_id,

                "sender_id":
                    agriculturalist_id,

                "receiver_id":
                    user_id,

                "message":
                    message,

                "is_read":
                    False,

                "created_at":
                    created,
            }
        )
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "success":
            True,

        "message":
            "Message sent successfully.",

        "chat_message": {

            "id":
                str(
                    message_result.inserted_id
                ),

            "conversation_id":
                conversation_id,

            "sender_id":
                agriculturalist_id,

            "receiver_id":
                user_id,

            "message":
                message,

            "is_read":
                False,

            "created_at":
                created.isoformat(),
        },
    }


# ============================================================
# MARK AGRICULTURALIST CONVERSATION AS READ
#
# PATCH /chat/agriculturalist/conversations/{user_id}/read
# ============================================================

@router.patch(
    "/agriculturalist/conversations/{user_id}/read"
)
def mark_agriculturalist_conversation_as_read(
    user_id: str,
    current_agriculturalist=Depends(
        get_current_agriculturalist
    ),
):

    user_id = str(
        user_id
    ).strip()

    agriculturalist_id = str(
        current_agriculturalist["_id"]
    )

    # --------------------------------------------------------
    # VALIDATE USER ID
    # --------------------------------------------------------

    if not ObjectId.is_valid(
        user_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid farmer ID.",
        )

    # --------------------------------------------------------
    # FIND CONVERSATION
    # --------------------------------------------------------

    conversation = (
        conversations_collection.find_one(
            {
                "user_id":
                    user_id,

                "agriculturalist_id":
                    agriculturalist_id,
            }
        )
    )

    if not conversation:

        return {
            "success":
                True,

            "message":
                "Conversation not found.",

            "updated":
                0,
        }

    conversation_id = str(
        conversation["_id"]
    )

    # --------------------------------------------------------
    # MARK MESSAGES AS READ
    # --------------------------------------------------------

    result = (
        chat_messages_collection.update_many(
            {
                "conversation_id":
                    conversation_id,

                "receiver_id":
                    agriculturalist_id,

                "is_read":
                    False,
            },
            {
                "$set": {
                    "is_read":
                        True
                }
            },
        )
    )

    return {

        "success":
            True,

        "message":
            "Conversation marked as read.",

        "updated":
            result.modified_count,
    }