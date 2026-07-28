from fastapi import FastAPI
from fastapi.responses import JSONResponse
import traceback

from backend.app.routes.home_routes import router as home_router
from backend.app.routes.health_routes import router as health_router
from backend.app.routes.database_routes import router as database_router
from backend.app.routes.user_routes import router as user_router
from backend.app.routes.farm_routes import router as farm_router
from backend.app.routes.crop_routes import router as crop_router
from backend.app.routes.prediction_routes import router as prediction_router


app = FastAPI(
    title="Crop Yield - Prediction AI",
    description="AI-Powered Smart Farming System",
    version="1.0.0"
)

@app.exception_handler(Exception)
async def debug_exception_handler(request, exc):
    traceback.print_exc()
    return JSONResponse(status_code=500, content={"error": str(exc)})



app.include_router(home_router)
app.include_router(health_router)
app.include_router(database_router)
app.include_router(user_router)
app.include_router(farm_router)
app.include_router(crop_router)
app.include_router(prediction_router)