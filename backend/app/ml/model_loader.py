import pickle
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = BASE_DIR  / "models"

with open(MODEL_PATH / "yield_model_v1.pkl", "rb") as file:
    yield_model = pickle.load(file)


with open(MODEL_PATH / "area_encoder.pkl", "rb") as file:
    area_encoder = pickle.load(file)


with open(MODEL_PATH / "item_encoder.pkl", "rb") as file:
    item_encoder = pickle.load(file)