from fastapi import APIRouter, Depends

from backend.app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    UserProfileUpdate,
)
from backend.app.services.user_service import (
    register_user,
    login_user,
    update_user_profile,
    get_user_profile,
)
from backend.app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.post("/register")
def register(user: UserRegister):
    return register_user(user)


@router.post("/login")
def login(user: UserLogin):
    return login_user(user)


@router.get("/me")
def get_profile(
    current_user=Depends(get_current_user)
):
    return get_user_profile(current_user)

@router.put("/me")
def update_profile(
    profile: UserProfileUpdate,
    current_user= Depends(get_current_user)
):
    return update_user_profile(
        str(current_user["_id"]),
        profile
    )