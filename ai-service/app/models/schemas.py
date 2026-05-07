from pydantic import BaseModel, Field
from typing import Optional, List


class PredictionRequest(BaseModel):
    soilType: Optional[str] = None
    soilPH: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    irrigation: Optional[str] = None
    soilMoisture: Optional[str] = None
    previousCrop: Optional[str] = None
    season: Optional[str] = None
    landSize: Optional[float] = None
    investmentAmount: Optional[float] = None


class FertilizerInfo(BaseModel):
    name: str
    dosage: str
    timing: str
    notes: Optional[str] = None


class CultivationGuide(BaseModel):
    landPreparation: Optional[str] = None
    sowing: Optional[str] = None
    irrigation: Optional[str] = None
    pestManagement: Optional[str] = None
    harvesting: Optional[str] = None


class CropResult(BaseModel):
    cropName: str
    confidence: float
    season: str
    sustainabilityScore: str = "medium"
    estimatedInvestment: Optional[float] = None
    estimatedRevenue: Optional[float] = None
    roi: Optional[float] = None
    fertilizers: List[FertilizerInfo] = []
    cultivationGuide: Optional[CultivationGuide] = None
    growthTips: List[str] = []


class SoilAnalysis(BaseModel):
    detectedType: Optional[str] = None
    pH: Optional[float] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None


class PredictionResponse(BaseModel):
    crops: List[CropResult]
    soilAnalysis: Optional[SoilAnalysis] = None


class SuitabilityRequest(BaseModel):
    cropName: str
    soilType: Optional[str] = None
    soilPH: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    landSize: Optional[float] = None
    season: Optional[str] = None


class SoilImprovement(BaseModel):
    title: str
    description: str


class CultivationAdvice(BaseModel):
    plantingTime: Optional[str] = None
    waterNeeds: Optional[str] = None
    fertilizerPlan: Optional[str] = None
    commonPests: Optional[str] = None
    expectedYield: Optional[str] = None


class SuitabilityResponse(BaseModel):
    suitabilityScore: float
    suitabilityLevel: str
    soilAnalysis: Optional[SoilAnalysis] = None
    reasons: List[str] = []
    improvements: List[SoilImprovement] = []
    cultivationAdvice: Optional[CultivationAdvice] = None
