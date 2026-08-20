from pydantic import BaseModel, Field


class SendMessageRequest(BaseModel):

    receiver_id: str

    message: str = Field(
        ...,
        min_length=1,
        max_length=2000
    )


class ChatMessageResponse(BaseModel):

    id: str

    conversation_id: str

    sender_id: str

    receiver_id: str

    message: str

    is_read: bool

    created_at: str