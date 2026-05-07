"""Suitability scoring service."""

from app.services.crop_knowledge import get_crop_info, CROP_INFO


def compute_suitability(data: dict) -> dict:
    """
    Compute a suitability score (0-100) for a specific crop given conditions.
    Returns a dict matching SuitabilityResponse fields.
    """
    crop_name = data.get("cropName", "")
    info = get_crop_info(crop_name)

    score = 50  # base
    reasons = []

    # Season match
    ideal_season = info.get("season", "kharif")
    season = (data.get("season") or "").lower()
    if season == ideal_season:
        score += 15
        reasons.append(f"{season.capitalize()} season is ideal for {crop_name}")
    elif season:
        score -= 10
        reasons.append(f"{season.capitalize()} is not the preferred season (best: {ideal_season})")

    # Soil type suitability (simplified)
    soil = (data.get("soilType") or "").lower()
    good_soils = _preferred_soils(crop_name)
    if soil in good_soils:
        score += 15
        reasons.append(f"{soil.capitalize()} soil is well-suited for {crop_name}")
    elif soil:
        score += 5
        reasons.append(f"{soil.capitalize()} soil can support {crop_name} with amendments")

    # pH range
    ph = data.get("soilPH")
    if ph:
        ph = float(ph)
        if 5.5 <= ph <= 7.5:
            score += 10
            reasons.append(f"Soil pH {ph} is within acceptable range")
        else:
            score -= 5
            reasons.append(f"Soil pH {ph} may need correction (ideal: 5.5-7.5)")

    # Temperature
    temp = data.get("temperature")
    if temp:
        temp = float(temp)
        if 15 <= temp <= 35:
            score += 10
            reasons.append(f"Temperature {temp}°C is suitable for crop growth")
        else:
            score -= 5
            reasons.append(f"Temperature {temp}°C is outside optimal range")

    score = max(0, min(100, score))

    # Determine level
    if score >= 80:
        level = "highly_suitable"
    elif score >= 65:
        level = "suitable"
    elif score >= 45:
        level = "moderate"
    elif score >= 25:
        level = "marginal"
    else:
        level = "not_suitable"

    # Improvements
    improvements = []
    if ph and (ph < 5.5 or ph > 7.5):
        improvements.append({
            "title": "Adjust Soil pH",
            "description": "Apply lime to raise pH or sulphur to lower pH to the 6.0-7.0 range."
        })
    improvements.append({
        "title": "Add Organic Matter",
        "description": "Incorporate compost or vermicompost at 2-4 tonnes/acre to improve soil structure."
    })
    improvements.append({
        "title": "Soil Test Recommended",
        "description": "Conduct NPK + micronutrient soil test for precise fertilizer planning."
    })

    # Cultivation advice from knowledge base
    guide = info.get("guide", {})
    advice = {
        "plantingTime": f"Best planted during {ideal_season} season",
        "waterNeeds": guide.get("irrigation", "Moderate water requirement"),
        "fertilizerPlan": "; ".join(f"{f['name']} — {f['dosage']}" for f in info.get("fertilizers", [])[:3]),
        "commonPests": guide.get("pestManagement", "Follow integrated pest management"),
        "expectedYield": f"Estimated revenue: ₹{info.get('revenue_per_acre', 30000)}/acre",
    }

    soil_analysis = None
    if data.get("soilType") or data.get("soil_analysis_result"):
        analysis_result = data.get("soil_analysis_result") or {}
        soil_analysis = {
            "detectedType": analysis_result.get("detectedType") or data.get("soilType"),
            "pH": ph,
            "confidence": analysis_result.get("confidence")
        }

    return {
        "suitabilityScore": score,
        "suitabilityLevel": level,
        "soilAnalysis": soil_analysis,
        "reasons": reasons,
        "improvements": improvements,
        "cultivationAdvice": advice,
    }


def _preferred_soils(crop_name: str) -> list[str]:
    """Return list of preferred soil types for a crop."""
    mapping = {
        "Rice": ["clay", "loamy"],
        "Wheat": ["loamy", "clay"],
        "Maize": ["loamy", "sandy"],
        "Cotton": ["black", "loamy"],
        "Sugarcane": ["loamy", "clay"],
        "Soybean": ["loamy", "black"],
        "Mustard": ["loamy", "sandy"],
        "Groundnut": ["sandy", "red"],
        "Chickpea": ["loamy", "sandy"],
        "Sunflower": ["loamy", "black"],
    }
    return mapping.get(crop_name, ["loamy"])
