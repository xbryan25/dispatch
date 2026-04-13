from sqlalchemy import String, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

import uuid

from datetime import datetime

from src.core.database import Base
from src.messages.constants import MessageStatusEnum


class Message(Base):
    __tablename__ = "messages"

    message_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    status: Mapped[MessageStatusEnum | None] = mapped_column(
        ENUM(
            MessageStatusEnum,
            name="message_status_enum",
            create_type=False,  # IMPORTANT for Supabase
        ),
        nullable=False,
        server_default=text("'delivered'"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    content: Mapped[str] = mapped_column(
        String, unique=False, nullable=False, index=False
    )

    sender_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), nullable=False
    )

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("conversations.conversation_id"), nullable=False
    )

    sender = relationship("UserProfile", foreign_keys=[sender_id])
    conversation = relationship("Conversation", back_populates="messages")


class Conversation(Base):
    __tablename__ = "conversations"

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    conversation_name: Mapped[str | None] = mapped_column(
        String, unique=False, nullable=True
    )

    theme: Mapped[str] = mapped_column(String, unique=False)

    theme_changed_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), nullable=True
    )

    theme_changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    messages = relationship(
        "Message", back_populates="conversation", cascade="all, delete-orphan"
    )

    latest_message = relationship(
        "Message",
        primaryjoin="and_(Conversation.conversation_id == Message.conversation_id)",
        order_by="desc(Message.created_at)",
        uselist=False,
        viewonly=True,
    )

    @property
    def latest_message_time(self):
        return self.latest_message.created_at if self.latest_message else None

    theme_changed_by_user = relationship("UserProfile")
    participants = relationship(
        "ConversationParticipant", back_populates="conversation"
    )


class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), primary_key=True
    )

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("conversations.conversation_id"),
        primary_key=True,
    )

    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    last_read_message_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))

    last_read_message_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    user = relationship("UserProfile")
    conversation = relationship("Conversation", back_populates="participants")
