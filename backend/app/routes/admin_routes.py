# ============================================================
# ADMIN ROUTES
# backend/app/routes/admin_routes.py
# ============================================================

from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Body,
)

from pydantic import BaseModel

from bson import ObjectId

from passlib.context import CryptContext

from backend.app.schemas.user_schema import (
    UserLogin,
)

from backend.app.auth.admin_dependencies import (
    get_current_admin,
)

from backend.app.utils.jwt import (
    create_access_token,
)

from backend.app.database.mongodb import (
    get_database,
)

from backend.app.services.agriculturalist_service import (
    get_agriculturalist_verification_requests,
    review_agriculturalist,
    get_agriculturalist_profile,
    get_agriculturalist_by_id,
)


# ============================================================
# PASSWORD CONFIGURATION
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ============================================================
# DATABASE
# ============================================================

db = get_database()

user_collection = db["users"]

farm_collection = db["farms"]

crop_collection = db["crops"]

prediction_collection = db["predictions"]


# ============================================================
# REQUEST SCHEMA
# ============================================================

class AgriculturalistRejectRequest(BaseModel):

    rejection_reason: Optional[str] = None


# ============================================================
# ADMIN LOGIN
# ============================================================

@router.post("/login")
def admin_login(
    user: UserLogin,
):

    # --------------------------------------------------------
    # FIND ADMIN
    # --------------------------------------------------------

    email = (
        user.email
        .strip()
        .lower()
    )

    existing_user = (
        user_collection.find_one(
            {
                "email": email,
            }
        )
    )

    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid admin credentials",
        )


    # --------------------------------------------------------
    # CHECK ROLE
    # --------------------------------------------------------

    if (
        existing_user.get(
            "role",
            "user",
        )
        != "admin"
    ):

        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )


    # --------------------------------------------------------
    # CHECK ADMIN STATUS
    # --------------------------------------------------------

    if (
        existing_user.get(
            "status",
            "active",
        )
        != "active"
    ):

        raise HTTPException(
            status_code=403,
            detail="Administrator account is inactive",
        )


    # --------------------------------------------------------
    # GET PASSWORD
    # --------------------------------------------------------

    stored_password = (
        existing_user.get(
            "password"
        )
    )

    if not stored_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid admin credentials",
        )


    # --------------------------------------------------------
    # VERIFY PASSWORD
    # --------------------------------------------------------

    try:

        password_valid = (
            pwd_context.verify(
                user.password,
                stored_password,
            )
        )

    except Exception:

        password_valid = False


    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid admin credentials",
        )


    # --------------------------------------------------------
    # CREATE ADMIN JWT
    # --------------------------------------------------------

    access_token = (
        create_access_token(
            {
                "sub":
                    str(
                        existing_user["_id"]
                    ),

                "user_id":
                    str(
                        existing_user["_id"]
                    ),

                "email":
                    existing_user.get(
                        "email",
                        "",
                    ),

                "role":
                    "admin",
            }
        )
    )


    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "success":
            True,

        "message":
            "Admin login successful",

        "access_token":
            access_token,

        "token_type":
            "bearer",

        "admin": {

            "id":
                str(
                    existing_user["_id"]
                ),

            "email":
                existing_user.get(
                    "email",
                    "",
                ),

            "role":
                "admin",

        },

    }


# ============================================================
# ADMIN STATS
# ============================================================

@router.get("/stats")
def get_admin_stats(
    current_admin=Depends(
        get_current_admin
    ),
):

    total_users = (
        user_collection.count_documents({})
    )

    total_farms = (
        farm_collection.count_documents({})
    )

    total_crops = (
        crop_collection.count_documents({})
    )

    total_predictions = (
        prediction_collection.count_documents({})
    )


    # --------------------------------------------------------
    # ACTIVE USERS
    # --------------------------------------------------------

    active_users = (
        user_collection.count_documents(
            {
                "$or": [

                    {
                        "status":
                            "active",
                    },

                    {
                        "status": {
                            "$exists":
                                False,
                        },
                    },

                ],
            }
        )
    )


    # --------------------------------------------------------
    # INACTIVE USERS
    # --------------------------------------------------------

    inactive_users = (
        user_collection.count_documents(
            {
                "status":
                    "inactive",
            }
        )
    )


    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "success":
            True,

        "stats": {

            "total_users":
                total_users,

            "active_users":
                active_users,

            "inactive_users":
                inactive_users,

            "total_farms":
                total_farms,

            "total_crops":
                total_crops,

            "total_predictions":
                total_predictions,

            "model_accuracy":
                95,

        },

    }


