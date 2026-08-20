# ============================================================
# AGRICULTURALIST ROUTES
# backend/app/routes/agriculturalist_routes.py
# ============================================================

from fastapi import (
    APIRouter,
    Depends,
)

from backend.app.schemas.agriculturalist_schema import (
    AgriculturalistRegister,
    AgriculturalistLogin,
    AgriculturalistProfileUpdate,
)

from backend.app.services.agriculturalist_service import (
    register_agriculturalist,
    login_agriculturalist,
    get_agriculturalist_profile,
    update_agriculturalist_profile,
    get_available_agriculturalists,
)

from backend.app.agriculturalist.agriculturalist_auth import (
    get_current_agriculturalist,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/agriculturalist",
    tags=["Agriculturalist"],
)


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    data: AgriculturalistRegister,
):

    return register_agriculturalist(
        data
    )


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    data: AgriculturalistLogin,
):

    return login_agriculturalist(
        data
    )


# ============================================================
# AVAILABLE AGRICULTURALISTS
#
# USER SIDE
#
# GET /agriculturalist/available
#
# IMPORTANT:
# This endpoint is for NORMAL USERS.
# It does NOT require agriculturalist authentication.
# ============================================================

@router.get("/available")
def available_agriculturalists():

    return get_available_agriculturalists()


# ============================================================
# AGRICULTURALIST PROFILE
#
# AGRICULTURALIST SIDE
#
# GET /agriculturalist/me
# ============================================================

@router.get("/me")
def profile(
    current_agriculturalist=Depends(
        get_current_agriculturalist
    ),
):

    return get_agriculturalist_profile(
        str(
            current_agriculturalist["_id"]
        )
    )


# ============================================================
# UPDATE PROFILE
#
# PUT /agriculturalist/me
# ============================================================

@router.put("/me")
def update_profile(
    data: AgriculturalistProfileUpdate,

    current_agriculturalist=Depends(
        get_current_agriculturalist
    ),
):

    return update_agriculturalist_profile(

        str(
            current_agriculturalist["_id"]
        ),

        data,
    )


# ============================================================
# AGRICULTURALIST CONVERSATIONS
#
# AGRICULTURALIST SIDE
#
# GET /agriculturalist/conversations
# ============================================================

@router.get("/conversations")
def get_conversations(
    current_agriculturalist=Depends(
        get_current_agriculturalist
    ),
):

    agriculturalist_id = str(
        current_agriculturalist["_id"]
    )

    print(
        "AGRICULTURALIST CONVERSATIONS REQUEST:",
        agriculturalist_id
    )

    # --------------------------------------------------------
    # TEMPORARY RESPONSE
    #
    # This confirms that the agriculturalist JWT is working.
    # We can connect the actual chat collection here after
    # authentication is confirmed.
    # --------------------------------------------------------

    return {

        "success": True,

        "message":
            "Agriculturalist conversations loaded.",

        "conversations": [],
    }