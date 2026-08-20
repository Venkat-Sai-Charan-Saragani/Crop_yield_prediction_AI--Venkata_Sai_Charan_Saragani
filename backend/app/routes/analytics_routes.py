# ============================================================
# ANALYTICS ROUTES
# backend/app/routes/analytics_routes.py
# ============================================================

from fastapi import APIRouter, Depends

from backend.app.auth.dependencies import (
    get_current_user
)

from backend.app.services.analytics_service import (
    get_user_analytics
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# ============================================================
# USER ANALYTICS
#
# GET /analytics
# ============================================================

@router.get("")
def analytics(
    current_user=Depends(
        get_current_user
    )
):

    user_id = str(
        current_user["_id"]
    )

    return get_user_analytics(
        user_id
    )


# ============================================================
# USER ANALYTICS OVERVIEW
#
# GET /analytics/overview
#
# This is the endpoint currently used by:
#
# frontend/src/app/analytics/page.tsx
#
# ============================================================

@router.get("/overview")
def analytics_overview(
    current_user=Depends(
        get_current_user
    )
):

    user_id = str(
        current_user["_id"]
    )

    return get_user_analytics(
        user_id
    )