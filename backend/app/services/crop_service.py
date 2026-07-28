from bson import ObjectId

from backend.app.database.mongodb import (
    crop_collections,
    farm_collections
)

from backend.app.models.crop_model import create_crop_document
from backend.app.database.mongodb import crop_collections

def create_crop(crop, current_user):

    farm = farm_collections.find_one(
        {
            "_id": ObjectId(crop.farm_id),
            "user_id": ObjectId(str(current_user["_id"]))
        }
    )

    if farm is None:
        return {
            "success": False,
            "message": "Farm not found"
        }

    crop_document = create_crop_document(
        crop,
        str(current_user["_id"])
    )

    result = crop_collections.insert_one(crop_document)

    return {
        "success": True,
        "message": "Crop created successfully",
        "crop_id": str(result.inserted_id)
    }


def get_crops(current_user):
    crops = crop_collections.find(
        {
            "user_id": ObjectId(str(current_user["_id"]))
        }
    )

    crop_list = []

    for crop in crops:
        crop_list.append(
            {
                "id": str(crop["_id"]),
                "farm_id": str(crop["farm_id"]),
                "crop_name": crop["crop_name"],
                "crop_type": crop["crop_type"],
                "season": crop["season"],
                "sowing_date": crop["sowing_date"].date().isoformat(),
                "expected_harvest_date": crop["expected_harvest_date"].date().isoformat(),
                "status": crop["status"]
            }
        )

    return {
        "success": True,
        "crops": crop_list
    }


def get_crop_by_id(crop_id, current_user):
    crop = crop_collections.find_one(
        {
            "_id": ObjectId(crop_id),
            "user_id": ObjectId(str(current_user["_id"]))
        }
    )

    if crop is None:
        return {
            "Success": False,
            "message": "Crop Not Found"
        }
    return {
        "success": True,
        "crop":{

            "id": str(crop["_id"]),
            "farm_id": str(crop["farm_id"]),
            "crop_name": crop["crop_name"],
            "crop_type": crop["crop_type"],
            "season": crop["season"],
            "sowing_date": crop["sowing_date"],
            "expected_harvest_date": crop["expected_harvest_date"],
            "status": crop["status"]
        }
    }


def update_crop(crop_id, crop, current_user):
    result = crop_collections.update_one(
        {
            "_id": ObjectId(crop_id),
            "user_id": ObjectId(str(current_user["_id"]))   
        },
        {
            "$set": crop.model_dump(exclude_unset=True)
        }
    )

    if result.matched_count == 0:
        return{
            "success": False,
            "message": "Crop Not Found"
        }

    return {
        "success": True,
        "message": "Crop Updated Successfully"
    }




def delete_crop(crop_id, current_user):
    result = crop_collections.delete_one(
        {
            "_id": ObjectId(crop_id),
            "user_id": current_user["_id"]
        }
    )

    if result.deleted_count == 0:
        return{
            "success": False,
            "message": "Crop Not Found"
        }

    return{
        "success": True,
        "message": "Crop Deleted Successfully"
    }