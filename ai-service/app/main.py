from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router as predict_router
from app.routes.suitability import router as suitability_router
from app.routes.health import router as health_router

app = FastAPI(title="Crop Recommendation AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, tags=["Health"])
app.include_router(predict_router, prefix="/predict", tags=["Prediction"])
app.include_router(suitability_router, prefix="/suitability", tags=["Suitability"])

if __name__ == "__main__":
    import uvicorn
    from app import AI_SERVICE_PORT
    uvicorn.run("app.main:app", host="0.0.0.0", port=AI_SERVICE_PORT, reload=True)
