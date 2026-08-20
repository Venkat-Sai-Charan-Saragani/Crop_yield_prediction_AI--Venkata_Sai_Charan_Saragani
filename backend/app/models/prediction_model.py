# ============================================================
# PREDICTION MODEL DOCUMENT
# backend/app/models/prediction_model.py
# ============================================================

from datetime import datetime


# ============================================================
# CREATE PREDICTION DOCUMENT
# ============================================================

def prediction_document(
    data,
    user_id,
    predicted_yield,
    impact_factors=None,
    recommendations=None,
):
    """
    Create the MongoDB document for a prediction.

    IMPORTANT
    ---------
    predicted_yield is stored directly as:

        tonnes / hectare

    Example:

        17.16

    means:

        17.16 tonnes/hectare

    The corresponding kg/hectare value is:

        17160 kg/hectare
    """

    # ========================================================
    # DEFAULT VALUES
    # ========================================================

    if impact_factors is None:

        impact_factors = []

    if recommendations is None:

        recommendations = []

    # ========================================================
    # NORMALIZE PREDICTED YIELD
    # ========================================================

    predicted_yield = float(
        predicted_yield
    )

    # Prevent invalid negative prediction values
    if predicted_yield < 0:

        predicted_yield = 0.0

    # ========================================================
    # CURRENT TIMESTAMP
    # ========================================================

    created_at = datetime.utcnow()

    # ========================================================
    # RETURN DOCUMENT
    # ========================================================

    return {

        # ====================================================
        # USER
        # ====================================================

        "user_id":
            str(user_id),

        # ====================================================
        # CROP & LOCATION
        # ====================================================

        "crop":
            data["crop"],

        "season":
            data["season"],

        "state":
            data["state"],

        # ====================================================
        # FARM & CROP INPUTS
        # ====================================================

        "year":
            data["year"],

        "area":
            data["area"],

        "fertilizer":
            data["fertilizer"],

        "pesticide":
            data["pesticide"],

        # ====================================================
        # SOIL NUTRIENTS
        # ====================================================

        "N":
            data["N"],

        "P":
            data["P"],

        "K":
            data["K"],

        "pH":
            data["pH"],

        # ====================================================
        # ENVIRONMENT
        # ====================================================

        "avg_temp_c":
            data["avg_temp_c"],

        "total_rainfall_mm":
            data["total_rainfall_mm"],

        "avg_humidity_percent":
            data["avg_humidity_percent"],

        # ====================================================
        # PREDICTION
        # ====================================================

        # Current canonical prediction value.
        #
        # UNIT:
        # tonnes/hectare
        #

        "predicted_yield":
            predicted_yield,

        # Explicit unit information.
        #
        # Analytics uses this field to determine whether
        # conversion is required.
        #

        "yield_unit":
            "tonnes_per_hectare",

        # ====================================================
        # KG/HECTARE CONVENIENCE VALUE
        # ====================================================

        "yield_kg_per_hectare":
            round(
                predicted_yield * 1000,
                2
            ),

        # ====================================================
        # TONNES/HECTARE CONVENIENCE VALUE
        # ====================================================

        "yield_tonnes_per_hectare":
            round(
                predicted_yield,
                4
            ),

        # ====================================================
        # MODEL IMPACT ANALYSIS
        # ====================================================

        "impact_factors":
            impact_factors,

        "explanation_method":
            "Local model sensitivity analysis",

        # ====================================================
        # PERSONALIZED RECOMMENDATIONS
        # ====================================================

        "recommendations":
            recommendations,

        # ====================================================
        # TIMESTAMP
        # ====================================================

        "created_at":
            created_at,

    }