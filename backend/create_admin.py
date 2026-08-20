from backend.app.database.mongodb import get_database

from backend.app.utils.password import hash_password


# ============================================================
# DATABASE
# ============================================================

db = get_database()

user_collection = db["users"]


# ============================================================
# ADMIN DETAILS
# ============================================================

ADMIN_EMAIL = "venkatsai20@gmail.com"

ADMIN_PASSWORD = "Venkat@20"

ADMIN_NAME = "Crop_Yield_Prediction-AI Admin"


# ============================================================
# CHECK EXISTING USER
# ============================================================

existing_user = user_collection.find_one({

    "email":
        ADMIN_EMAIL

})


if existing_user:

    # --------------------------------------------------------
    # Convert existing account into admin
    # --------------------------------------------------------

    user_collection.update_one(

        {
            "_id":
                existing_user["_id"]
        },

        {
            "$set": {

                "role":
                    "admin"

            }

        }

    )


    print(
        "Existing account converted to ADMIN."
    )


else:

    # --------------------------------------------------------
    # Create new admin
    # --------------------------------------------------------

    admin_document = {

        "full_name":
            ADMIN_NAME,

        "email":
            ADMIN_EMAIL,

        "password":
            hash_password(
                ADMIN_PASSWORD
            ),

        "auth_provider":
            "local",

        "role":
            "admin",

        "google_id":
            None,

        "phone_number":
            None,

        "date_of_birth":
            None,

        "location": {

            "state":
                None,

            "district":
                None,

            "village":
                None

        },

        "profile_image":
            None

    }


    user_collection.insert_one(
        admin_document
    )


    print(
        "ADMIN CREATED SUCCESSFULLY."
    )


print()
print(
    "Admin Email:",
    ADMIN_EMAIL
)

print(
    "Admin Password:",
    ADMIN_PASSWORD
)