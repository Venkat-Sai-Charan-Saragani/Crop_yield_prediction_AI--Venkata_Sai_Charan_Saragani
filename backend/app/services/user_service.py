from bson import ObjectId


from backend.app.database.mongodb import get_database
from backend.app.models.user_model import create_user_document
from backend.app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    UserProfileUpdate,
)
from backend.app.utils.password import verify_password
from backend.app.utils.jwt import create_access_token

db = get_database()
user_collection = db["users"]

def register_user(user: UserRegister):

    # Check if email already exists
    existing_user = user_collection.find_one({"email": user.email})

    if existing_user:
        return {
            "success" : False,
            "message" : "Email already registered"
        }

    #create user document
    user_document = create_user_document(user)

    #insert into mongodb
    result = user_collection.insert_one(user_document)

    return {
        "success": True,
        "message": "User Registered Sucessfully",
        "user_id": str(result.inserted_id)
    }


def login_user(user: UserLogin):

    #Find user by email
    existing_user = user_collection.find_one(
        {"email": user.email}
    )

    if not existing_user:
        return{
        "success" : False,
        "message": "User not found"
        }

    #compare entered password with stored password
    password_valid = verify_password(
        user.password,
        existing_user["password"]
    )

    if not password_valid:
        return {
            "success": False,
            "message": "Invalid password"
        }
    access_token = create_access_token(
        {
            "user_id": str(existing_user["_id"])
        }
    )

    return {
        "success": True,
        "message": "Login Successful",
        "access_token": access_token,
        "token_type": "bearer"
    }


def update_user_profile(user_id: str, profile: UserProfileUpdate):

    update_data = profile.model_dump(exclude_none=True)

    if not update_data:
        return {
            "success": False,
            "message": "No data provided to update"
        }

    result = user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": update_data
        }
    )

    if result.modified_count == 0:
        return {
            "success": False,
            "message": "Profile not updated"
        }

    return {
        "success": True,
        "message": "Profile updated successfully"
    }

def get_user_profile(current_user):

    return {
        "success": True,
        "user": {
            "id": str(current_user["_id"]),
            "full_name": current_user.get("full_name"),
            "email": current_user.get("email"),
            "phone_number": current_user.get("phone_number"),
            "date_of_birth": current_user.get("date_of_birth"),
            "location": current_user.get("location"),
        }
    }