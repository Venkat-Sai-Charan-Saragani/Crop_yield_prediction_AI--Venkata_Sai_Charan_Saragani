# ============================================================
# SOIL ANALYSIS SCHEMAS
# backend/app/schemas/soil_schema.py
# ============================================================

from typing import Optional

from pydantic import (
    BaseModel,
    Field,
)


# ============================================================
# QUICK PH ANALYSIS
# ============================================================

class PHAnalysisRequest(BaseModel):
    """
    Request schema for quick soil pH-based analysis.

    This analysis uses only the measured soil pH.
    It does NOT determine actual N, P, K or micronutrient
    concentrations.
    """

    pH: float = Field(
        ...,
        ge=3.0,
        le=10.0,
        description="Measured soil pH value.",
    )


# ============================================================
# LABORATORY SOIL ANALYSIS
# ============================================================

class LaboratorySoilAnalysisRequest(BaseModel):
    """
    Request schema for laboratory soil-test analysis.

    Values should be entered exactly as reported by the
    soil-testing laboratory, using the units expected by
    YieldSenseAI.
    """

    # ========================================================
    # BASIC SOIL PROPERTY
    # ========================================================

    pH: float = Field(
        ...,
        ge=3.0,
        le=10.0,
        description="Laboratory-measured soil pH.",
    )

    # ========================================================
    # PRIMARY NUTRIENTS
    # ========================================================
    #
    # Expected unit:
    # kg/ha
    #
    # These values should come from the laboratory report.
    # ========================================================

    N: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured available nitrogen "
            "in kg/ha."
        ),
    )

    P: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured available phosphorus "
            "in kg/ha."
        ),
    )

    K: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured available potassium "
            "in kg/ha."
        ),
    )

    # ========================================================
    # SOIL HEALTH PARAMETERS
    # ========================================================

    organic_carbon: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured soil organic carbon "
            "in percent (%)."
        ),
    )

    electrical_conductivity: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured electrical conductivity "
            "in dS/m."
        ),
    )

    # ========================================================
    # MICRONUTRIENTS
    # ========================================================
    #
    # Expected unit:
    # mg/kg
    #
    # These are optional because different laboratory
    # reports may test different micronutrients.
    # ========================================================

    zinc: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured available zinc "
            "in mg/kg."
        ),
    )

    iron: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured available iron "
            "in mg/kg."
        ),
    )

    copper: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured available copper "
            "in mg/kg."
        ),
    )

    manganese: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured available manganese "
            "in mg/kg."
        ),
    )

    boron: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured available boron "
            "in mg/kg."
        ),
    )

    sulphur: Optional[float] = Field(
        default=None,
        ge=0,
        description=(
            "Laboratory-measured available sulphur "
            "in mg/kg."
        ),
    )

    # ========================================================
    # SOIL TEXTURE
    # ========================================================

    soil_texture: Optional[str] = Field(
        default=None,
        description=(
            "Soil texture/classification reported by "
            "the laboratory, such as Sandy Loam, Loam "
            "or Clay Loam."
        ),
    )