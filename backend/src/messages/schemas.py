from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime

from uuid import UUID

from src.messages.constants import MessageStatusEnum


class MessageCreate(BaseModel):
    conversation_id: UUID
    content: str


class MessageRead(BaseModel):
    message_id: UUID
    sender_id: UUID
    conversation_id: UUID
    content: str
    created_at: datetime
    status: MessageStatusEnum

    model_config = ConfigDict(from_attributes=True, alias_generator=to_camel, populate_by_name=True)
