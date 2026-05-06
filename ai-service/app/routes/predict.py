import os
import shutil
from fastapi import APIRouter, Form, UploadFile, File
from typing import Optional
from app.services.prediction_service import predict_crops
from app.services.soil_service import analyze_soil_image
from app.services.crop_knowledge import enrich_predictions
from app.models.schemas import PredictionResponse

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/", response_model=PredictionResponse)
async def predict(
    soilType: Optional[str] = Form(None),
    soilPH: Optional[float] = Form(None),
    temperature: Optional[float] = Form(None),
    humidity: Optional[float] = Form(None),
    rainfall: Optional[float] = Form(None),
    irrigation: Optional[str] = Form(None),
    soilMoisture: Optional[str] = Form(None),
    previousCrop: Optional[str] = Form(None),
    season: Optional[str] = Form(None),
    landSize: Optional[float] = Form(None),
    investmentAmount: Optional[float] = Form(None),
    soilImage: Optional[UploadFile] = File(None),
):
    data = {
        "soilType": soilType,
        "soilPH": soilPH,
        "temperature": temperature,
        "humidity": humidity,
        "rainfall": rainfall,
        "irrigation": irrigation,
        "soilMoisture": soilMoisture,
        "previousCrop": previousCrop,
        "season": season,
        "landSize": landSize,
        "investmentAmount": investmentAmount,
    }

    soil_analysis = None

    # Process soil image if uploaded
    if soilImage and soilImage.filename:
        file_path = os.path.join(UPLOAD_DIR, soilImage.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(soilImage.file, f)
        soil_analysis = analyze_soil_image(file_path)
        # Use detected soil type if none provided
        if not data["soilType"] and soil_analysis.get("detectedType"):
            data["soilType"] = soil_analysis["detectedType"]

    # Predict crops
    predictions = predict_crops(data, top_k=3)

    # Enrich with knowledge base data
    predictions = enrich_predictions(predictions, investmentAmount, landSize)

    # Build soil analysis response
    soil_resp = None
    if soil_analysis or soilPH:
        soil_resp = {
            "detectedType": (soil_analysis or {}).get("detectedType") or soilType,
            "pH": soilPH,
            "nitrogen": None,
            "phosphorus": None,
            "potassium": None,
        }

    return {"crops": predictions, "soilAnalysis": soil_resp}
