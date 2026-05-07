"""Soil image analysis service. Uses a trained ResNet18 CNN for soil classification."""

import os
import json
import numpy as np
from PIL import Image

# Attempt to load PyTorch model
_soil_model = None
_class_names = ["Alluvial Soil", "Black Soil", "Cinder Soil", "Red Soil"]
_image_size = 224
_device = None

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "trained_models", "soil_classifier.pth")
META_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "trained_models", "soil_classifier_meta.json")

# ImageNet normalization constants
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]


def _load_model():
    """Load the trained PyTorch soil classifier model."""
    global _soil_model, _class_names, _image_size, _device
    try:
        import torch
        import torch.nn as nn
        from torchvision import models

        _device = torch.device("cpu")

        # Load metadata
        if os.path.exists(META_PATH):
            with open(META_PATH, "r") as f:
                meta = json.load(f)
                _class_names = meta.get("class_names", _class_names)
                _image_size = meta.get("image_size", _image_size)

        # Build the same model architecture
        model = models.resnet18(weights=None)
        num_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(num_features, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, len(_class_names)),
        )

        # Load trained weights
        checkpoint = torch.load(MODEL_PATH, map_location=_device, weights_only=False)
        model.load_state_dict(checkpoint["model_state_dict"])
        model.to(_device)
        model.eval()

        _soil_model = model
        print(f"[SoilService] Loaded soil classifier: {len(_class_names)} classes, "
              f"image size {_image_size}x{_image_size}")
    except Exception as e:
        print(f"[SoilService] Warning: Could not load soil classifier model: {e}")
        _soil_model = None


# Load model at import time
if os.path.exists(MODEL_PATH):
    _load_model()
else:
    print(f"[SoilService] No trained model found at {MODEL_PATH}. Using color-based fallback.")


def analyze_soil_image(image_path: str) -> dict:
    """Analyze a soil image and return detected soil type with confidence."""
    if _soil_model is not None:
        return _cnn_analysis(image_path)

    # Fallback: return a simple analysis based on average color
    return _color_based_analysis(image_path)


def _cnn_analysis(image_path: str) -> dict:
    """Use the trained CNN to classify soil type."""
    try:
        import torch

        # Preprocess image
        img = Image.open(image_path).convert("RGB").resize((_image_size, _image_size))
        arr = np.array(img, dtype=np.float32) / 255.0

        # Normalize with ImageNet stats
        for c in range(3):
            arr[:, :, c] = (arr[:, :, c] - MEAN[c]) / STD[c]

        # Convert to tensor: (H, W, C) -> (C, H, W) -> (1, C, H, W)
        tensor = torch.from_numpy(arr).permute(2, 0, 1).unsqueeze(0).to(_device)

        # Predict
        with torch.no_grad():
            outputs = _soil_model(tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            confidence, predicted_idx = torch.max(probabilities, 0)

        predicted_class = _class_names[predicted_idx.item()]
        confidence_pct = round(float(confidence.item()) * 100, 1)

        # Map to the soil type names used by the crop recommendation system
        soil_type_map = {
            "Alluvial Soil": "Loamy",
            "Black Soil": "Black",
            "Cinder Soil": "Sandy",
            "Red Soil": "Red",
        }
        mapped_type = soil_type_map.get(predicted_class, predicted_class)

        return {
            "detectedType": mapped_type,
            "detectedSoilClass": predicted_class,
            "confidence": confidence_pct,
        }
    except Exception as e:
        print(f"[SoilService] CNN analysis failed: {e}")
        return _color_based_analysis(image_path)


def _color_based_analysis(image_path: str) -> dict:
    """Simple heuristic soil type detection from average color."""
    try:
        img = Image.open(image_path).convert("RGB").resize((64, 64))
        arr = np.array(img, dtype=np.float32)
        avg = arr.mean(axis=(0, 1))  # [R, G, B]
        r, g, b = avg

        if r > 150 and g < 100 and b < 80:
            soil_type = "Red"
        elif r < 80 and g < 80 and b < 80:
            soil_type = "Black"
        elif r > 180 and g > 160 and b > 120:
            soil_type = "Sandy"
        elif r > 100 and g > 80 and b < 70:
            soil_type = "Clay"
        else:
            soil_type = "Loamy"

        return {"detectedType": soil_type, "confidence": 60.0}
    except Exception:
        return {"detectedType": "Unknown", "confidence": 0.0}
