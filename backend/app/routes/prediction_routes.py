from fastapi import APIRouter

from backend.app.ml.predictor import predict_yield
from backend.app.schemas.prediction_schema import PredictionRequest


router = APIRouter(
    prefix="/prediction",
    tags=["prediction"]
)


@router.post("/predict")
def predict(data: PredictionRequest):

    result = predict_yield(
        data.model_dump()
    )

    return {
    "success": True,
    "message": "Prediction generated successfully",
    "predicted_yield": round(float(result),2)
}