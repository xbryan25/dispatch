from sqlalchemy import DateTime, ForeignKey, func, String, Boolean
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.database import Base
from src.notifications.constants import NotificationTypeEnum
import uuid

from datetime import datetime


class Notification(Base):
    __tablename__ = "notifications"

    notification_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    content: Mapped[str] = mapped_column(
        String, unique=False, nullable=False, index=False
    )

    type: Mapped[NotificationTypeEnum | None] = mapped_column(
        ENUM(
            NotificationTypeEnum,
            name="notification_type_enum",
            create_type=False,  # IMPORTANT for Supabase
        ),
        nullable=False,
    )

    is_seen_by_receiver: Mapped[bool] = mapped_column(
        Boolean, server_default="false", nullable=False, index=True
    )

    sender_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), nullable=False
    )

    receiver_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), nullable=False
    )

    sender = relationship("UserProfile", foreign_keys=[sender_id])
    receiver = relationship(
        "UserProfile",
        foreign_keys=[receiver_id],
        back_populates="received_notifications",
    )
