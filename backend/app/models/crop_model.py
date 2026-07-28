from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

def create_crop_document(crop, user_id):
    return {
        "farm_id": ObjectId(crop.farm_id),
        "user_id": ObjectId(user_id),
        "crop_name": crop.crop_name,
        "crop_type": crop.crop_type,
        "season": crop.season,
        "sowing_date": datetime.combine(crop.sowing_date, datetime.min.time()),
        "expected_harvest_date": datetime.combine(crop.expected_harvest_date, datetime.min.time()),
        "status": crop.status
    }