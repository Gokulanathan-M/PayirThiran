"""Feature preprocessing for the crop recommendation model."""

import numpy as np

# Encoding maps
SOIL_TYPE_MAP = {
    "sandy": 0, "clay": 1, "loamy": 2, "red": 3, "black": 4, "unknown": 5,
}
IRRIGATION_MAP = {
    "drip": 0, "sprinkler": 1, "flood": 2, "rainfed": 3, "manual": 4, "": 5,
}
MOISTURE_MAP = {
    "dry": 0, "low": 1, "moderate": 2, "high": 3, "waterlogged": 4, "": 5,
}
SEASON_MAP = {
    "kharif": 0, "rabi": 1, "zaid": 2, "summer": 3, "winter": 4, "": 5,
}
CROP_MAP = {
    "rice": 0, "wheat": 1, "maize": 2, "cotton": 3, "sugarcane": 4,
    "soybean": 5, "mustard": 6, "groundnut": 7, "chickpea": 8,
    "sunflower": 9, "none": 10, "": 10,
}


def encode_feature(value, mapping, default=5):
    """Encode a categorical feature using the provided mapping."""
    if value is None:
        return default
    return mapping.get(str(value).lower().strip(), default)


def build_feature_vector(data: dict) -> np.ndarray:
    """
    Convert input data dict to a numeric feature vector.
    Features (11 total):
      0 - soilType (encoded)
      1 - soilPH
      2 - temperature
      3 - humidity
      4 - rainfall
      5 - irrigation (encoded)
      6 - soilMoisture (encoded)
      7 - previousCrop (encoded)
      8 - season (encoded)
      9 - landSize
     10 - investmentAmount
    """
    features = [
        encode_feature(data.get("soilType"), SOIL_TYPE_MAP),
        float(data.get("soilPH") or 6.5),
        float(data.get("temperature") or 25.0),
        float(data.get("humidity") or 60.0),
        float(data.get("rainfall") or 100.0),
        encode_feature(data.get("irrigation"), IRRIGATION_MAP),
        encode_feature(data.get("soilMoisture"), MOISTURE_MAP),
        encode_feature(data.get("previousCrop"), CROP_MAP, default=10),
        encode_feature(data.get("season"), SEASON_MAP),
        float(data.get("landSize") or 1.0),
        float(data.get("investmentAmount") or 50000),
    ]
    return np.array(features).reshape(1, -1)
