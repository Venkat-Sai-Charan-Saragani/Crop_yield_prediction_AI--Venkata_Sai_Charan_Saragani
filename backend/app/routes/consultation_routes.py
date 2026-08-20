# ============================================================
# CONSULTATION ROUTES
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

from backend.app.schemas.consultation_schema import (
    CreateConsultationRequest
)

from backend.app.services.consultation_service import (
    create_consultation,
    get_user_consultations,
    get_agriculturalist_consultations,
)


router = APIRouter(
    prefix="/consultations",
    tags=["Consultations"]
)


# ============================================================
# USER CREATE CONSULTATION
# ============================================================

@router.post("")
def create(

    data: CreateConsultationRequest,

    current_user=Depends(
        get_current_user
    )

):

    return create_consultation(

        user_id=
            str(
                current_user["_id"]
            ),

        agriculturalist_id=
            data.agriculturalist_id,

        prediction_id=
            data.prediction_id,

    )


# ============================================================
# USER CONSULTATIONS
# ============================================================

@router.get("/user")
def user_consultations(

    current_user=Depends(
        get_current_user
    )

):

    return get_user_consultations(

        str(
            current_user["_id"]
        )

    )


# ============================================================
# AGRICULTURALIST CONSULTATIONS
# ============================================================

@router.get("/agriculturalist")
def agriculturalist_consultations(

    current_agriculturalist=Depends(
        get_current_agriculturalist
    )

):

    return get_agriculturalist_consultations(

        str(
            current_agriculturalist["_id"]
        )

    )