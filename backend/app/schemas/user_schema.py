from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class  UserRegister(BaseModel):
    full_name: str = Field(..., min_length = 3, max_length= 100)
    email: EmailStr
    password : str=Field(...,min_length = 6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Location(BaseModel):
    state: Optional[str] = None
    district : Optional[str] = None
    village : Optional[str] = None

class UserProfileUpdate(BaseModel):
    full_name : Optional[str] = None
    phone_number : Optional[str] = None
    date_of_birth : Optional[str] = None
    location : Optional[Location] = None