from pydantic import BaseModel, Field
from typing import Optional


class FarmCreate(BaseModel):
    farm_name : str = Field(..., min_length=3, max_length=100)
    area : float = Field(...,gt=0)
    area_unit : str
    soil_type : str
    latitude : float
    longitude : float


class FarmUpdate(BaseModel):
    farm_name : Optional[str] = None
    area : Optional[float] = None
    area_unit : Optional[str] = None
    soil_type : Optional[str] = None
    latitude : Optional[float] = None
    longitude : Optional[float] = None