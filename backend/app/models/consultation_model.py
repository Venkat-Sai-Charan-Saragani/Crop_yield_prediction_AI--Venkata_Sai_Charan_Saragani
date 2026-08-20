# ============================================================
# CONSULTATION MODEL
# ============================================================

from datetime import datetime, timezone


def consultation_document(
    user_id: str,
    agriculturalist_id: str,
    prediction_id: str | None = None,
):

    now = datetime.now(
        timezone.utc
    )

    return {

        "user_id":
            user_id,

        "agriculturalist_id":
            agriculturalist_id,

        "prediction_id":
            prediction_id,

        "status":
            "open",

        "created_at":
            now,

        "updated_at":
            now,

    }