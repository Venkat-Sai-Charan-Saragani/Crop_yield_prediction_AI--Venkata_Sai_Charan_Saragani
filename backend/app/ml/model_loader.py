# ============================================================
# MODEL LOADER
# backend/app/ml/model_loader.py
# ============================================================

from pathlib import Path
from functools import lru_cache

import joblib


# ============================================================
# PROJECT / MODEL PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "final_yield_model.joblib"
)


# ============================================================
# MODEL FEATURES
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
# FEATURE DISPLAY NAMES
# ============================================================

FEATURE_DISPLAY_NAMES = {
    "crop": "Crop",
    "season": "Season",
    "state": "State",
    "year": "Year",
    "area": "Area",
    "fertilizer": "Fertilizer",
    "pesticide": "Pesticide",
    "N": "Nitrogen (N)",
    "P": "Phosphorus (P)",
    "K": "Potassium (K)",
    "pH": "Soil pH",
    "avg_temp_c": "Average Temperature",
    "total_rainfall_mm": "Total Rainfall",
    "avg_humidity_percent": "Average Humidity",
}


# ============================================================
# FEATURE UNITS
# ============================================================

FEATURE_UNITS = {
    "crop": "",
    "season": "",
    "state": "",
    "year": "",
    "area": "hectares",
    "fertilizer": "kg",
    "pesticide": "kg",
    "N": "kg/ha",
    "P": "kg/ha",
    "K": "kg/ha",
    "pH": "",
    "avg_temp_c": "°C",
    "total_rainfall_mm": "mm",
    "avg_humidity_percent": "%",
}


# ============================================================
# LAZY MODEL LOADER
# ============================================================

@lru_cache(maxsize=1)
def load_model():
    """
    Load the YieldSenseAI model only when it is required.

    The loaded model is cached so that the 447 MB model is
    loaded only once per running backend process.
    """

    print("=" * 60)
    print("Loading YieldSenseAI ML model...")
    print(f"Model path: {MODEL_PATH}")
    print("=" * 60)

    # --------------------------------------------------------
    # Check model file
    # --------------------------------------------------------

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Yield prediction model not found at: {MODEL_PATH}"
        )

    # --------------------------------------------------------
    # Load model
    # --------------------------------------------------------

    model = joblib.load(MODEL_PATH)

    # --------------------------------------------------------
    # Validate model
    # --------------------------------------------------------

    if not hasattr(model, "named_steps"):
        raise ValueError(
            "Invalid model format: expected a scikit-learn Pipeline."
        )

    if "preprocessor" not in model.named_steps:
        raise ValueError(
            "Invalid model: 'preprocessor' step not found."
        )

    # --------------------------------------------------------
    # Identify final estimator
    # --------------------------------------------------------

    final_estimator = None

    for step_name, step in model.named_steps.items():

        if step_name != "preprocessor":
            final_estimator = step

    # --------------------------------------------------------
    # Debug information
    # --------------------------------------------------------

    print("=" * 60)
    print("YieldSenseAI model loaded successfully")
    print(f"Model type: {type(model).__name__}")

    print(
        "Final estimator: "
        f"{type(final_estimator).__name__}"
        if final_estimator is not None
        else "Final estimator: Unknown"
    )

    print(
        f"Model size: "
        f"{MODEL_PATH.stat().st_size / (1024 ** 2):.2f} MB"
    )

    print(
        f"Model features: {len(MODEL_FEATURES)}"
    )

    print(
        f"Pipeline steps: "
        f"{list(model.named_steps.keys())}"
    )

    print("=" * 60)

    return model


# ============================================================
# MODEL HELPER
# ============================================================

def get_model():
    """
    Return the cached YieldSenseAI model.
    """

    return load_model()


# ============================================================
# PREPROCESSOR
# ============================================================

def get_preprocessor():
    """
    Return the preprocessor from the loaded model.
    """

    model = load_model()

    if not hasattr(model, "named_steps"):
        raise ValueError(
            "Loaded model does not contain named pipeline steps."
        )

    if "preprocessor" not in model.named_steps:
        raise ValueError(
            "Loaded model does not contain a 'preprocessor' step."
        )

    return model.named_steps["preprocessor"]


# ============================================================
# FINAL ESTIMATOR
# ============================================================

def get_final_estimator():
    """
    Return the final estimator from the loaded pipeline.
    """

    model = load_model()

    if not hasattr(model, "named_steps"):
        raise ValueError(
            "Loaded model does not contain named pipeline steps."
        )

    final_estimator = None

    for step_name, step in model.named_steps.items():

        if step_name != "preprocessor":
            final_estimator = step

    if final_estimator is None:
        raise ValueError(
            "Could not identify the final estimator."
        )

    return final_estimator


# ============================================================
# FIND ENCODER INSIDE A PIPELINE
# ============================================================

def _find_encoder_in_object(obj):
    """
    Recursively search an sklearn object for a categorical
    encoder.

    Supports:
        - OneHotEncoder
        - OrdinalEncoder
        - Pipelines
        - ColumnTransformers
        - Nested sklearn transformers
    """

    if obj is None:
        return None

    # --------------------------------------------------------
    # Direct encoder
    # --------------------------------------------------------

    class_name = type(obj).__name__.lower()

    if (
        "onehotencoder" in class_name
        or "ordinalencoder" in class_name
    ):
        return obj

    # --------------------------------------------------------
    # Pipeline / object with named_steps
    # --------------------------------------------------------

    if hasattr(obj, "named_steps"):

        for step_name, step in obj.named_steps.items():

            step_name_lower = str(
                step_name
            ).lower()

            step_class_name = type(
                step
            ).__name__.lower()

            if (
                "encoder" in step_name_lower
                or "onehotencoder" in step_class_name
                or "ordinalencoder" in step_class_name
            ):

                return step

            found = _find_encoder_in_object(
                step
            )

            if found is not None:
                return found

    # --------------------------------------------------------
    # ColumnTransformer
    # --------------------------------------------------------

    if hasattr(obj, "transformers_"):

        for (
            transformer_name,
            transformer,
            columns,
        ) in obj.transformers_:

            if transformer_name == "remainder":
                continue

            found = _find_encoder_in_object(
                transformer
            )

            if found is not None:
                return found

    return None


