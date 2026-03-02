from sqlalchemy import DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.database import Base
from .constants import FriendshipStatusEnum
import uuid

from datetime import datetime


class Friendship(Base):
    __tablename__ = "friendships"

    sender_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), primary_key=True
    )

    receiver_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_profiles.user_id"), primary_key=True
    )

    responded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    unfriended_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    status: Mapped[FriendshipStatusEnum | None] = mapped_column(
        ENUM(
            FriendshipStatusEnum,
            name="friendship_status_enum",
            create_type=False,  # IMPORTANT for Supabase
        ),
        nullable=False,
        server_default=text("'pending'"),
    )

    sender = relationship(
        "UserProfile", foreign_keys=[sender_id], back_populates="sent_friendships"
    )

    receiver = relationship(
        "UserProfile", foreign_keys=[receiver_id], back_populates="received_friendships"
    )
