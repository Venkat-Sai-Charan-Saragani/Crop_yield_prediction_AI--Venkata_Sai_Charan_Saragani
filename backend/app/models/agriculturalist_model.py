# ============================================================
# AGRICULTURALIST MODEL
# backend/app/models/agriculturalist_model.py
# ============================================================

from datetime import datetime, timezone


# ============================================================
# AGRICULTURALIST DOCUMENT
# ============================================================

def agriculturalist_document(
    full_name: str,
    email: str,
    hashed_password: str,
    specialization: str = "",
    government_id: str = "",
    experience_years: int = 0,
    state: str = "",
    district: str = "",
):
    """
    Creates the MongoDB document for an agriculturalist.
    """

    now = datetime.now(
        timezone.utc
    )

    return {

        # ====================================================
        # BASIC INFORMATION
        # ====================================================

        "full_name":
            full_name.strip(),

        "email":
            email.strip().lower(),

        # ====================================================
        # PASSWORD
        # ====================================================

        # IMPORTANT:
        # Store the bcrypt hash under ONE consistent field.
        # The login service reads this field.
        # ====================================================

        "hashed_password":
            hashed_password,

        # ====================================================
        # PROFILE
        # ====================================================

        "profile_image":
            None,

        "specialization":
            specialization.strip(),

        "experience_years":
            experience_years,

        "state":
            state.strip(),

        "district":
            district.strip(),

        # ====================================================
        # GOVERNMENT ID
        # ====================================================

        "government_id":
            government_id.strip(),

        # ====================================================
        # ACCOUNT STATE
        # ====================================================

        "availability":
            False,

        "status":
            "pending",

        "role":
            "agriculturalist",

        # ====================================================
        # VERIFICATION
        # ====================================================

        "issuing_authority":
            "",

        "verification_document":
            None,

        "verification_document_name":
            None,

        "verification_submitted_at":
            now,

        "reviewed_at":
            None,

        "reviewed_by":
            None,

        "rejection_reason":
            "",

        # ====================================================
        # TIMESTAMPS
        # ====================================================

        "created_at":
            now,

        "updated_at":
            now,
    }