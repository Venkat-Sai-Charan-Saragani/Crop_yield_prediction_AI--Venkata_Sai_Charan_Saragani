from backend.app.database.mongodb import db


# ============================================================
# CHAT COLLECTIONS
# ============================================================

conversations_collection = db["conversations"]

chat_messages_collection = db["chat_messages"]