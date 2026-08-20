# ============================================================
# PREDICTION SERVICE
# backend/app/services/prediction_service.py
# ============================================================

from datetime import datetime, timezone

from backend.app.ml.predictor import (
    predict_yield,
    analyze_yield_impacts,
    generate_recommendations,
)

from backend.app.ml.model_loader import (
    crop_classes,
    season_classes,
    state_classes,
)

from backend.app.database.mongodb import (
    prediction_collections,
)

from backend.app.models.prediction_model import (
    prediction_document,
)

from backend.app.database.agriculturalist_db import (
    agriculturalist_collection,
)

from backend.app.services.notification_service import (
    create_notification,
)


# ============================================================
# GET PREDICTION OPTIONS
# ============================================================

def get_prediction_options():

    return {

        "success": True,

        "message":
            "Prediction options loaded successfully.",

        "crops":
            list(crop_classes),

        "seasons":
            list(season_classes),

        "states":
            list(state_classes),

    }


# ============================================================
# GENERATE PREDICTION
# ============================================================

def generate_prediction(
    data,
    current_user,
):

    # ========================================================
    # NORMAL MODEL PREDICTION
    # ========================================================

    predicted_yield = predict_yield(
        data
    )

    predicted_yield = float(
        predicted_yield
    )

    # ========================================================
    # MODEL IMPACT ANALYSIS
    # ========================================================

    impact_factors = (
        analyze_yield_impacts(
            data
        )
    )

    # ========================================================
    # PERSONALIZED RECOMMENDATIONS
    # ========================================================

    recommendations = (
        generate_recommendations(

            data,

            impact_factors,

        )
    )

    # ========================================================
    # CONVERT UNITS
    # ========================================================

    yield_tonnes_per_hectare = round(
        predicted_yield,
        2,
    )

    yield_kg_per_hectare = round(
        predicted_yield * 1000,
        2,
    )

    # ========================================================
    # PREPARE DATA
    # ========================================================

    prediction_data = dict(
        data
    )

    # ========================================================
    # CREATE DATABASE DOCUMENT
    # ========================================================

    document = prediction_document(

        data=prediction_data,

        user_id=str(
            current_user["_id"]
        ),

        predicted_yield=predicted_yield,

        impact_factors=impact_factors,

        recommendations=recommendations,

    )

    # ========================================================
    # TIMESTAMP
    # ========================================================

    document["created_at"] = (
        datetime.now(
            timezone.utc
        )
    )

    # ========================================================
    # SAVE PREDICTION
    # ========================================================

    prediction_result = (
        prediction_collections.insert_one(
            document
        )
    )

    prediction_id = str(
        prediction_result.inserted_id
    )

    # ========================================================
    # FIND ACTIVE AGRICULTURALISTS
    # ========================================================

    agriculturalists = list(

        agriculturalist_collection.find(

            {
                "status": "active",
                "availability": True,
            },

            {
                "_id": 1
            }

        )

    )

    # ========================================================
    # SEND NOTIFICATIONS
    # ========================================================

    notification_count = 0

    for agriculturalist in agriculturalists:

        agriculturalist_id = str(
            agriculturalist["_id"]
        )

        create_notification(

            recipient_type=
                "agriculturalist",

            recipient_id=
                agriculturalist_id,

            title=
                "New yield prediction requires review",

            message=(
                "A user has generated a new crop "
                "yield prediction. Review the prediction "
                "and provide suitable agricultural guidance."
            ),

            notification_type=
                "prediction_review",

            prediction_id=
                prediction_id,

        )

        notification_count += 1

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "success": True,

        "message":
            "Prediction generated successfully.",

        # ====================================================
        # PREDICTION
        # ====================================================

        "predicted_yield":
            predicted_yield,

        "yield_tonnes_per_hectare":
            yield_tonnes_per_hectare,

        "yield_kg_per_hectare":
            yield_kg_per_hectare,

        # ====================================================
        # MODEL EXPLANATION
        # ====================================================

        "impact_factors":
            impact_factors,

        "explanation_method":
            (
                "Local model sensitivity analysis"
            ),

        # ====================================================
        # RECOMMENDATIONS
        # ====================================================

        "recommendations":
            recommendations,

        # ====================================================
        # ID
        # ====================================================

        "prediction_id":
            prediction_id,

        # ====================================================
        # NOTIFICATIONS
        # ====================================================

        "agriculturalist_notifications":
            notification_count,

    }