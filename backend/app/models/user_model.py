from backend.app.schemas.user_schema import UserRegister
from backend.app.utils.password import hash_password


def create_user_document(user: UserRegister):

    return {
        "full_name": user.full_name,
        "email": user.email,
        "password": hash_password(user.password),

        "phone_number" : None,
        "date_of_birth" : None,

        "location" : {
            "state" : None,
            "district" : None,
            "village" : None
        }
    }