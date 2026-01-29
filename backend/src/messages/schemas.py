from pydantic import BaseModel, ConfigDict
from datetime import datetime

from uuid import UUID

class MessageCreate(BaseModel):
    receiver_id: UUID
    content: str

class MessageRead(BaseModel):
    message_id: UUID
    sender_id: UUID
    receiver_id: UUID
    content: str
    created_at: datetime
    is_read: bool

    model_config = ConfigDict(from_attributes=True)
