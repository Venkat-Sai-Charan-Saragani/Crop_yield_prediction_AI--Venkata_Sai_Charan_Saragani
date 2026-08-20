# ============================================================
# PREDICTION ROUTES
# backend/app/routes/prediction_routes.py
# ============================================================

from fastapi import (
    APIRouter,
    Depends,
)

from backend.app.schemas.prediction_schema import (
    PredictionRequest
)

from backend.app.services.prediction_service import (
    generate_prediction,
    get_prediction_options,
)

from backend.app.auth.dependencies import (
    get_current_user
)

from backend.app.services.prediction_history_service import (
    get_prediction_history
)


router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"],
)


# ============================================================
# OPTIONS
# ============================================================

@router.get("/options")
def prediction_options():

    return get_prediction_options()


# ============================================================
# PREDICT
# ============================================================

@router.post("/predict")
def predict(

    data: PredictionRequest,

    current_user=Depends(
        get_current_user
    ),

):

    return generate_prediction(

        data.model_dump(),

        current_user,

    )


# ============================================================
# HISTORY
# ============================================================

@router.get("/history")
def prediction_history(

    current_user=Depends(
        get_current_user
    ),

):

    return get_prediction_history(

        str(
            current_user["_id"]
        )

    )