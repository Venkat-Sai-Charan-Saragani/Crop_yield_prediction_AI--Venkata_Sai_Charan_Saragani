# ============================================================
# NOTIFICATION ROUTES
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

from backend.app.schemas.notification_schema import (
    NotificationReadRequest
)

from backend.app.services.notification_service import (
    get_notifications,
    mark_notification_read,
)


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# ============================================================
# USER NOTIFICATIONS
# ============================================================

@router.get("/user")
def user_notifications(
    current_user=Depends(
        get_current_user
    )
):

    return get_notifications(

        "user",

        str(
            current_user["_id"]
        )

    )


# ============================================================
# AGRICULTURALIST NOTIFICATIONS
# ============================================================

@router.get("/agriculturalist")
def agriculturalist_notifications(

    current_agriculturalist=Depends(
        get_current_agriculturalist
    )

):

    return get_notifications(

        "agriculturalist",

        str(
            current_agriculturalist["_id"]
        )

    )


# ============================================================
# USER MARK READ
# ============================================================

@router.post("/user/read")
def user_mark_read(

    data: NotificationReadRequest,

    current_user=Depends(
        get_current_user
    )

):

    return mark_notification_read(

        data.notification_id,

        "user",

        str(
            current_user["_id"]
        )

    )


# ============================================================
# AGRICULTURALIST MARK READ
# ============================================================

@router.post("/agriculturalist/read")
def agriculturalist_mark_read(

    data: NotificationReadRequest,

    current_agriculturalist=Depends(
        get_current_agriculturalist
    )

):

    return mark_notification_read(

        data.notification_id,

        "agriculturalist",

        str(
            current_agriculturalist["_id"]
        )

    )