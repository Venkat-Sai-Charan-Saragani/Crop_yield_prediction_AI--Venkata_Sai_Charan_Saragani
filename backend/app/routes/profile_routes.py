from fastapi import APIRouter, Depends, UploadFile, File
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

import os
import shutil


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


            "stats":{

                "farms":farms,

                "crops":crops,

                "predictions":predictions

            }

        }

    }







# -----------------------------
# Upload Profile Image
# -----------------------------

@router.post("/upload-image")
def upload_profile_image(

    file: UploadFile = File(...),

    current_user=Depends(get_current_user)

):


    db = get_database()


    user_id = ObjectId(
        str(current_user["_id"])
    )



    upload_folder = "uploads/profile"


    os.makedirs(
        upload_folder,
        exist_ok=True
    )



    file_path = (

        f"{upload_folder}/"
        f"{user_id}_{file.filename}"

    )



    with open(
        file_path,
        "wb"
    ) as buffer:


        shutil.copyfileobj(

            file.file,

            buffer

        )



    image_url = "/" + file_path



    db["users"].update_one(

        {
            "_id":user_id
        },

        {

            "$set":{

                "profile_image":image_url

            }

        }

    )



    return {


        "success":True,


        "image_url":image_url


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



    if len(update_data)==0:


        return {

            "success":False,

            "message":"No data provided"

        }




    db["users"].update_one(

        {

            "_id":user_id

        },

        {

            "$set":update_data

        }

    )



    return {


        "success":True,

        "message":
        "Profile updated successfully"


    }