# ============================================================
# GET ALL USERS
# ============================================================

@router.get("/users")
def get_all_users(
    current_admin=Depends(
        get_current_admin
    ),
):

    users = list(
        user_collection.find(
            {},
            {
                "password": 0,
            },
        )
    )


    result = []


    for user in users:

        user_id = str(
            user["_id"]
        )


        # ----------------------------------------------------
        # PREDICTION COUNT
        # ----------------------------------------------------

        prediction_count = (
            prediction_collection.count_documents(
                {
                    "user_id":
                        user_id,
                }
            )
        )


        # ----------------------------------------------------
        # STATUS
        # ----------------------------------------------------

        user_status = (
            user.get(
                "status",
                "active",
            )
        )


        # ----------------------------------------------------
        # USER DATA
        # ----------------------------------------------------

        result.append(

            {

                "id":
                    user_id,

                "_id":
                    user_id,

                "full_name":
                    user.get(
                        "full_name",
                        user.get(
                            "name",
                            "Unknown User",
                        ),
                    ),

                "name":
                    user.get(
                        "name",
                        user.get(
                            "full_name",
                            "Unknown User",
                        ),
                    ),

                "email":
                    user.get(
                        "email",
                        "",
                    ),

                "auth_provider":
                    user.get(
                        "auth_provider",
                        "local",
                    ),

                "role":
                    user.get(
                        "role",
                        "user",
                    ),

                "phone_number":
                    user.get(
                        "phone_number"
                    ),

                "phone":
                    user.get(
                        "phone"
                    ),

                "date_of_birth":
                    user.get(
                        "date_of_birth"
                    ),

                "location":
                    user.get(
                        "location"
                    ),

                "status":
                    user_status,

                "is_active":
                    user_status == "active",

                "created_at":
                    (
                        user.get(
                            "created_at"
                        ).isoformat()
                        if hasattr(
                            user.get(
                                "created_at"
                            ),
                            "isoformat",
                        )
                        else user.get(
                            "created_at"
                        )
                    ),

                "updated_at":
                    (
                        user.get(
                            "updated_at"
                        ).isoformat()
                        if hasattr(
                            user.get(
                                "updated_at"
                            ),
                            "isoformat",
                        )
                        else user.get(
                            "updated_at"
                        )
                    ),

                "predictions":
                    prediction_count,

                "prediction_count":
                    prediction_count,

            }

        )


    return {

        "success":
            True,

        "users":
            result,

    }


# ============================================================
# UPDATE USER STATUS
# ============================================================

@router.put(
    "/users/{user_id}/status"
)
def update_user_status(

    user_id: str,

    status: str,

    current_admin=Depends(
        get_current_admin
    ),

):

    # --------------------------------------------------------
    # VALIDATE ID
    # --------------------------------------------------------

    if not ObjectId.is_valid(
        user_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID",
        )


    # --------------------------------------------------------
    # NORMALIZE STATUS
    # --------------------------------------------------------

    status = (
        status
        .lower()
        .strip()
    )


    if status not in [
        "active",
        "inactive",
    ]:

        raise HTTPException(
            status_code=400,
            detail=(
                "Status must be "
                "'active' or 'inactive'"
            ),
        )


    # --------------------------------------------------------
    # PREVENT SELF STATUS CHANGE
    # --------------------------------------------------------

    if (
        str(
            current_admin["_id"]
        )
        ==
        user_id
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Administrator cannot "
                "change their own status"
            ),
        )


    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    existing_user = (
        user_collection.find_one(
            {
                "_id":
                    ObjectId(
                        user_id
                    ),
            }
        )
    )


    if not existing_user:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )


    # --------------------------------------------------------
    # PROTECT ADMIN
    # --------------------------------------------------------

    if (
        existing_user.get(
            "role",
            "user",
        )
        ==
        "admin"
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Administrator accounts "
                "cannot be deactivated here"
            ),
        )


    # --------------------------------------------------------
    # UPDATE
    # --------------------------------------------------------

    result = (
        user_collection.update_one(

            {
                "_id":
                    ObjectId(
                        user_id
                    ),
            },

            {
                "$set": {

                    "status":
                        status,

                    "is_active":
                        status == "active",

                },
            },

        )
    )


    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )


    return {

        "success":
            True,

        "message":
            (
                "User activated successfully."
                if status == "active"
                else
                "User deactivated successfully."
            ),

        "status":
            status,

        "is_active":
            status == "active",

    }


# ============================================================
# GET SINGLE USER
# ============================================================

@router.get(
    "/users/{user_id}"
)
def get_user(

    user_id: str,

    current_admin=Depends(
        get_current_admin
    ),

):

    if not ObjectId.is_valid(
        user_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID",
        )


    user = (
        user_collection.find_one(
            {
                "_id":
                    ObjectId(
                        user_id
                    ),
            }
        )
    )


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )


    user.pop(
        "password",
        None,
    )


    user["_id"] = str(
        user["_id"]
    )

    user["id"] = user["_id"]


    user_status = (
        user.get(
            "status",
            "active",
        )
    )

    user["status"] = (
        user_status
    )

    user["is_active"] = (
        user_status == "active"
    )


    prediction_count = (
        prediction_collection.count_documents(
            {
                "user_id":
                    user["_id"],
            }
        )
    )


    user["predictions"] = (
        prediction_count
    )

    user["prediction_count"] = (
        prediction_count
    )


    return {

        "success":
            True,

        "user":
            user,

    }


# ============================================================
# DELETE USER
# ============================================================

@router.delete(
    "/users/{user_id}"
)
def delete_user(

    user_id: str,

    current_admin=Depends(
        get_current_admin
    ),

):

    if not ObjectId.is_valid(
        user_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID",
        )


    if (
        str(
            current_admin["_id"]
        )
        ==
        user_id
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Admin cannot delete "
                "their own account"
            ),
        )


    existing_user = (
        user_collection.find_one(
            {
                "_id":
                    ObjectId(
                        user_id
                    ),
            }
        )
    )


    if not existing_user:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )


    if (
        existing_user.get(
            "role",
            "user",
        )
        ==
        "admin"
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Administrator accounts "
                "cannot be deleted here"
            ),
        )


    user_collection.delete_one(
        {
            "_id":
                ObjectId(
                    user_id
                ),
        }
    )


    return {

        "success":
            True,

        "message":
            "User deleted successfully",

    }


# ============================================================
# GET ALL FARMS
# ============================================================

@router.get("/farms")
def get_all_farms(
    current_admin=Depends(
        get_current_admin
    ),
):

    farms = list(
        farm_collection.find({})
    )

    result = []


    for farm in farms:

        farm["_id"] = str(
            farm["_id"]
        )

        farm["id"] = farm["_id"]


        if "user_id" in farm:

            farm["user_id"] = str(
                farm["user_id"]
            )


        if "farm_id" in farm:

            farm["farm_id"] = str(
                farm["farm_id"]
            )


        if hasattr(
            farm.get(
                "created_at"
            ),
            "isoformat",
        ):

            farm["created_at"] = (
                farm[
                    "created_at"
                ].isoformat()
            )


        if hasattr(
            farm.get(
                "updated_at"
            ),
            "isoformat",
        ):

            farm["updated_at"] = (
                farm[
                    "updated_at"
                ].isoformat()
            )


        result.append(
            farm
        )


    return {

        "success":
            True,

        "farms":
            result,

    }


# ============================================================
# DELETE FARM
# ============================================================

@router.delete(
    "/farms/{farm_id}"
)
def delete_farm(

    farm_id: str,

    current_admin=Depends(
        get_current_admin
    ),

):

    if not ObjectId.is_valid(
        farm_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid farm ID",
        )


    existing_farm = (
        farm_collection.find_one(
            {
                "_id":
                    ObjectId(
                        farm_id
                    ),
            }
        )
    )


    if not existing_farm:

        raise HTTPException(
            status_code=404,
            detail="Farm not found",
        )


    result = (
        farm_collection.delete_one(
            {
                "_id":
                    ObjectId(
                        farm_id
                    ),
            }
        )
    )


    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Farm not found",
        )


    return {

        "success":
            True,

        "message":
            "Farm deleted successfully",

    }


# ============================================================
# GET ALL CROPS
# ============================================================

@router.get("/crops")
def get_all_crops(
    current_admin=Depends(
        get_current_admin
    ),
):

    crops = list(
        crop_collection.find({})
    )

    result = []


    for crop in crops:

        crop["_id"] = str(
            crop["_id"]
        )

        crop["id"] = crop["_id"]


        if "user_id" in crop:

            crop["user_id"] = str(
                crop["user_id"]
            )


        if "farm_id" in crop:

            crop["farm_id"] = str(
                crop["farm_id"]
            )


        if hasattr(
            crop.get(
                "created_at"
            ),
            "isoformat",
        ):

            crop["created_at"] = (
                crop[
                    "created_at"
                ].isoformat()
            )


        if hasattr(
            crop.get(
                "updated_at"
            ),
            "isoformat",
        ):

            crop["updated_at"] = (
                crop[
                    "updated_at"
                ].isoformat()
            )


        result.append(
            crop
        )


    return {

        "success":
            True,

        "crops":
            result,

    }


# ============================================================
# DELETE CROP
# ============================================================

@router.delete(
    "/crops/{crop_id}"
)
def delete_crop(

    crop_id: str,

    current_admin=Depends(
        get_current_admin
    ),

):

    if not ObjectId.is_valid(
        crop_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid crop ID",
        )


    existing_crop = (
        crop_collection.find_one(
            {
                "_id":
                    ObjectId(
                        crop_id
                    ),
            }
        )
    )


    if not existing_crop:

        raise HTTPException(
            status_code=404,
            detail="Crop not found",
        )


    result = (
        crop_collection.delete_one(
            {
                "_id":
                    ObjectId(
                        crop_id
                    ),
            }
        )
    )


    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Crop not found",
        )


    return {

        "success":
            True,

        "message":
            "Crop deleted successfully",

    }


# ============================================================
# GET ALL PREDICTIONS
# ============================================================

@router.get("/predictions")
def get_all_predictions(
    current_admin=Depends(
        get_current_admin
    ),
):

    predictions = list(
        prediction_collection.find({})
    )

    result = []


    for prediction in predictions:

        prediction["_id"] = str(
            prediction["_id"]
        )

        prediction["id"] = (
            prediction["_id"]
        )


        if "user_id" in prediction:

            prediction["user_id"] = str(
                prediction["user_id"]
            )


        if "farm_id" in prediction:

            prediction["farm_id"] = str(
                prediction["farm_id"]
            )


        if "crop_id" in prediction:

            prediction["crop_id"] = str(
                prediction["crop_id"]
            )


        if hasattr(
            prediction.get(
                "created_at"
            ),
            "isoformat",
        ):

            prediction["created_at"] = (
                prediction[
                    "created_at"
                ].isoformat()
            )


        if hasattr(
            prediction.get(
                "updated_at"
            ),
            "isoformat",
        ):

            prediction["updated_at"] = (
                prediction[
                    "updated_at"
                ].isoformat()
            )


        result.append(
            prediction
        )


    return {

        "success":
            True,

        "predictions":
            result,

    }


# ============================================================
# ============================================================
# AGRICULTURALIST ADMIN MANAGEMENT
# ============================================================
# ============================================================


# ============================================================
# 1. GET PENDING AGRICULTURALISTS
# ============================================================
#
# GET /admin/agriculturalists/pending
#
# Returns only applications whose status is "pending".
#
# IMPORTANT:
# This route MUST appear before:
#
# /admin/agriculturalists/{agriculturalist_id}
#
# Otherwise FastAPI may interpret "pending" as an ID.
# ============================================================

@router.get(
    "/agriculturalists/pending"
)
def get_pending_agriculturalists(
    current_admin=Depends(
        get_current_admin
    ),
):

    result = (
        get_agriculturalist_verification_requests()
    )

    return result


# ============================================================
# 2. GET ALL AGRICULTURALISTS
# ============================================================
#
# GET /admin/agriculturalists
#
# Returns all agriculturalist applications:
#
# pending
# active
# rejected
#
# ============================================================

@router.get(
    "/agriculturalists"
)
def get_all_agriculturalists(
    current_admin=Depends(
        get_current_admin
    ),
):

    try:

        from backend.app.database.agriculturalist_db import (
            agriculturalist_collection,
        )

        documents = list(
            agriculturalist_collection.find({})
            .sort(
                "created_at",
                -1,
            )
        )

        result = []


        for document in documents:

            # ------------------------------------------------
            # Use existing serializer
            # ------------------------------------------------

            from backend.app.services.agriculturalist_service import (
                serialize_agriculturalist,
            )

            result.append(
                serialize_agriculturalist(
                    document
                )
            )


        return {

            "success":
                True,

            "count":
                len(result),

            "agriculturalists":
                result,

        }


    except Exception as error:

        print(
            "GET ALL AGRICULTURALISTS ERROR:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load "
                "agriculturalists."
            ),
        )


# ============================================================
# 3. GET SINGLE AGRICULTURALIST
# ============================================================
#
# GET /admin/agriculturalists/{id}
#
# ============================================================

@router.get(
    "/agriculturalists/{agriculturalist_id}"
)
def get_single_agriculturalist(
    agriculturalist_id: str,

    current_admin=Depends(
        get_current_admin
    ),
):

    # --------------------------------------------------------
    # Validate ObjectId
    # --------------------------------------------------------

    if not ObjectId.is_valid(
        agriculturalist_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid agriculturalist ID.",
        )


    # --------------------------------------------------------
    # Get profile
    # --------------------------------------------------------

    result = (
        get_agriculturalist_profile(
            agriculturalist_id
        )
    )


    return result


# ============================================================
# 4. APPROVE AGRICULTURALIST
# ============================================================
#
# PATCH /admin/agriculturalists/{id}/approve
#
# pending
#    ↓
# active
#
# The agriculturalist can login after approval.
#
# ============================================================

@router.patch(
    "/agriculturalists/{agriculturalist_id}/approve"
)
def approve_agriculturalist(
    agriculturalist_id: str,

    current_admin=Depends(
        get_current_admin
    ),
):

    # --------------------------------------------------------
    # Validate ObjectId
    # --------------------------------------------------------

    if not ObjectId.is_valid(
        agriculturalist_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid agriculturalist ID.",
        )


    # --------------------------------------------------------
    # Admin ID
    # --------------------------------------------------------

    admin_id = str(
        current_admin["_id"]
    )


    # --------------------------------------------------------
    # Review application
    # --------------------------------------------------------

    result = (
        review_agriculturalist(

            agriculturalist_id=(
                agriculturalist_id
            ),

            decision="approve",

            admin_id=admin_id,

            rejection_reason=None,

        )
    )


    return result


# ============================================================
# 5. REJECT AGRICULTURALIST
# ============================================================
#
# PATCH /admin/agriculturalists/{id}/reject
#
# Body:
#
# {
#     "rejection_reason": "Government ID could not be verified."
# }
#
# pending
#    ↓
# rejected
#
# ============================================================

@router.patch(
    "/agriculturalists/{agriculturalist_id}/reject"
)
def reject_agriculturalist(
    agriculturalist_id: str,

    request: AgriculturalistRejectRequest = Body(
        ...
    ),

    current_admin=Depends(
        get_current_admin
    ),
):

    # --------------------------------------------------------
    # Validate ObjectId
    # --------------------------------------------------------

    if not ObjectId.is_valid(
        agriculturalist_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid agriculturalist ID.",
        )


    # --------------------------------------------------------
    # Clean rejection reason
    # --------------------------------------------------------

    rejection_reason = (
        request.rejection_reason
        or ""
    ).strip()


    if not rejection_reason:

        raise HTTPException(
            status_code=400,
            detail=(
                "A rejection reason "
                "is required."
            ),
        )


    # --------------------------------------------------------
    # Admin ID
    # --------------------------------------------------------

    admin_id = str(
        current_admin["_id"]
    )


    # --------------------------------------------------------
    # Review application
    # --------------------------------------------------------

    result = (
        review_agriculturalist(

            agriculturalist_id=(
                agriculturalist_id
            ),

            decision="reject",

            admin_id=admin_id,

            rejection_reason=(
                rejection_reason
            ),

        )
    )


    return result