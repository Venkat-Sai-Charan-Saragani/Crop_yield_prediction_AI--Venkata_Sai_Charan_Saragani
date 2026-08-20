from fastapi import APIRouter, Depends

from backend.app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    UserProfileUpdate,
    GoogleLoginRequest,
    GoogleRegisterRequest,
)

from backend.app.services.user_service import (
    register_user,
    login_user,
    google_login_user,
    google_register_user,
    update_user_profile,
    get_user_profile,
)

from backend.app.auth.dependencies import (
    get_current_user
)


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


# ==========================================
# NORMAL REGISTER
# ==========================================

@router.post("/register")
def register(
    user: UserRegister
):

    return register_user(user)


# ==========================================
# NORMAL LOGIN
# ==========================================

@router.post("/login")
def login(
    user: UserLogin
):

    return login_user(user)


# ==========================================
# GOOGLE REGISTER
# ==========================================

@router.post("/google-register")
def google_register(
    data: GoogleRegisterRequest
):

    return google_register_user(
        data.code
    )


# ==========================================
# GOOGLE LOGIN
# ==========================================

@router.post("/google-login")
def google_login(
    data: GoogleLoginRequest
):

    return google_login_user(
        data.code
    )


# ==========================================
# GET PROFILE
# ==========================================

@router.get("/me")
def get_profile(
    current_user=Depends(
        get_current_user
    )
):

    return get_user_profile(
        current_user
    )


# ==========================================
# UPDATE PROFILE
# ==========================================

@router.put("/me")
def update_profile(
    profile: UserProfileUpdate,
    current_user=Depends(
        get_current_user
    )
):

    return update_user_profile(
        str(current_user["_id"]),
        profile
    )