from sqlalchemy import String, DateTime, Date, Boolean
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.database import Base
from src.auth.constants import GenderEnum

import uuid

from datetime import datetime, date


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    username: Mapped[str] = mapped_column(
        String, unique=True, nullable=False, index=True
    )

    full_name: Mapped[str | None] = mapped_column(String, unique=False, nullable=True)

    date_of_birth: Mapped[date] = mapped_column(Date, unique=False, nullable=True)

    gender: Mapped[GenderEnum | None] = mapped_column(
        ENUM(
            GenderEnum, name="gender_enum", create_type=False  # IMPORTANT for Supabase
        ),
        nullable=True,
    )

    profile_image_url: Mapped[str | None] = mapped_column(
        String, unique=False, nullable=True
    )

    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    last_online: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    is_email_verified: Mapped[bool] = mapped_column(
        Boolean, server_default="false", nullable=False, index=True
    )

    sent_friendships = relationship(
        "Friendship", foreign_keys="Friendship.user_id_a", back_populates="sender"
    )

    received_friendships = relationship(
        "Friendship", foreign_keys="Friendship.user_id_b", back_populates="receiver"
    )

    sent_notifications = relationship(
        "Notification", foreign_keys="Notification.sender_id", back_populates="sender"
    )
    received_notifications = relationship(
        "Notification",
        foreign_keys="Notification.receiver_id",
        back_populates="receiver",
    )
