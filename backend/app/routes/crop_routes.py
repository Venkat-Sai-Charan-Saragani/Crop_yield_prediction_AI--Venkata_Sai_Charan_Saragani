from fastapi import APIRouter, Depends

from backend.app.auth.dependencies import get_current_user
from backend.app.schemas.crop_schema import (
    CropCreate,
    CropUpdate
)
from backend.app.services.crop_service import (
    create_crop,
    get_crops,
    get_crop_by_id,
    update_crop,
    delete_crop
)


router = APIRouter(
    prefix="/crops",
    tags=["crops"]
)


@router.post("")
def add_crop(
    crop: CropCreate,
    current_user=Depends(get_current_user)
):
    print("========== CROP ROUTE HIT ==========")
    print("CROP:", crop)
    print("USER:", current_user)

    return create_crop(crop, current_user)


@router.get("")
def get_all_crops(
    current_user=Depends(get_current_user)
):
    return get_crops(current_user)


@router.get("/{crop_id}")
def get_crop_by_id_route(
    crop_id: str,
    current_user=Depends(get_current_user)
):
    return get_crop_by_id(crop_id, current_user)




@router.put("/{crop_id}")
def update_crop_route(
    crop_id: str,
    crop: CropUpdate,
    current_user=Depends(get_current_user)
):
    return update_crop(
        crop_id,
        crop,
        current_user
    )


@router.delete("/{crop_id}")
def delete_crop_route(
    crop_id: str,
    current_user=Depends(get_current_user)
):
    return delete_crop(crop_id, current_user)
