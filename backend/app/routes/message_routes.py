# ============================================================
# MESSAGE ROUTES
# ============================================================

from fastapi import (
    APIRouter,
    Depends,
)

from backend.app.auth.dependencies import (
    get_current_user
)

from backend.app.agriculturalist.agriculturalist_auth import (
    get_current_agriculturalist
)

from backend.app.schemas.message_schema import (
    SendMessageRequest
)

from backend.app.services.message_service import (
    send_message,
    get_messages,
)


router = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)


# ============================================================
# USER SEND MESSAGE
# ============================================================

@router.post("/user/{consultation_id}")
def user_send_message(

    consultation_id: str,

    data: SendMessageRequest,

    current_user=Depends(
        get_current_user
    )

):

    return send_message(

        consultation_id=

            consultation_id,

        sender_type=
            "user",

        sender_id=
            str(
                current_user["_id"]
            ),

        message=
            data.message,

    )


# ============================================================
# AGRICULTURALIST SEND MESSAGE
# ============================================================

@router.post(
    "/agriculturalist/{consultation_id}"
)
def agriculturalist_send_message(

    consultation_id: str,

    data: SendMessageRequest,

    current_agriculturalist=Depends(
        get_current_agriculturalist
    )

):

    return send_message(

        consultation_id=
            consultation_id,

        sender_type=
            "agriculturalist",

        sender_id=
            str(
                current_agriculturalist["_id"]
            ),

        message=
            data.message,

    )


# ============================================================
# USER GET MESSAGES
# ============================================================

@router.get("/user/{consultation_id}")
def user_messages(

    consultation_id: str,

    current_user=Depends(
        get_current_user
    )

):

    return get_messages(

        consultation_id,

        "user",

        str(
            current_user["_id"]
        )

    )


# ============================================================
# AGRICULTURALIST GET MESSAGES
# ============================================================

@router.get(
    "/agriculturalist/{consultation_id}"
)
def agriculturalist_messages(

    consultation_id: str,

    current_agriculturalist=Depends(
        get_current_agriculturalist
    )

):

    return get_messages(

        consultation_id,

        "agriculturalist",

        str(
            current_agriculturalist["_id"]
        )

    )