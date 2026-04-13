from datetime import datetime

from uuid import UUID

from typing import Optional

from pydantic import Field

from src.messages.constants import MessageStatusEnum
from src.core import BaseSchema


class ConversationId(BaseSchema):
    conversation_id: UUID


class MessageCreate(ConversationId):
    content: str
    temp_message_id: UUID


class MessageRead(ConversationId):
    message_id: UUID
    sender_id: UUID
    username: str | None = None
    content: str
    created_at: datetime
    status: MessageStatusEnum


class PastMessagesList(BaseSchema):
    past_messages: list[MessageRead]


class ConversationSnippet(ConversationId):
    other_user_name: Optional[str] = None
    other_user_avatar: Optional[str] = None
    latest_message: Optional[str] = None
    latest_message_time: Optional[datetime] = None
    has_seen_latest_message: bool = False
    latest_message_sender_id: UUID


class ConversationList(BaseSchema):
    conversations: list[ConversationSnippet] = []


class HistoryFilter(BaseSchema):
    limit: int = Field(default=20, ge=1, le=100)
    before_datetime: datetime | None = None


class ConversationIdWithType(ConversationId):
    conversation_id_type: str


class ConversationIdWithTheme(ConversationId):
    theme: str


class ConversationTheme(BaseSchema):
    theme: str
    changed_at: datetime | None
    changed_by: str | None
