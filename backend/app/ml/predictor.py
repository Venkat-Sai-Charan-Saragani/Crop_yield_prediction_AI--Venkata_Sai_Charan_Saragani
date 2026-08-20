# ============================================================
# YIELD PREDICTOR
# backend/app/ml/predictor.py
# ============================================================

import copy

import numpy as np
import pandas as pd

from backend.app.ml.model_loader import (
    yield_model,
    MODEL_FEATURES,
    FEATURE_DISPLAY_NAMES,
    FEATURE_UNITS,
)


# ============================================================
# FEATURES USED FOR MODEL IMPACT ANALYSIS
# ============================================================

IMPACT_FEATURES = [

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
# PERTURBATION SETTINGS
# ============================================================

PERTURBATION_PERCENT = {

    "year": 1.0,

    "area": 10.0,

    "fertilizer": 10.0,

    "pesticide": 10.0,

    "N": 10.0,

    "P": 10.0,

    "K": 10.0,

    "pH": 0.5,

    "avg_temp_c": 2.0,

    "total_rainfall_mm": 10.0,

    "avg_humidity_percent": 10.0,

}


# ============================================================
# CREATE INPUT DATAFRAME
# ============================================================

def _create_input_dataframe(data):

    input_data = pd.DataFrame(
        [[

            data["crop"],
            data["season"],
            data["state"],

            data["year"],
            data["area"],
            data["fertilizer"],
            data["pesticide"],

            data["N"],
            data["P"],
            data["K"],

            data["pH"],

            data["avg_temp_c"],
            data["total_rainfall_mm"],
            data["avg_humidity_percent"],

        ]],
        columns=MODEL_FEATURES,
    )

    return input_data


# ============================================================
# RAW MODEL PREDICTION
# ============================================================

def _predict_from_dataframe(input_data):

    log_prediction = (
        yield_model.predict(
            input_data
        )[0]
    )

    if not np.isfinite(
        log_prediction
    ):

        raise ValueError(
            "Model returned an invalid prediction."
        )

    predicted_yield = np.expm1(
        log_prediction
    )

    if not np.isfinite(
        predicted_yield
    ):

        raise ValueError(
            "Converted prediction is invalid."
        )

    if predicted_yield < 0:

        raise ValueError(
            "Model returned a negative yield."
        )

    return float(
        predicted_yield
    )


# ============================================================
# NORMAL PREDICTION
# ============================================================

def predict_yield(data):

    input_data = (
        _create_input_dataframe(
            data
        )
    )

    return _predict_from_dataframe(
        input_data
    )


# ============================================================
# MODIFY ONE FEATURE
# ============================================================

def _create_modified_data(
    data,
    feature,
    direction,
):

    modified_data = copy.deepcopy(
        data
    )

    original_value = float(
        data[feature]
    )

    # ========================================================
    # YEAR
    # ========================================================

    if feature == "year":

        change = (
            PERTURBATION_PERCENT[
                feature
            ]
        )

        modified_value = (
            original_value
            +
            (
                direction
                * change
            )
        )

    # ========================================================
    # PH
    # ========================================================

    elif feature == "pH":

        change = (
            PERTURBATION_PERCENT[
                feature
            ]
        )

        modified_value = (
            original_value
            +
            (
                direction
                * change
            )
        )

    # ========================================================
    # TEMPERATURE
    # ========================================================

    elif feature == "avg_temp_c":

        change = (
            PERTURBATION_PERCENT[
                feature
            ]
        )

        modified_value = (
            original_value
            +
            (
                direction
                * change
            )
        )

    # ========================================================
    # OTHER NUMERIC FEATURES
    # ========================================================

    else:

        percentage = (
            PERTURBATION_PERCENT[
                feature
            ]
        )

        change = (
            abs(original_value)
            * percentage
            / 100.0
        )

        if change == 0:

            change = (
                percentage
                / 100.0
            )

        modified_value = (
            original_value
            +
            (
                direction
                * change
            )
        )

    # ========================================================
    # PREVENT NEGATIVE VALUES
    # ========================================================

    if feature not in [
        "year",
        "pH",
    ]:

        modified_value = max(
            0.0,
            modified_value,
        )

    if feature == "pH":

        modified_value = max(
            0.0,
            modified_value,
        )

    modified_data[feature] = (
        modified_value
    )

    return modified_data


# ============================================================
# MODEL IMPACT ANALYSIS
# ============================================================

def analyze_yield_impacts(data):

    baseline_prediction = (
        predict_yield(
            data
        )
    )

    impact_results = []

    # ========================================================
    # TEST EACH NUMERIC FEATURE
    # ========================================================

    for feature in IMPACT_FEATURES:

        try:

            original_value = float(
                data[feature]
            )

            # ------------------------------------------------
            # INCREASE FEATURE
            # ------------------------------------------------

            increased_data = (
                _create_modified_data(
                    data,
                    feature,
                    +1,
                )
            )

            increased_prediction = (
                predict_yield(
                    increased_data
                )
            )

            # ------------------------------------------------
            # DECREASE FEATURE
            # ------------------------------------------------

            decreased_data = (
                _create_modified_data(
                    data,
                    feature,
                    -1,
                )
            )

            decreased_prediction = (
                predict_yield(
                    decreased_data
                )
            )

            # ------------------------------------------------
            # CHANGES
            # ------------------------------------------------

            increase_change = (
                increased_prediction
                -
                baseline_prediction
            )

            decrease_change = (
                decreased_prediction
                -
                baseline_prediction
            )

            # ------------------------------------------------
            # ABSOLUTE IMPACT
            # ------------------------------------------------

            absolute_impact = (
                abs(increase_change)
                +
                abs(decrease_change)
            ) / 2.0

            # ------------------------------------------------
            # DOMINANT DIRECTION
            # ------------------------------------------------

            if (
                abs(increase_change)
                >=
                abs(decrease_change)
            ):

                dominant_change = (
                    increase_change
                )

            else:

                dominant_change = (
                    -decrease_change
                )

            if dominant_change > 0:

                direction = "positive"

            elif dominant_change < 0:

                direction = "negative"

            else:

                direction = "neutral"

            # ------------------------------------------------
            # DISPLAY VALUE
            # ------------------------------------------------

            if feature == "year":

                display_value = int(
                    round(
                        original_value
                    )
                )

            else:

                display_value = round(
                    original_value,
                    2,
                )

            impact_results.append({

                "feature":
                    feature,

                "name":
                    FEATURE_DISPLAY_NAMES.get(
                        feature,
                        feature,
                    ),

                "value":
                    display_value,

                "unit":
                    FEATURE_UNITS.get(
                        feature,
                        "",
                    ),

                "impact":
                    round(
                        dominant_change,
                        4,
                    ),

                "absolute_impact":
                    round(
                        absolute_impact,
                        4,
                    ),

                "direction":
                    direction,

                "importance":
                    "low",

                "impact_percentage":
                    0.0,

            })

        except Exception as exc:

            print(
                f"[Impact Analysis] "
                f"{feature}: {exc}"
            )

    # ========================================================
    # SORT
    # ========================================================

    impact_results.sort(
        key=lambda item:
            item["absolute_impact"],
        reverse=True,
    )

    # ========================================================
    # TOTAL IMPACT
    # ========================================================

    total_impact = sum(

        item[
            "absolute_impact"
        ]

        for item in impact_results

    )

    # ========================================================
    # PERCENTAGE
    # ========================================================

    if total_impact > 0:

        for item in impact_results:

            item[
                "impact_percentage"
            ] = round(

                (
                    item[
                        "absolute_impact"
                    ]
                    /
                    total_impact
                )
                * 100.0,

                1,
            )

    # ========================================================
    # IMPORTANCE
    # ========================================================

    max_impact = 0.0

    if impact_results:

        max_impact = max(

            item[
                "absolute_impact"
            ]

            for item in impact_results

        )

    if max_impact > 0:

        for item in impact_results:

            relative_strength = (

                item[
                    "absolute_impact"
                ]
                /
                max_impact

            )

            if relative_strength >= 0.60:

                item[
                    "importance"
                ] = "high"

            elif relative_strength >= 0.25:

                item[
                    "importance"
                ] = "medium"

            else:

                item[
                    "importance"
                ] = "low"

    return impact_results


# ============================================================
# PERSONALIZED RECOMMENDATIONS
# ============================================================

def generate_recommendations(
    data,
    impact_factors,
):
    """
    Generate decision-support recommendations from the user's
    actual input values.

    IMPORTANT:
    These are guidance recommendations, not prescriptions.

    We deliberately avoid telling the user to apply an exact
    quantity of fertilizer or pesticide because that would
    require crop stage, soil test, product/formulation and
    pest-specific information.
    """

    recommendations = []

    crop = str(
        data.get(
            "crop",
            "selected crop",
        )
    )

    # ========================================================
    # HELPER
    # ========================================================

    def add_recommendation(
        category,
        priority,
        title,
        message,
    ):

        recommendations.append({

            "category":
                category,

            "priority":
                priority,

            "title":
                title,

            "message":
                message,

        })

    # ========================================================
    # GET IMPACT LOOKUP
    # ========================================================

    impact_lookup = {

        item["feature"]:
            item

        for item in impact_factors

    }

    # ========================================================
    # SOIL PH
    # ========================================================

    ph = float(
        data["pH"]
    )

    ph_impact = impact_lookup.get(
        "pH"
    )

    if ph < 5.5:

        priority = "high"

        add_recommendation(

            "soil",

            priority,

            "Review soil pH",

            (
                f"The entered soil pH is "
                f"{ph:.2f}, which is strongly acidic. "
                f"For {crop}, consider soil testing and "
                f"crop-specific soil management guidance "
                f"before making amendments."
            ),

        )

    elif ph > 8.0:

        priority = "high"

        add_recommendation(

            "soil",

            priority,

            "Review soil pH",

            (
                f"The entered soil pH is "
                f"{ph:.2f}, which is strongly alkaline. "
                f"Use soil-test results and crop-specific "
                f"guidance when managing soil pH."
            ),

        )

    elif (
        ph_impact
        and
        ph_impact["importance"]
        == "high"
    ):

        add_recommendation(

            "soil",

            "medium",

            "Monitor soil pH",

            (
                f"The entered soil pH is "
                f"{ph:.2f} and soil pH has a strong "
                f"influence on this model prediction. "
                f"Continue regular soil testing and "
                f"maintain conditions appropriate for "
                f"{crop}."
            ),

        )

    else:

        add_recommendation(

            "soil",

            "low",

            "Continue monitoring soil pH",

            (
                f"The entered soil pH is "
                f"{ph:.2f}. Continue regular soil "
                f"testing and maintain nutrient "
                f"management according to the selected "
                f"crop's requirements."
            ),

        )

    # ========================================================
    # NITROGEN
    # ========================================================

    nitrogen = float(
        data["N"]
    )

    nitrogen_impact = (
        impact_lookup.get(
            "N"
        )
    )

    if (
        nitrogen_impact
        and
        nitrogen_impact["importance"]
        == "high"
    ):

        add_recommendation(

            "nutrients",

            "medium",

            "Monitor nitrogen management",

            (
                f"The entered nitrogen level is "
                f"{nitrogen:.2f} kg/ha and nitrogen has "
                f"a strong influence on this prediction. "
                f"Use soil-test information and crop-specific "
                f"recommendations when managing nitrogen."
            ),

        )

    else:

        add_recommendation(

            "nutrients",

            "low",

            "Maintain balanced nitrogen management",

            (
                f"The entered nitrogen level is "
                f"{nitrogen:.2f} kg/ha. Continue monitoring "
                f"nitrogen availability through soil testing "
                f"and avoid applying more fertilizer than "
                f"the crop requires."
            ),

        )

    # ========================================================
    # PHOSPHORUS
    # ========================================================

    phosphorus = float(
        data["P"]
    )

    phosphorus_impact = (
        impact_lookup.get(
            "P"
        )
    )

    if (
        phosphorus_impact
        and
        phosphorus_impact["importance"]
        == "high"
    ):

        add_recommendation(

            "nutrients",

            "medium",

            "Monitor phosphorus management",

            (
                f"The entered phosphorus level is "
                f"{phosphorus:.2f} kg/ha and phosphorus "
                f"has a strong influence on this prediction. "
                f"Use soil-test results and crop-specific "
                f"recommendations for nutrient management."
            ),

        )

    else:

        add_recommendation(

            "nutrients",

            "low",

            "Maintain balanced phosphorus management",

            (
                f"The entered phosphorus level is "
                f"{phosphorus:.2f} kg/ha. Maintain balanced "
                f"nutrient management using soil-test results "
                f"and crop-specific guidance."
            ),

        )

    # ========================================================
    # POTASSIUM
    # ========================================================

    potassium = float(
        data["K"]
    )

    potassium_impact = (
        impact_lookup.get(
            "K"
        )
    )

    if (
        potassium_impact
        and
        potassium_impact["importance"]
        == "high"
    ):

        add_recommendation(

            "nutrients",

            "medium",

            "Monitor potassium management",

            (
                f"The entered potassium level is "
                f"{potassium:.2f} kg/ha and potassium "
                f"has a strong influence on this prediction. "
                f"Use soil-test results and crop-specific "
                f"recommendations when managing nutrients."
            ),

        )

    else:

        add_recommendation(

            "nutrients",

            "low",

            "Maintain balanced potassium management",

            (
                f"The entered potassium level is "
                f"{potassium:.2f} kg/ha. Continue monitoring "
                f"soil nutrient availability and maintain "
                f"balanced nutrient management."
            ),

        )

    # ========================================================
    # TEMPERATURE
    # ========================================================

    temperature = float(
        data["avg_temp_c"]
    )

    temperature_impact = (
        impact_lookup.get(
            "avg_temp_c"
        )
    )

    if (
        temperature_impact
        and
        temperature_impact["importance"]
        == "high"
    ):

        priority = "medium"

    else:

        priority = "low"

    add_recommendation(

        "environment",

        priority,

        "Monitor temperature",

        (
            f"The entered average temperature is "
            f"{temperature:.1f}°C. Temperature has "
            f"{'a strong' if priority == 'medium' else 'a lower'} "
            f"influence on this prediction. Continue monitoring "
            f"temperature changes during important crop "
            f"growth stages."
        ),

    )

    # ========================================================
    # RAINFALL
    # ========================================================

    rainfall = float(
        data["total_rainfall_mm"]
    )

    rainfall_impact = (
        impact_lookup.get(
            "total_rainfall_mm"
        )
    )

    if rainfall > 2500:

        priority = "medium"

        title = (
            "Monitor rainfall and drainage"
        )

        message = (

            f"The entered rainfall is "
            f"{rainfall:.1f} mm. Monitor soil moisture, "
            f"field drainage and rainfall variation "
            f"throughout the growing season."

        )

    elif rainfall < 500:

        priority = "medium"

        title = (
            "Monitor water availability"
        )

        message = (

            f"The entered rainfall is "
            f"{rainfall:.1f} mm. Monitor soil moisture "
            f"and water availability during crop growth, "
            f"especially during periods of low rainfall."

        )

    else:

        priority = "low"

        title = (
            "Monitor water availability"
        )

        message = (

            f"The entered rainfall is "
            f"{rainfall:.1f} mm. Continue monitoring "
            f"soil moisture and rainfall variation "
            f"throughout the growing season."

        )

    add_recommendation(

        "water",

        priority,

        title,

        message,

    )

    # ========================================================
    # HUMIDITY
    # ========================================================

    humidity = float(
        data["avg_humidity_percent"]
    )

    humidity_impact = (
        impact_lookup.get(
            "avg_humidity_percent"
        )
    )

    if humidity >= 80:

        priority = "high"

        add_recommendation(

            "environment",

            priority,

            "Monitor humidity and moisture",

            (
                f"The entered average humidity is "
                f"{humidity:.1f}%. High humidity can increase "
                f"moisture-related crop risks. Monitor field "
                f"moisture, drainage and crop conditions "
                f"regularly."
            ),

        )

    elif humidity <= 35:

        add_recommendation(

            "environment",

            "medium",

            "Monitor moisture availability",

            (
                f"The entered average humidity is "
                f"{humidity:.1f}%. Monitor soil moisture "
                f"and crop water requirements during "
                f"dry conditions."
            ),

        )

    elif (
        humidity_impact
        and
        humidity_impact["importance"]
        == "high"
    ):

        add_recommendation(

            "environment",

            "medium",

            "Monitor humidity",

            (
                f"The entered humidity is "
                f"{humidity:.1f}% and humidity has a strong "
                f"influence on this model prediction. "
                f"Continue monitoring moisture and crop "
                f"conditions."
            ),

        )

    else:

        add_recommendation(

            "environment",

            "low",

            "Continue monitoring humidity",

            (
                f"The entered average humidity is "
                f"{humidity:.1f}%. Continue monitoring "
                f"humidity and soil moisture throughout "
                f"the growing season."
            ),

        )

    # ========================================================
    # FERTILIZER
    # ========================================================

    fertilizer = float(
        data["fertilizer"]
    )

    fertilizer_impact = (
        impact_lookup.get(
            "fertilizer"
        )
    )

    if (
        fertilizer_impact
        and
        fertilizer_impact["importance"]
        == "high"
    ):

        priority = "medium"

    else:

        priority = "low"

    add_recommendation(

        "fertilizer",

        priority,

        "Maintain balanced fertilizer management",

        (
            f"The entered fertilizer usage is "
            f"{fertilizer:.2f} kg/ha. Use soil-test "
            f"information and crop-specific recommendations "
            f"to maintain balanced nutrient application "
            f"and avoid unnecessary fertilizer use."
        ),

    )

    # ========================================================
    # PESTICIDE
    # ========================================================

    pesticide = float(
        data["pesticide"]
    )

    pesticide_impact = (
        impact_lookup.get(
            "pesticide"
        )
    )

    if (
        pesticide_impact
        and
        pesticide_impact["importance"]
        == "high"
    ):

        priority = "medium"

    else:

        priority = "low"

    add_recommendation(

        "crop protection",

        priority,

        "Use pesticides carefully",

        (
            f"The entered pesticide usage is "
            f"{pesticide:.2f} kg/ha. Follow the crop- and "
            f"product-specific label, recommended dosage and "
            f"applicable agricultural guidance. Avoid "
            f"unnecessary applications."
        ),

    )

    # ========================================================
    # LIMIT NUMBER OF RECOMMENDATIONS
    # ========================================================
    #
    # The report should remain readable.
    #
    # ========================================================

    priority_order = {

        "high": 0,
        "medium": 1,
        "low": 2,

    }

    recommendations.sort(

        key=lambda item:
            priority_order.get(
                item["priority"],
                2,
            )

    )

    return recommendations