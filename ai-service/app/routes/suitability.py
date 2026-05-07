import os
import shutil
from fastapi import APIRouter, Form, UploadFile, File
from typing import Optional
from app.services.suitability_service import compute_suitability
from app.services.soil_service import analyze_soil_image
from app.models.schemas import SuitabilityResponse

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/", response_model=SuitabilityResponse)
async def check_suitability(
    cropName: str = Form(...),
    soilType: Optional[str] = Form(None),
    soilPH: Optional[float] = Form(None),
    temperature: Optional[float] = Form(None),
    humidity: Optional[float] = Form(None),
    rainfall: Optional[float] = Form(None),
    landSize: Optional[float] = Form(None),
    season: Optional[str] = Form(None),
    soilImage: Optional[UploadFile] = File(None),
):
    data = {
        "cropName": cropName,
        "soilType": soilType,
        "soilPH": soilPH,
        "temperature": temperature,
        "humidity": humidity,
        "rainfall": rainfall,
        "landSize": landSize,
        "season": season,
    }

    # Process soil image if uploaded
    if soilImage and soilImage.filename:
        file_path = os.path.join(UPLOAD_DIR, soilImage.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(soilImage.file, f)
        soil_result = analyze_soil_image(file_path)
        data["soil_analysis_result"] = soil_result
        if not data["soilType"] and soil_result.get("detectedType"):
            data["soilType"] = soil_result["detectedType"]

    result = compute_suitability(data)
    return result
