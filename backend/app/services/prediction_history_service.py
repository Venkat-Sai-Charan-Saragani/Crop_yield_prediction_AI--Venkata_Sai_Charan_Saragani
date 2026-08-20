# ============================================================
# PREDICTION HISTORY SERVICE
# backend/app/services/prediction_history_service.py
# ============================================================

from bson import ObjectId

from backend.app.database.mongodb import (
    prediction_collections,
)


# ============================================================
# HELPER
# ============================================================

def _serialize_datetime(value):
    """
    Convert MongoDB datetime values into ISO strings.
    """

    if value is None:
        return None

    if hasattr(value, "isoformat"):
        return value.isoformat()

    return str(value)


# ============================================================
# SAFE NUMBER
# ============================================================

def _safe_float(value, default=0.0):
    """
    Safely convert a value to float.
    """

    try:
        if value is None:
            return default

        return float(value)

    except (
        TypeError,
        ValueError,
    ):
        return default


# ============================================================
# GET PREDICTION HISTORY
# ============================================================

def get_prediction_history(user_id):
    """
    Get all predictions belonging to the authenticated user.

    Features:
        - Supports string user IDs.
        - Supports older ObjectId user IDs.
        - Returns newest predictions first.
        - Returns yield in tonnes/hectare.
        - Also returns yield in kg/hectare.
        - Calculates previous same-crop prediction.
        - Calculates yield difference.
        - Calculates percentage improvement/decline.
        - Safely handles older documents.
    """

    # ========================================================
    # NORMALIZE USER ID
    # ========================================================

    user_id_string = str(
        user_id
    )

    # ========================================================
    # BUILD USER ID QUERY
    # ========================================================

    user_id_values = [
        user_id_string
    ]

    # --------------------------------------------------------
    # Support older MongoDB ObjectId values
    # --------------------------------------------------------

    try:

        object_id = ObjectId(
            user_id_string
        )

        user_id_values.append(
            object_id
        )

    except Exception:

        pass

    # ========================================================
    # QUERY DATABASE
    # ========================================================

    predictions = list(

        prediction_collections.find(

            {
                "user_id": {
                    "$in": user_id_values
                }
            }

        ).sort(

            "created_at",
            -1

        )

    )

    # ========================================================
    # BUILD NORMALIZED HISTORY
    # ========================================================

    history = []

    for prediction in predictions:

        # ====================================================
        # YIELD
        #
        # IMPORTANT:
        #
        # prediction_service.py stores predicted_yield
        # directly from predict_yield().
        #
        # Your prediction_service.py treats this value as
        # TONNES / HECTARE.
        #
        # Therefore DO NOT divide it by 1000 here.
        # ====================================================

        predicted_yield_tonnes = _safe_float(

            prediction.get(
                "predicted_yield",
                0
            )

        )

        predicted_yield_kg = (
            predicted_yield_tonnes * 1000
        )

        # ====================================================
        # CREATE HISTORY RECORD
        # ====================================================

        history.append({

            # =================================================
            # ID
            # =================================================

            "id":
                str(
                    prediction.get(
                        "_id"
                    )
                ),

            # =================================================
            # CROP
            # =================================================

            "crop":
                prediction.get(
                    "crop",
                    "Unknown"
                ),

            # =================================================
            # SEASON
            # =================================================

            "season":
                prediction.get(
                    "season",
                    ""
                ),

            # =================================================
            # STATE
            # =================================================

            "state":
                prediction.get(
                    "state",
                    ""
                ),

            # =================================================
            # AREA
            # =================================================

            "area":
                prediction.get(
                    "area",
                    0
                ),

            # =================================================
            # YEAR
            # =================================================

            "year":
                prediction.get(
                    "year",
                    "-"
                ),

            # =================================================
            # INPUT VALUES
            # =================================================

            "fertilizer":
                prediction.get(
                    "fertilizer",
                    0
                ),

            "pesticide":
                prediction.get(
                    "pesticide",
                    0
                ),

            "N":
                prediction.get(
                    "N",
                    0
                ),

            "P":
                prediction.get(
                    "P",
                    0
                ),

            "K":
                prediction.get(
                    "K",
                    0
                ),

            "pH":
                prediction.get(
                    "pH",
                    0
                ),

            # =================================================
            # ENVIRONMENT
            # =================================================

            "avg_temp_c":
                prediction.get(
                    "avg_temp_c",
                    0
                ),

            "total_rainfall_mm":
                prediction.get(
                    "total_rainfall_mm",
                    0
                ),

            "avg_humidity_percent":
                prediction.get(
                    "avg_humidity_percent",
                    0
                ),

            # =================================================
            # PREDICTION
            # =================================================

            "predicted_yield":
                predicted_yield_tonnes,

            "yield_tonnes_per_hectare":
                predicted_yield_tonnes,

            "yield_kg_per_hectare":
                predicted_yield_kg,

            # =================================================
            # EXPLANATION
            # =================================================

            "impact_factors":
                prediction.get(
                    "impact_factors",
                    []
                ),

            "explanation_method":
                prediction.get(
                    "explanation_method",
                    ""
                ),

            # =================================================
            # RECOMMENDATIONS
            # =================================================

            "recommendations":
                prediction.get(
                    "recommendations",
                    []
                ),

            # =================================================
            # DATE
            # =================================================

            "created_at":
                _serialize_datetime(
                    prediction.get(
                        "created_at"
                    )
                ),

            # =================================================
            # COMPARISON
            #
            # These are filled below.
            # =================================================

            "previous_yield_tonnes_per_hectare":
                None,

            "previous_yield_kg_per_hectare":
                None,

            "yield_difference_tonnes":
                None,

            "yield_difference_kg":
                None,

            "percentage_change":
                None,

            "trend":
                "first",

        })

    # ========================================================
    # CALCULATE SAME-CROP TRENDS
    # ========================================================
    #
    # history is newest -> oldest.
    #
    # Example:
    #
    # Arecanut 2026 -> current
    # Arecanut 2025 -> previous
    # Arecanut 2024 -> previous
    #
    # We compare every record with the next older record
    # for the SAME crop.
    # ========================================================

    for index, current in enumerate(history):

        current_crop = str(
            current.get(
                "crop",
                ""
            )
        ).strip().lower()

        if not current_crop:
            continue

        previous = None

        # ----------------------------------------------------
        # Find the next older prediction for the same crop.
        # ----------------------------------------------------

        for older_index in range(
            index + 1,
            len(history)
        ):

            candidate = history[
                older_index
            ]

            candidate_crop = str(
                candidate.get(
                    "crop",
                    ""
                )
            ).strip().lower()

            if (
                candidate_crop ==
                current_crop
            ):

                previous = candidate

                break

        # ----------------------------------------------------
        # No previous same-crop prediction
        # ----------------------------------------------------

        if previous is None:

            current["trend"] = "first"

            continue

        # ----------------------------------------------------
        # CURRENT YIELD
        # ----------------------------------------------------

        current_yield = _safe_float(
            current.get(
                "yield_tonnes_per_hectare",
                0
            )
        )

        # ----------------------------------------------------
        # PREVIOUS YIELD
        # ----------------------------------------------------

        previous_yield = _safe_float(
            previous.get(
                "yield_tonnes_per_hectare",
                0
            )
        )

        # ----------------------------------------------------
        # DIFFERENCE
        # ----------------------------------------------------

        difference_tonnes = (
            current_yield -
            previous_yield
        )

        difference_kg = (
            difference_tonnes *
            1000
        )

        # ----------------------------------------------------
        # PERCENTAGE
        # ----------------------------------------------------

        if previous_yield != 0:

            percentage_change = (

                difference_tonnes /
                previous_yield

            ) * 100

        else:

            percentage_change = 0

        # ----------------------------------------------------
        # ROUND VALUES
        # ----------------------------------------------------

        difference_tonnes = round(
            difference_tonnes,
            4
        )

        difference_kg = round(
            difference_kg,
            2
        )

        percentage_change = round(
            percentage_change,
            2
        )

        # ----------------------------------------------------
        # DETERMINE TREND
        # ----------------------------------------------------

        if difference_tonnes > 0:

            trend = "improving"

        elif difference_tonnes < 0:

            trend = "declining"

        else:

            trend = "stable"

        # ----------------------------------------------------
        # SAVE COMPARISON
        # ----------------------------------------------------

        current[
            "previous_yield_tonnes_per_hectare"
        ] = round(
            previous_yield,
            4
        )

        current[
            "previous_yield_kg_per_hectare"
        ] = round(
            previous_yield * 1000,
            2
        )

        current[
            "yield_difference_tonnes"
        ] = difference_tonnes

        current[
            "yield_difference_kg"
        ] = difference_kg

        current[
            "percentage_change"
        ] = percentage_change

        current[
            "trend"
        ] = trend

    # ========================================================
    # RETURN
    # ========================================================

    return {

        "success":
            True,

        "count":
            len(history),

        "history":
            history,

    }