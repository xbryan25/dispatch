from datetime import datetime

from uuid import UUID

from typing import Optional

from src.messages.constants import MessageStatusEnum
from src.core import BaseSchema

from pydantic import Field


class MessageCreate(BaseSchema):
    conversation_id: UUID
    content: str


class MessageRead(BaseSchema):
    message_id: UUID
    sender_id: UUID
    conversation_id: UUID
    content: str
    created_at: datetime
    status: MessageStatusEnum


class PastMessagesList(BaseSchema):
    past_messages: list[MessageRead]


class ConversationSnippet(BaseSchema):
    conversation_id: UUID
    other_user_name: Optional[str] = None
    other_user_avatar: Optional[str] = None
    latest_message: Optional[str] = None
    latest_message_time: Optional[datetime] = None


class ConversationList(BaseSchema):
    conversations: list[ConversationSnippet] = []


class HistoryFilter(BaseSchema):
    limit: int = Field(default=20, ge=1, le=100)
    before_datetime: datetime | None = None


class ConversationIdWithType(BaseSchema):
    conversation_id_type: str
    conversation_id: UUID
