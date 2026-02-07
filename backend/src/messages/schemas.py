from datetime import datetime

from uuid import UUID

from typing import Optional

from src.messages.constants import MessageStatusEnum
from src.core import BaseSchema


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


class ConversationSnippet(BaseSchema):
    conversation_id: UUID
    other_user_name: Optional[str] = None
    other_user_avatar: Optional[str] = None
    latest_message: Optional[str] = None
    latest_message_time: Optional[datetime] = None


class ConversationList(BaseSchema):
    conversations: list[ConversationSnippet]
