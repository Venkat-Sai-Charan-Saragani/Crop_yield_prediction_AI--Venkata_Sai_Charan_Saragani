# ============================================================
# CONSULTATION SCHEMAS
# ============================================================

from typing import Optional

from pydantic import BaseModel


class CreateConsultationRequest(BaseModel):

    agriculturalist_id: str

    prediction_id: Optional[str] = None