from datetime import date
from typing import Optional


from pydantic import BaseModel, Field

class CropCreate(BaseModel):
    farm_id: str
    crop_name: str = Field(..., min_length=2, max_length=100)
    crop_type: str
    season: str
    sowing_date: date
    expected_harvest_date: date
    status: str


class CropUpdate(BaseModel):
    crop_name: Optional[str]= None
    crop_type: Optional[str] = None
    season: Optional[str] = None
    sowing_date: Optional[date] = None
    expected_harvest_date: Optional[date] = None
    status: Optional[str] = None
