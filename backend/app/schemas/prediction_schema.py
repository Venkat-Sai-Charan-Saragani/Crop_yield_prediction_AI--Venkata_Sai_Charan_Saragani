# ============================================================
# PREDICTION SCHEMA
# backend/app/schemas/prediction_schema.py
# ============================================================

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):

    # ========================================================
    # CATEGORICAL FEATURES
    # ========================================================

    crop: str = Field(
        ...,
        min_length=1
    )

    season: str = Field(
        ...,
        min_length=1
    )

    state: str = Field(
        ...,
        min_length=1
    )


    # ========================================================
    # NUMERIC FEATURES
    # ========================================================

    year: int

    area: float = Field(
        ...,
        gt=0
    )

    fertilizer: float = Field(
        ...,
        ge=0
    )

    pesticide: float = Field(
        ...,
        ge=0
    )


    # ========================================================
    # SOIL NUTRIENTS
    # ========================================================

    N: float = Field(
        ...,
        ge=0
    )

    P: float = Field(
        ...,
        ge=0
    )

    K: float = Field(
        ...,
        ge=0
    )


    # ========================================================
    # SOIL / WEATHER
    # ========================================================

    pH: float = Field(
        ...,
        ge=0,
        le=14
    )

    avg_temp_c: float

    total_rainfall_mm: float = Field(
        ...,
        ge=0
    )

    avg_humidity_percent: float = Field(
        ...,
        ge=0,
        le=100
    )