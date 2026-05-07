"""
Generate a synthetic crop recommendation dataset and train a Gradient Boosting classifier.
Run this script once to produce `trained_models/crop_model.pkl`.

Usage:
    cd ai-service
    python -m training.train_model
"""

import os
import sys
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib

# ------------------------------------------------------------------ #
#  Configuration                                                      #
# ------------------------------------------------------------------ #
NUM_SAMPLES = 5000
RANDOM_SEED = 42
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "trained_models")
OUTPUT_MODEL = os.path.join(MODEL_DIR, "crop_model.pkl")
OUTPUT_ENCODER = os.path.join(MODEL_DIR, "label_encoder.pkl")
DATA_CSV = os.path.join(os.path.dirname(__file__), "data", "synthetic_crop_data.csv")

CROP_LABELS = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane",
    "Soybean", "Mustard", "Groundnut", "Chickpea", "Sunflower",
]

# Feature encoding maps (must match preprocessing/features.py)
SOIL_TYPE_MAP = {"sandy": 0, "clay": 1, "loamy": 2, "red": 3, "black": 4, "unknown": 5}
IRRIGATION_MAP = {"drip": 0, "sprinkler": 1, "flood": 2, "rainfed": 3, "manual": 4, "none": 5}
MOISTURE_MAP = {"dry": 0, "low": 1, "moderate": 2, "high": 3, "waterlogged": 4, "unknown": 5}
SEASON_MAP = {"kharif": 0, "rabi": 1, "zaid": 2, "summer": 3, "winter": 4, "unknown": 5}
CROP_MAP_PREV = {"rice": 0, "wheat": 1, "maize": 2, "cotton": 3, "sugarcane": 4,
                 "soybean": 5, "mustard": 6, "groundnut": 7, "chickpea": 8,
                 "sunflower": 9, "none": 10}

# ------------------------------------------------------------------ #
#  Crop profiles — (mean, std) for continuous features per crop       #
#  Features: soilType, soilPH, temp, humidity, rainfall,              #
#            irrigation, moisture, prevCrop, season, landSize, invest  #
# ------------------------------------------------------------------ #
CROP_PROFILES = {
    "Rice":       {"soil": [1, 2], "ph": (6.0, 0.5), "temp": (28, 3), "hum": (80, 8), "rain": (200, 50), "irr": [2, 0], "moist": [3, 4], "season": [0]},
    "Wheat":      {"soil": [2, 1], "ph": (6.5, 0.4), "temp": (18, 3), "hum": (55, 10), "rain": (60, 20), "irr": [0, 1, 2], "moist": [1, 2], "season": [1, 4]},
    "Maize":      {"soil": [2, 0], "ph": (6.0, 0.6), "temp": (25, 4), "hum": (65, 10), "rain": (100, 30), "irr": [0, 1], "moist": [2], "season": [0, 2]},
    "Cotton":     {"soil": [4, 2], "ph": (7.0, 0.5), "temp": (30, 3), "hum": (50, 10), "rain": (80, 25), "irr": [0, 2], "moist": [1, 2], "season": [0]},
    "Sugarcane":  {"soil": [2, 1], "ph": (6.5, 0.5), "temp": (30, 4), "hum": (75, 10), "rain": (150, 40), "irr": [2, 0], "moist": [2, 3], "season": [0]},
    "Soybean":    {"soil": [2, 4], "ph": (6.2, 0.4), "temp": (27, 3), "hum": (70, 10), "rain": (120, 30), "irr": [3], "moist": [2], "season": [0]},
    "Mustard":    {"soil": [2, 0], "ph": (6.8, 0.5), "temp": (20, 3), "hum": (45, 10), "rain": (40, 15), "irr": [0, 1], "moist": [1], "season": [1]},
    "Groundnut":  {"soil": [0, 3], "ph": (6.0, 0.5), "temp": (28, 3), "hum": (55, 10), "rain": (60, 20), "irr": [3, 0], "moist": [1, 2], "season": [0, 3]},
    "Chickpea":   {"soil": [2, 0], "ph": (7.0, 0.4), "temp": (22, 3), "hum": (40, 10), "rain": (50, 15), "irr": [3], "moist": [0, 1], "season": [1]},
    "Sunflower":  {"soil": [2, 4], "ph": (6.5, 0.5), "temp": (25, 4), "hum": (50, 10), "rain": (50, 20), "irr": [0, 1], "moist": [1, 2], "season": [1, 2]},
}


