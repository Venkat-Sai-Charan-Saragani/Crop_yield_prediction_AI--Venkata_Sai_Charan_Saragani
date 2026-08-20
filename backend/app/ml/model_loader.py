# ============================================================
# MODEL LOADER
# backend/app/ml/model_loader.py
# ============================================================

from pathlib import Path

import joblib


# ============================================================
# PROJECT ROOT
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]


# ============================================================
# MODEL PATH
# ============================================================

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "final_yield_model.joblib"
)


# ============================================================
# LOAD MODEL
# ============================================================

if not MODEL_PATH.exists():

    raise FileNotFoundError(
        f"Final yield model not found at: {MODEL_PATH}"
    )


yield_model = joblib.load(
    MODEL_PATH
)


# ============================================================
# EXTRACT PREPROCESSOR
# ============================================================

if not hasattr(
    yield_model,
    "named_steps"
):

    raise ValueError(
        "The loaded yield model does not appear to be "
        "a scikit-learn Pipeline."
    )


if "preprocessor" not in yield_model.named_steps:

    raise ValueError(
        "The trained pipeline does not contain a "
        "'preprocessor' step."
    )


preprocessor = (
    yield_model.named_steps["preprocessor"]
)


# ============================================================
# EXTRACT FINAL MODEL / ESTIMATOR
# ============================================================

pipeline_steps = (
    yield_model.named_steps
)


step_names = list(
    pipeline_steps.keys()
)


if not step_names:

    raise ValueError(
        "The trained pipeline does not contain any steps."
    )


# The final pipeline step is the actual ML estimator.
final_estimator_name = step_names[-1]

final_estimator = (
    pipeline_steps[final_estimator_name]
)


# ============================================================
# EXTRACT ONE-HOT ENCODER
# ============================================================

if "categorical" not in preprocessor.named_transformers_:

    raise ValueError(
        "The preprocessor does not contain a "
        "'categorical' transformer."
    )


categorical_encoder = (
    preprocessor
    .named_transformers_["categorical"]
)


# ============================================================
# CATEGORIES
# ============================================================

categories = (
    categorical_encoder.categories_
)


crop_classes = (
    categories[0].tolist()
)

season_classes = (
    categories[1].tolist()
)

state_classes = (
    categories[2].tolist()
)


# ============================================================
# ORIGINAL MODEL FEATURES
# ============================================================

MODEL_FEATURES = [

    "crop",
    "season",
    "state",

    "year",
    "area",
    "fertilizer",
    "pesticide",

    "N",
    "P",
    "K",

    "pH",

    "avg_temp_c",
    "total_rainfall_mm",
    "avg_humidity_percent",

]


# ============================================================
# HUMAN-FRIENDLY FEATURE NAMES
# ============================================================

FEATURE_DISPLAY_NAMES = {

    "crop":
        "Crop",

    "season":
        "Season",

    "state":
        "State",

    "year":
        "Year",

    "area":
        "Farm Area",

    "fertilizer":
        "Fertilizer",

    "pesticide":
        "Pesticide",

    "N":
        "Nitrogen (N)",

    "P":
        "Phosphorus (P)",

    "K":
        "Potassium (K)",

    "pH":
        "Soil pH",

    "avg_temp_c":
        "Temperature",

    "total_rainfall_mm":
        "Rainfall",

    "avg_humidity_percent":
        "Humidity",

}


# ============================================================
# HUMAN-FRIENDLY UNITS
# ============================================================

FEATURE_UNITS = {

    "crop":
        "",

    "season":
        "",

    "state":
        "",

    "year":
        "",

    "area":
        "ha",

    "fertilizer":
        "kg/ha",

    "pesticide":
        "kg/ha",

    "N":
        "kg/ha",

    "P":
        "kg/ha",

    "K":
        "kg/ha",

    "pH":
        "",

    "avg_temp_c":
        "°C",

    "total_rainfall_mm":
        "mm",

    "avg_humidity_percent":
        "%",

}


# ============================================================
# DEBUG INFORMATION
# ============================================================

print(
    "\n============================================================"
)

print(
    "FINAL YIELD MODEL LOADED"
)

print(
    "============================================================"
)

print(
    f"Path: {MODEL_PATH}"
)

print(
    f"Pipeline type: "
    f"{type(yield_model).__name__}"
)

print(
    f"Final estimator: "
    f"{type(final_estimator).__name__}"
)

print(
    f"Preprocessor: "
    f"{type(preprocessor).__name__}"
)

print(
    f"Number of crops: "
    f"{len(crop_classes)}"
)

print(
    f"Number of seasons: "
    f"{len(season_classes)}"
)

print(
    f"Number of states: "
    f"{len(state_classes)}"
)

print(
    "============================================================\n"
)