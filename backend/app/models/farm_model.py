from datetime import datetime
from bson import ObjectId

from backend.app.schemas.farm_schema import FarmCreate

def create_farm_document(
        farm: FarmCreate,
        user_id: str
):
    return {
        "user_id": ObjectId(user_id),
        "farm_name": farm.farm_name,
        "area": farm.area,
        "area_unit": farm.area_unit,
        "soil_type": farm.soil_type,
        "latitude": farm.latitude,
        "longitude": farm.longitude,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }