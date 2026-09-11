
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
import base64

from backend.app.database.mongodb import get_database
from backend.app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


# -----------------------------
# Profile Update Schema
# -----------------------------

class ProfileUpdate(BaseModel):

    full_name: Optional[str] = None

    email: Optional[str] = None

    phone: Optional[str] = None

    location: Optional[str] = None

    farm_name: Optional[str] = None

    profile_image: Optional[str] = None


# -----------------------------
# Get Profile
# -----------------------------

@router.get("/")
def get_profile(
    current_user=Depends(get_current_user)
):

    db = get_database()

    user_id = ObjectId(
        str(current_user["_id"])
    )

    farms = db["farms"].count_documents(
        {
            "user_id": user_id
        }
    )

    crops = db["crops"].count_documents(
        {
            "user_id": user_id
        }
    )

    predictions = db["predictions"].count_documents(
        {
            "user_id": str(user_id)
        }
    )

    return {

        "success": True,

        "profile": {

            "name": current_user.get(
                "full_name",
                "User"
            ),

            "email": current_user.get(
                "email",
                ""
            ),

            "phone": current_user.get(
                "phone",
                ""
            ),

            "location": current_user.get(
                "location",
                ""
            ),

            "farm_name": current_user.get(
                "farm_name",
                ""
            ),

            "profile_image": current_user.get(
                "profile_image",
                ""
            ),

            "role": "AI User",

            "stats": {

                "farms": farms,

                "crops": crops,

                "predictions": predictions

            }

        }

    }


# -----------------------------
# Upload Profile Image
# -----------------------------

@router.post("/upload-image")
async def upload_profile_image(

    file: UploadFile = File(...),

    current_user=Depends(get_current_user)

):

    db = get_database()

    user_id = ObjectId(
        str(current_user["_id"])
    )

    # -----------------------------
    # Validate File Type
    # -----------------------------

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    }

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPG, JPEG, PNG, and WEBP "
                "images are allowed."
            )
        )

    # -----------------------------
    # Read Image
    # -----------------------------

    image_bytes = await file.read()

    # -----------------------------
    # Validate Empty File
    # -----------------------------

    if len(image_bytes) == 0:

        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty."
        )

    # -----------------------------
    # Validate File Size
    # Maximum 2 MB
    # -----------------------------

    max_size = 2 * 1024 * 1024

    if len(image_bytes) > max_size:

        raise HTTPException(
            status_code=400,
            detail=(
                "Profile image must be smaller "
                "than 2 MB."
            )
        )

    # -----------------------------
    # Convert Image to Base64
    # -----------------------------

    encoded_image = base64.b64encode(
        image_bytes
    ).decode("utf-8")

    image_url = (
        f"data:{file.content_type};base64,"
        f"{encoded_image}"
    )

    # -----------------------------
    # Store Image in MongoDB
    # -----------------------------

    result = db["users"].update_one(

        {
            "_id": user_id
        },

        {
            "$set": {
                "profile_image": image_url
            }
        }

    )

    # -----------------------------
    # Verify User
    # -----------------------------

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # -----------------------------
    # Return Response
    # -----------------------------

    return {

        "success": True,

        "message":
        "Profile image uploaded successfully.",

        "image_url": image_url

    }


# -----------------------------
# Update Profile
# -----------------------------

@router.put("/update")
def update_profile(

    data: ProfileUpdate,

    current_user=Depends(get_current_user)

):

    db = get_database()

    user_id = ObjectId(
        str(current_user["_id"])
    )

    update_data = data.dict(
        exclude_none=True
    )

    if len(update_data) == 0:

        return {

            "success": False,

            "message": "No data provided"

        }

    db["users"].update_one(

        {
            "_id": user_id
        },

        {
            "$set": update_data
        }

    )

    return {

        "success": True,

        "message":
        "Profile updated successfully"

    }
