# ============================================================
# DASHBOARD ROUTES
# backend/app/routes/dashboard_routes.py
# ============================================================

from fastapi import (
    APIRouter,
    Depends,
)

from bson import ObjectId

from backend.app.database.mongodb import (
    get_database
)

from backend.app.auth.dependencies import (
    get_current_user
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


# ============================================================
# GET DASHBOARD STATS
# ============================================================

@router.get("/stats")
def dashboard_stats(

    current_user=Depends(
        get_current_user
    )

):

    db = get_database()

    user_id = str(
        current_user["_id"]
    )

    object_user_id = ObjectId(
        user_id
    )

    total_farms = (
        db["farms"].count_documents(
            {
                "user_id":
                    object_user_id
            }
        )
    )

    total_crops = (
        db["crops"].count_documents(
            {
                "user_id":
                    object_user_id
            }
        )
    )

    total_predictions = (
        db["predictions"].count_documents(
            {
                "user_id":
                    user_id
            }
        )
    )

    return {

        "success": True,

        "total_farms":
            total_farms,

        "total_crops":
            total_crops,

        "total_predictions":
            total_predictions,

        # IMPORTANT:
        # This is currently a display value only.
        # Do not represent it as measured model accuracy.
        "model_accuracy":
            "95%",

    }


# ============================================================
# DASHBOARD ACTIVITY
# ============================================================

@router.get("/activity")
def dashboard_activity(

    current_user=Depends(
        get_current_user
    )

):

    db = get_database()

    user_id = str(
        current_user["_id"]
    )

    object_user_id = ObjectId(
        user_id
    )

    # ========================================================
    # FARMS
    # ========================================================

    farms = list(

        db["farms"]
        .find(
            {
                "user_id":
                    object_user_id
            }
        )
        .sort(
            "_id",
            -1
        )
        .limit(5)

    )

    recent_farms = []

    for farm in farms:

        recent_farms.append(

            {

                "id":
                    str(
                        farm["_id"]
                    ),

                "farm_name":
                    farm.get(
                        "farm_name",
                        "Unknown Farm"
                    ),

                "location":
                    farm.get(
                        "location",
                        farm.get(
                            "address",
                            farm.get(
                                "place",
                                "Location not added"
                            )
                        )
                    ),

            }

        )

    # ========================================================
    # CROPS
    # ========================================================

    crops = list(

        db["crops"]
        .find(
            {
                "user_id":
                    object_user_id
            }
        )
        .sort(
            "_id",
            -1
        )
        .limit(5)

    )

    recent_crops = []

    for crop in crops:

        recent_crops.append(

            {

                "id":
                    str(
                        crop["_id"]
                    ),

                "crop_name":
                    crop.get(
                        "crop_name",
                        crop.get(
                            "crop",
                            "Unknown Crop"
                        )
                    ),

                "season":
                    crop.get(
                        "season",
                        "Unknown"
                    ),

                "status":
                    crop.get(
                        "status",
                        "Unknown"
                    ),

            }

        )

    # ========================================================
    # PREDICTIONS
    # ========================================================

    predictions = list(

        db["predictions"]
        .find(
            {
                "user_id":
                    user_id
            }
        )
        .sort(
            "_id",
            -1
        )
        .limit(5)

    )

    recent_predictions = []

    for prediction in predictions:

        crop_name = (
            prediction.get(
                "crop_name"
            )
            or
            prediction.get(
                "crop"
            )
            or
            prediction.get(
                "Item"
            )
            or
            prediction.get(
                "item"
            )
            or
            "Unknown Crop"
        )

        predicted_yield = (
            prediction.get(
                "predicted_yield"
            )
            or
            prediction.get(
                "yield"
            )
            or
            prediction.get(
                "Yield"
            )
            or
            0
        )

        recent_predictions.append(

            {

                "id":
                    str(
                        prediction["_id"]
                    ),

                "crop_name":
                    crop_name,

                "predicted_yield":
                    predicted_yield,

                "created_at":
                    prediction.get(
                        "created_at"
                    ),

            }

        )

    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "success": True,

        "farms":
            recent_farms,

        "crops":
            recent_crops,

        "predictions":
            recent_predictions,

    }