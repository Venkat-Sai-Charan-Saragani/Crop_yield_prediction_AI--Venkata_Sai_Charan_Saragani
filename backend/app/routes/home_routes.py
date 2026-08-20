from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
     return {"message" : "Welcome to AI - Crop_Yield_Prediction_System"}