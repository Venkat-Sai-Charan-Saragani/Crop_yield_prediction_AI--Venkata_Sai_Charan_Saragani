from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ============================================================
# NORMAL USER REGISTRATION
# ============================================================

class UserRegister(BaseModel):

    full_name: str = Field(
        ...,
        min_length=3,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6
    )


# ============================================================
# NORMAL USER LOGIN
# ============================================================

class UserLogin(BaseModel):

    email: EmailStr

    password: str


# ============================================================
# GOOGLE LOGIN
# ============================================================

class GoogleLoginRequest(BaseModel):

    code: str


# ============================================================
# GOOGLE REGISTRATION
# ============================================================

class GoogleRegisterRequest(BaseModel):

    code: str


# ============================================================
# LOCATION
# ============================================================

class Location(BaseModel):

    state: Optional[str] = None

    district: Optional[str] = None

    village: Optional[str] = None


# ============================================================
# USER PROFILE UPDATE
# ============================================================

class UserProfileUpdate(BaseModel):

    full_name: Optional[str] = None

    phone_number: Optional[str] = None

    date_of_birth: Optional[str] = None

    location: Optional[Location] = None


# ============================================================
# USER UPDATE
# ============================================================

class UserUpdate(BaseModel):

    full_name: Optional[str] = None

    email: Optional[EmailStr] = None

    phone: Optional[str] = None

    location: Optional[str] = None

    farm_name: Optional[str] = None

    profile_image: Optional[str] = None