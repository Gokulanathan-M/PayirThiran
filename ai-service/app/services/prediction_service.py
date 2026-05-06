"""Crop prediction service using the trained ML model or rule-based fallback."""

import os
import numpy as np
import joblib
from app import MODEL_DIR
from app.preprocessing.features import build_feature_vector

# Crop label list (order must match training label encoder)
CROP_LABELS = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane",
    "Soybean", "Mustard", "Groundnut", "Chickpea", "Sunflower",
]

# Try to load trained model at startup
_model = None
_model_path = os.path.join(MODEL_DIR, "crop_model.pkl")
if os.path.exists(_model_path):
    _model = joblib.load(_model_path)


def predict_crops(data: dict, top_k: int = 3) -> list[dict]:
    """Return top-k crop predictions with confidence scores."""
    features = build_feature_vector(data)

    if _model is not None:
        probas = _model.predict_proba(features)[0]
        top_indices = np.argsort(probas)[::-1][:top_k]
        results = []
        for idx in top_indices:
            label = CROP_LABELS[idx] if idx < len(CROP_LABELS) else f"Crop_{idx}"
            results.append({"cropName": label, "confidence": round(float(probas[idx]) * 100, 1)})
        return results
    else:
        # Rule-based fallback when no model is available
        return _rule_based_predict(data, top_k)


def _rule_based_predict(data: dict, top_k: int = 3) -> list[dict]:
    """Simple rule-based prediction as fallback."""
    season = (data.get("season") or "kharif").lower()
    soil = (data.get("soilType") or "loamy").lower()

    # Season-based primary crops
    season_crops = {
        "kharif": ["Rice", "Cotton", "Soybean", "Maize", "Groundnut"],
        "rabi": ["Wheat", "Mustard", "Chickpea", "Sunflower", "Maize"],
        "zaid": ["Sunflower", "Groundnut", "Maize", "Rice", "Soybean"],
        "summer": ["Sunflower", "Groundnut", "Cotton", "Maize", "Soybean"],
        "winter": ["Wheat", "Mustard", "Chickpea", "Sunflower", "Maize"],
    }

    candidates = season_crops.get(season, season_crops["kharif"])

    # Adjust confidence based on soil type suitability (simplified)
    soil_boost = {
        "loamy": {"Rice": 5, "Wheat": 5, "Maize": 5},
        "clay": {"Rice": 8, "Wheat": 3, "Cotton": 5},
        "sandy": {"Groundnut": 8, "Sunflower": 5, "Maize": 3},
        "black": {"Cotton": 10, "Soybean": 5, "Sugarcane": 5},
        "red": {"Groundnut": 5, "Rice": 3, "Maize": 3},
    }

    boosts = soil_boost.get(soil, {})
    base_conf = 80
    results = []
    for i, crop in enumerate(candidates[:top_k]):
        conf = base_conf - (i * 10) + boosts.get(crop, 0)
        conf = min(conf, 95)
        results.append({"cropName": crop, "confidence": round(conf, 1)})

    return results