def generate_dataset(n: int = NUM_SAMPLES, seed: int = RANDOM_SEED) -> pd.DataFrame:
    """Generate a synthetic crop recommendation dataset."""
    rng = np.random.default_rng(seed)
    samples_per_crop = n // len(CROP_LABELS)
    rows = []

    for crop in CROP_LABELS:
        p = CROP_PROFILES[crop]
        for _ in range(samples_per_crop):
            soil = rng.choice(p["soil"])
            ph = np.clip(rng.normal(*p["ph"]), 3.5, 9.5)
            temp = np.clip(rng.normal(*p["temp"]), 5, 48)
            hum = np.clip(rng.normal(*p["hum"]), 10, 100)
            rain = np.clip(rng.normal(*p["rain"]), 0, 500)
            irr = rng.choice(p["irr"])
            moist = rng.choice(p["moist"])
            prev_crop = rng.integers(0, 11)
            season = rng.choice(p["season"])
            land = np.clip(rng.lognormal(0.5, 0.8), 0.1, 50)
            invest = np.clip(rng.lognormal(10.3, 0.6), 5000, 500000)

            # Add noise
            if rng.random() < 0.1:
                soil = rng.integers(0, 6)
            if rng.random() < 0.1:
                season = rng.integers(0, 5)

            rows.append({
                "soilType": soil,
                "soilPH": round(ph, 1),
                "temperature": round(temp, 1),
                "humidity": round(hum, 1),
                "rainfall": round(rain, 1),
                "irrigation": irr,
                "soilMoisture": moist,
                "previousCrop": prev_crop,
                "season": season,
                "landSize": round(land, 2),
                "investmentAmount": round(invest),
                "crop": crop,
            })

    df = pd.DataFrame(rows)
    return df.sample(frac=1, random_state=seed).reset_index(drop=True)


def train(df: pd.DataFrame):
    """Train a Gradient Boosting model and save artifacts."""
    feature_cols = [
        "soilType", "soilPH", "temperature", "humidity", "rainfall",
        "irrigation", "soilMoisture", "previousCrop", "season",
        "landSize", "investmentAmount",
    ]
    X = df[feature_cols].values
    le = LabelEncoder()
    y = le.fit_transform(df["crop"])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=RANDOM_SEED, stratify=y)

    print(f"Training samples: {len(X_train)}, Test samples: {len(X_test)}")
    print(f"Classes: {le.classes_}")

    model = GradientBoostingClassifier(
        n_estimators=200,
        learning_rate=0.1,
        max_depth=5,
        min_samples_split=10,
        min_samples_leaf=5,
        subsample=0.8,
        random_state=RANDOM_SEED,
    )

    print("Training Gradient Boosting model...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nTest Accuracy: {acc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    # Feature importances
    print("Feature Importances:")
    for name, imp in sorted(zip(feature_cols, model.feature_importances_), key=lambda x: -x[1]):
        print(f"  {name:20s}: {imp:.4f}")

    # Save artifacts
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, OUTPUT_MODEL)
    joblib.dump(le, OUTPUT_ENCODER)
    print(f"\nModel saved to {OUTPUT_MODEL}")
    print(f"Label encoder saved to {OUTPUT_ENCODER}")

    return model, le


if __name__ == "__main__":
    print("=" * 60)
    print("Generating synthetic dataset...")
    print("=" * 60)
    df = generate_dataset()

    # Save CSV
    os.makedirs(os.path.dirname(DATA_CSV), exist_ok=True)
    df.to_csv(DATA_CSV, index=False)
    print(f"Dataset saved to {DATA_CSV} ({len(df)} samples)")

    print("\n" + "=" * 60)
    print("Training model...")
    print("=" * 60)
    train(df)

    print("\n✅ Done! Model is ready for inference.")