# ============================================================
# FIND CATEGORICAL TRANSFORMER + COLUMNS
# ============================================================

def _find_encoder_and_columns():
    """
    Find the categorical encoder and the original columns
    associated with that encoder.
    """

    preprocessor = get_preprocessor()

    # --------------------------------------------------------
    # ColumnTransformer
    # --------------------------------------------------------

    if hasattr(preprocessor, "transformers_"):

        for (
            transformer_name,
            transformer,
            columns,
        ) in preprocessor.transformers_:

            if transformer_name == "remainder":
                continue

            encoder = _find_encoder_in_object(
                transformer
            )

            if encoder is not None:

                try:
                    columns = list(columns)
                except Exception:
                    columns = []

                return (
                    encoder,
                    columns,
                )

    # --------------------------------------------------------
    # Fallback: search entire preprocessor
    # --------------------------------------------------------

    encoder = _find_encoder_in_object(
        preprocessor
    )

    if encoder is not None:
        return (
            encoder,
            [],
        )

    return (
        None,
        [],
    )


# ============================================================
# CATEGORICAL ENCODER
# ============================================================

def get_categorical_encoder():
    """
    Return the categorical encoder used by the model.
    """

    encoder, _ = _find_encoder_and_columns()

    return encoder


# ============================================================
# EXTRACT CATEGORIES
# ============================================================

def _extract_categories(feature_name):
    """
    Extract the categories used by the trained encoder for
    the requested feature.

    Example:
        crop   -> ["rice", "wheat", ...]
        season -> ["Kharif", "Rabi", ...]
        state  -> ["Andhra Pradesh", ...]
    """

    try:

        encoder, columns = (
            _find_encoder_and_columns()
        )

        if encoder is None:
            print(
                "WARNING: Categorical encoder "
                "could not be found."
            )

            return []

        if not hasattr(
            encoder,
            "categories_"
        ):
            print(
                "WARNING: Encoder does not contain "
                "'categories_'."
            )

            return []

        categories = encoder.categories_

        # ----------------------------------------------------
        # Preferred method:
        # use the actual categorical column names
        # ----------------------------------------------------

        if feature_name in columns:

            feature_index = columns.index(
                feature_name
            )

            if feature_index < len(
                categories
            ):

                return [
                    str(value)
                    for value in categories[
                        feature_index
                    ]
                ]

        # ----------------------------------------------------
        # Fallback for the known YieldSenseAI categorical
        # features.
        #
        # The trained model uses:
        # crop, season, state
        # ----------------------------------------------------

        categorical_features = [
            "crop",
            "season",
            "state",
        ]

        if feature_name in categorical_features:

            feature_index = (
                categorical_features.index(
                    feature_name
                )
            )

            if feature_index < len(
                categories
            ):

                return [
                    str(value)
                    for value in categories[
                        feature_index
                    ]
                ]

    except Exception as exc:

        print(
            f"ERROR extracting categories for "
            f"{feature_name}: {exc}"
        )

    return []


# ============================================================
# CROP CLASSES
# ============================================================

def get_crop_classes():
    """
    Return crop categories used by the trained model.
    """

    classes = _extract_categories(
        "crop"
    )

    print(
        f"Crop classes loaded: {len(classes)}"
    )

    return classes


# ============================================================
# SEASON CLASSES
# ============================================================

def get_season_classes():
    """
    Return season categories used by the trained model.
    """

    classes = _extract_categories(
        "season"
    )

    print(
        f"Season classes loaded: {len(classes)}"
    )

    return classes


# ============================================================
# STATE CLASSES
# ============================================================

def get_state_classes():
    """
    Return state categories used by the trained model.
    """

    classes = _extract_categories(
        "state"
    )

    print(
        f"State classes loaded: {len(classes)}"
    )

    return classes


# ============================================================
# BACKWARD COMPATIBILITY
# ============================================================

def __getattr__(name):
    """
    Preserve compatibility with existing backend files that
    import variables such as:

        yield_model
        crop_classes
        season_classes
        state_classes

    These values are resolved lazily.
    """

    # --------------------------------------------------------
    # Model
    # --------------------------------------------------------

    if name == "yield_model":
        return load_model()

    # --------------------------------------------------------
    # Preprocessor
    # --------------------------------------------------------

    if name == "preprocessor":
        return get_preprocessor()

    # --------------------------------------------------------
    # Final estimator
    # --------------------------------------------------------

    if name == "final_estimator":
        return get_final_estimator()

    # --------------------------------------------------------
    # Encoder
    # --------------------------------------------------------

    if name == "categorical_encoder":
        return get_categorical_encoder()

    # --------------------------------------------------------
    # Classes
    # --------------------------------------------------------

    if name == "crop_classes":
        return get_crop_classes()

    if name == "season_classes":
        return get_season_classes()

    if name == "state_classes":
        return get_state_classes()

    raise AttributeError(
        f"module {__name__!r} has no attribute {name!r}"
    )


# ============================================================
# END OF MODEL LOADER
# ============================================================