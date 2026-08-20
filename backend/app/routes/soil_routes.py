# ============================================================
# SOIL ANALYSIS ROUTES
# backend/app/routes/soil_routes.py
# ============================================================

from fastapi import APIRouter

from backend.app.schemas.soil_schema import (
    PHAnalysisRequest,
    LaboratorySoilAnalysisRequest,
)

from backend.app.services.soil_analysis_service import (
    perform_ph_analysis,
    perform_laboratory_analysis,
)


router = APIRouter(
    prefix="/soil",
    tags=["Soil Analysis"],
)


# ============================================================
# QUICK PH ANALYSIS
# ============================================================

@router.post("/analyze-ph")
def analyze_ph_endpoint(
    data: PHAnalysisRequest,
):

    return perform_ph_analysis(
        data.pH
    )


# ============================================================
# LABORATORY ANALYSIS
# ============================================================

@router.post("/analyze-laboratory")
def analyze_laboratory_endpoint(
    data: LaboratorySoilAnalysisRequest,
):

    return perform_laboratory_analysis(
        data.model_dump()
    )