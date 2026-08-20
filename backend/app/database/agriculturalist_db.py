# ============================================================
# AGRICULTURALIST DATABASE
# backend/app/database/agriculturalist_db.py
# ============================================================

import os

from pymongo import MongoClient
from pymongo.errors import PyMongoError


# ============================================================
# MONGODB CONFIGURATION
# ============================================================

MONGODB_URI = (
    os.getenv("MONGODB_URI")
    or os.getenv("MONGO_URI")
    or os.getenv("MONGODB_URL")
)

if not MONGODB_URI:
    raise RuntimeError(
        "MongoDB connection string is missing. "
        "Please configure MONGODB_URI in your .env file."
    )


# ============================================================
# MONGODB CLIENT
# ============================================================

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
    socketTimeoutMS=30000,
)


# ============================================================
# DATABASE
# ============================================================

DATABASE_NAME = os.getenv(
    "MONGODB_DATABASE",
    "yieldsense_ai"
)

db = client[DATABASE_NAME]


# ============================================================
# COLLECTIONS
# ============================================================

agriculturalist_collection = db[
    "agriculturalists"
]

notification_collection = db[
    "agriculturalist_notifications"
]

consultation_collection = db[
    "consultations"
]

message_collection = db[
    "consultation_messages"
]


# ============================================================
# SAFE OBJECT INDEX HELPER
# ============================================================

def ensure_index_safe(
    collection,
    keys,
    name,
    unique=False,
):

    requested_keys = list(keys)

    try:

        existing_indexes = list(
            collection.list_indexes()
        )

        # ----------------------------------------------------
        # CHECK EXISTING INDEXES
        # ----------------------------------------------------

        for index in existing_indexes:

            existing_name = index.get(
                "name"
            )

            existing_keys = list(
                index.get(
                    "key",
                    {}
                ).items()
            )

            existing_unique = bool(
                index.get(
                    "unique",
                    False
                )
            )

            if (
                existing_keys == requested_keys
                and existing_unique == unique
            ):

                print(
                    f"[MongoDB] Existing compatible "
                    f"index found: {existing_name}"
                )

                return existing_name

        # ----------------------------------------------------
        # CONFLICTING INDEX
        # ----------------------------------------------------

        for index in existing_indexes:

            existing_name = index.get(
                "name"
            )

            existing_keys = list(
                index.get(
                    "key",
                    {}
                ).items()
            )

            existing_unique = bool(
                index.get(
                    "unique",
                    False
                )
            )

            if (
                existing_keys == requested_keys
                and existing_unique != unique
            ):

                if existing_name != "_id_":

                    print(
                        f"[MongoDB] Removing conflicting "
                        f"index: {existing_name}"
                    )

                    collection.drop_index(
                        existing_name
                    )

                break

        # ----------------------------------------------------
        # CREATE INDEX
        # ----------------------------------------------------

        created_name = collection.create_index(
            requested_keys,
            unique=unique,
            name=name,
        )

        print(
            f"[MongoDB] Created index: {created_name}"
        )

        return created_name

    except Exception as exc:

        print(
            f"[MongoDB] Index check failed for "
            f"{collection.name}: {exc}"
        )

        return None


# ============================================================
# ENSURE INDEXES
# ============================================================

def ensure_indexes():

    print(
        "[MongoDB] Checking agriculturalist indexes..."
    )

    # ========================================================
    # EMAIL
    # ========================================================

    ensure_index_safe(
        agriculturalist_collection,
        [
            ("email", 1)
        ],
        name="agriculturalist_email_unique",
        unique=True,
    )

    # ========================================================
    # STATUS
    # ========================================================

    ensure_index_safe(
        agriculturalist_collection,
        [
            ("status", 1)
        ],
        name="agriculturalist_status",
        unique=False,
    )

    # ========================================================
    # CREATED DATE
    # ========================================================

    ensure_index_safe(
        agriculturalist_collection,
        [
            ("created_at", -1)
        ],
        name="agriculturalist_created_at",
        unique=False,
    )

    # ========================================================
    # CONSULTATIONS
    # ========================================================

    ensure_index_safe(
        consultation_collection,
        [
            ("user_id", 1),
            ("agriculturalist_id", 1),
        ],
        name="consultation_user_agriculturalist",
        unique=False,
    )

    # ========================================================
    # CONSULTATION MESSAGES
    # ========================================================

    ensure_index_safe(
        message_collection,
        [
            ("consultation_id", 1),
            ("created_at", 1),
        ],
        name="message_consultation_created",
        unique=False,
    )

    # ========================================================
    # NOTIFICATIONS
    # ========================================================

    ensure_index_safe(
        notification_collection,
        [
            ("recipient_type", 1),
            ("recipient_id", 1),
            ("created_at", -1),
        ],
        name="notification_recipient_created",
        unique=False,
    )

    print(
        "[MongoDB] Agriculturalist indexes checked."
    )


# ============================================================
# INITIALIZE INDEXES
# ============================================================

try:

    ensure_indexes()

except PyMongoError as exc:

    print(
        "[MongoDB] Warning while initializing indexes:"
    )

    print(exc)