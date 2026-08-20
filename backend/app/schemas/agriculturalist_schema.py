# ============================================================
# AGRICULTURALIST SCHEMAS
# backend/app/schemas/agriculturalist_schema.py
# ============================================================

from typing import Optional

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)


# ============================================================
# REGISTER AGRICULTURALIST
# ============================================================

class AgriculturalistRegister(BaseModel):

    full_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
    )

    specialization: Optional[str] = ""

    # ========================================================
    # GOVERNMENT ID
    # ========================================================

    government_id: str = Field(
        ...,
        min_length=4,
        max_length=100,
    )

    experience_years: int = Field(
        default=0,
        ge=0,
        le=60,
    )

    state: Optional[str] = ""

    district: Optional[str] = ""


# ============================================================
# LOGIN AGRICULTURALIST
# ============================================================

class AgriculturalistLogin(BaseModel):

    email: EmailStr

    password: str


# ============================================================
# PROFILE UPDATE
# ============================================================

class AgriculturalistProfileUpdate(BaseModel):

    full_name: Optional[str] = None

    specialization: Optional[str] = None

    experience_years: Optional[int] = Field(
        default=None,
        ge=0,
        le=60,
    )

    state: Optional[str] = None

    district: Optional[str] = None

    availability: Optional[bool] = None

    profile_image: Optional[str] = None


# ============================================================
# RECOMMENDATION
# ============================================================

class AgriculturalistRecommendation(BaseModel):

    recommendation: str = Field(
        ...,
        min_length=10,
        max_length=5000,
    )

    priority: str = Field(
        default="normal",
    )

    expected_improvement: Optional[str] = Field(
        default=None,
        max_length=1000,
    )