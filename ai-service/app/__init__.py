import os
from dotenv import load_dotenv

load_dotenv()

AI_SERVICE_PORT = int(os.getenv("AI_SERVICE_PORT", "8000"))
MODEL_DIR = os.getenv("MODEL_DIR", "trained_models")
