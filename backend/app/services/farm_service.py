from bson import ObjectId

from backend.app.database.mongodb import farm_collections
from backend.app.models.farm_model import create_farm_document
from backend.app.schemas.farm_schema import FarmCreate, FarmUpdate

def create_farm(farm: FarmCreate, current_user):
    farm_document = create_farm_document(
        farm,
        str(current_user["_id"])
    )

    result = farm_collections.insert_one(farm_document)

    return {
        "success": True,
        "message": "Farm Created Successfully",
        "farm_id": str(result.inserted_id)
    }

def get_all_farms(current_user):
    farms = farm_collections.find(
        {
            "user_id": ObjectId(str(current_user["_id"]))
        }
    )

    farm_list = []

    for farm in farms:

        farm_list.append(
            {
                "id": str(farm["_id"]),
                "farm_name": farm["farm_name"],
                "area": farm["area"],
                "area_unit": farm["area_unit"],
                "soil_type": farm["soil_type"],
                "latitude": farm["latitude"],
                "longitude": farm["longitude"]
            }
        )
    return {
        "success": True,
        "farms": farm_list
    }


def get_farm_by_id(
    farm_id: str,
    current_user
):

    farm = farm_collections.find_one(
        {
            "_id": ObjectId(farm_id),
            "user_id": ObjectId(str(current_user["_id"]))
        }
    )

    if farm is None:
        return {
            "success": False,
            "message": "Farm not found"
        }

    return {
        "success": True,
        "farm": {
            "id": str(farm["_id"]),
            "farm_name": farm["farm_name"],
            "area": farm["area"],
            "area_unit": farm["area_unit"],
            "soil_type": farm["soil_type"],
            "latitude": farm["latitude"],
            "longitude": farm["longitude"]
        }
    }


def update_farm(
        farm_id: str,
        farm: FarmUpdate,
        current_user
):
    #check wheather the from belongs to the current user
    existing_farm = farm_collections.find_one(
        {
            "_id": ObjectId(farm_id),
            "user_id": ObjectId(str(current_user["_id"]))
        }
    )

    if existing_farm is None:
        return {
            "success": False,
            "message": "Farm not  found"
        }

    #update only the fields provided by the user
    update_data = farm.model_dump(exclude_none=True)

    result = farm_collections.update_one(
        {
            "_id": ObjectId(farm_id),
            "user_id": ObjectId(str(current_user["_id"]))
        },
        {
            "$set": update_data
        }
    )

    if result.modified_count == 0:
        return {
            "sucess": False,
            "message": "Farm not updated"
        }
    return {
        "success": True,
        "message": "Farm Updated Successfully"
    }


def delete_farm(
        farm_id: str,
        current_user
):
    result = farm_collections.delete_one(
        {
        "_id": ObjectId(farm_id),
        "user_id":  ObjectId(str(current_user["_id"]))
        }
    )
    if result.deleted_count == 0:
        return {
            "success": False,
            "message": "Farm not Found"
        }
    return {
        "success":  True,
        "message": "Farm deleted successfully"
        ""
    }