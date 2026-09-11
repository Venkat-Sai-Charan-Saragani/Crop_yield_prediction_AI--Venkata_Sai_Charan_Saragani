# ============================================================
# MAIN FASTAPI APPLICATION
# backend/main.py
# ============================================================

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import traceback


# ============================================================
# ROUTE IMPORTS
# ============================================================

from backend.app.routes.home_routes import (
    router as home_router
)

from backend.app.routes.health_routes import (
    router as health_router
)

from backend.app.routes.database_routes import (
    router as database_router
)

from backend.app.routes.user_routes import (
    router as user_router
)

from backend.app.routes.farm_routes import (
    router as farm_router
)

from backend.app.routes.crop_routes import (
    router as crop_router
)

from backend.app.routes.prediction_routes import (
    router as prediction_router
)

from backend.app.routes.dashboard_routes import (
    router as dashboard_router
)

from backend.app.routes.profile_routes import (
    router as profile_router
)

from backend.app.routes.admin_routes import (
    router as admin_router
)

from backend.app.routes.notification_routes import (
    router as notification_router
)

from backend.app.routes.chat_routes import (
    router as chat_router
)

from backend.app.routes.agriculturalist_routes import (
    router as agriculturalist_router
)

from backend.app.routes.consultation_routes import (
    router as consultation_router
)

from backend.app.routes.message_routes import (
    router as message_router
)

from backend.app.routes.analytics_routes import (
    router as analytics_router
)

from backend.app.routes.soil_routes import (
    router as soil_router
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Crop Yield - Prediction AI",
    description="AI-Powered Smart Farming System",
    version="1.0.0"
)


# ============================================================
# STATIC FILES
# ============================================================

# Make sure this folder exists:
#
# E:\projects\YieldSenseAI\uploads
#
# If it doesn't exist, create it.

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        # Local development
        "http://localhost:3000",
        "http://127.0.0.1:3000",

        # Vercel production frontend
        "https://frontend-amber-sigma-71.vercel.app",

        # Vercel deployment URL
        "https://frontend-dcred7a9d-venkat-c45d.vercel.app",
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


# ============================================================
# GLOBAL DEBUG EXCEPTION HANDLER
# ============================================================

@app.exception_handler(Exception)
async def debug_exception_handler(
    request,
    exc
):

    print(
        "\n"
        "=================================================="
    )

    print(
        "UNHANDLED BACKEND EXCEPTION"
    )

    print(
        "PATH:",
        request.url.path
    )

    print(
        "METHOD:",
        request.method
    )

    print(
        "ERROR:",
        repr(exc)
    )

    print(
        "=================================================="
        "\n"
    )

    traceback.print_exc()

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error.",
            "error": str(exc),
        },
    )


# ============================================================
# ROOT TEST ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "success": True,
        "message": "YieldSenseAI backend is running.",
    }


# ============================================================
# ROUTERS
# ============================================================

app.include_router(
    home_router
)

app.include_router(
    health_router
)

app.include_router(
    database_router
)

app.include_router(
    user_router
)

app.include_router(
    farm_router
)

app.include_router(
    crop_router
)

app.include_router(
    prediction_router
)

app.include_router(
    dashboard_router
)

app.include_router(
    profile_router
)

app.include_router(
    admin_router
)

app.include_router(
    notification_router
)

app.include_router(
    chat_router
)

app.include_router(
    agriculturalist_router
)

app.include_router(
    consultation_router
)

app.include_router(
    message_router
)

app.include_router(
    analytics_router
)

app.include_router(
    soil_router
)