from fastapi import APIRouter, Depends

from backend.app.auth.dependencies import get_current_user
from backend.app.schemas.farm_schema import FarmCreate, FarmUpdate
from backend.app.services.farm_service import (
    create_farm,
    get_all_farms,
    get_farm_by_id,
    update_farm,
    delete_farm
)

router = APIRouter(
    prefix="/farms",
    tags=["farms"]
)

@router.post("")
def add_farm(
    farm: FarmCreate,
    current_user=Depends(get_current_user)
):
    return create_farm(
        farm,
        current_user
    )

@router.get("")
def get_farm(
    current_user=Depends(get_current_user)
):
    return get_all_farms(current_user)


@router.get("/{farm_id}")
def get_farm_by_id_route(
    farm_id: str,
    current_user=Depends(get_current_user)
):
    return get_farm_by_id(
        farm_id,
        current_user
    )


@router.put("/{farm_id}")
def update_farm_route(
    farm_id: str,
    farm: FarmUpdate,
    current_user=Depends(get_current_user)
):
    return update_farm(
        farm_id,
        farm,
        current_user
    )


@router.delete("/{farm_id}")
def delete_farm_route(
    farm_id: str,
    current_user=Depends(get_current_user)
):
    return delete_farm(
        farm_id,
        current_user
    )