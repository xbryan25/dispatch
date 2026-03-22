from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, update, or_
from sqlalchemy.orm import selectinload

from .schemas import MessageCreate
from .models import Message, ConversationParticipant, Conversation
from .queries import MessagesQueries

from src.auth.models import UserProfile
from src.friends.models import Friendship

from uuid import UUID

from typing import Optional, Any

import traceback

from datetime import datetime, timezone


class MessagesService:
    @staticmethod
    async def create_message(
        db: AsyncSession, message_data: MessageCreate, sender_id: UUID
    ):

        try:
            message_data_dict = MessageCreate.model_validate(message_data).model_dump(
                mode="python"
            )

            del message_data_dict["temp_message_id"]

            message_data_dict.update({"sender_id": sender_id})

            db_message = Message(**message_data_dict)

            db.add(db_message)
            await db.commit()
            await db.refresh(db_message)

            return db_message
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_participants_details_in_conversation(
        db: AsyncSession, conversation_id: UUID
    ):

        try:
            query = (
                select(
                    ConversationParticipant.user_id,
                    UserProfile.username,
                    UserProfile.profile_image_url,
                )
                .join(
                    UserProfile, ConversationParticipant.user_id == UserProfile.user_id
                )
                .where(
                    ConversationParticipant.conversation_id == conversation_id,
                )
            )
            result = await db.execute(query)
            return result.mappings().all()
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_other_participants_details_in_conversation(
        db: AsyncSession, conversation_id: UUID, current_user_id: UUID
    ):

        try:
            query = (
                select(
                    ConversationParticipant.user_id,
                    UserProfile.username,
                    UserProfile.profile_image_url,
                    UserProfile.last_online,
                    ConversationParticipant.last_read_message_id,
                    ConversationParticipant.last_read_message_at,
                    Friendship.status.label("friendship_status"),
                )
                .join(
                    UserProfile, ConversationParticipant.user_id == UserProfile.user_id
                )
                .join(
                    Friendship,
                    and_(
                        Friendship.user_id_a
                        == func.least(ConversationParticipant.user_id, current_user_id),
                        Friendship.user_id_b
                        == func.greatest(
                            ConversationParticipant.user_id, current_user_id
                        ),
                    ),
                    isouter=True,  # LEFT JOIN
                )
                .where(
                    ConversationParticipant.conversation_id == conversation_id,
                    ConversationParticipant.user_id != current_user_id,
                )
            )
            result = await db.execute(query)
            return result.mappings().all()
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_participant_ids_in_conversation(
        db: AsyncSession, conversation_id: UUID
    ):

        try:
            query = select(ConversationParticipant.user_id).where(
                ConversationParticipant.conversation_id == conversation_id,
            )
            result = await db.execute(query)
            return result.scalars().all()
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_conversation_by_id(db: AsyncSession, conversation_id: UUID):

        try:
            query = select(Conversation).where(
                Conversation.conversation_id == conversation_id
            )
            result = await db.execute(query)
            return result.scalar_one_or_none()
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_conversations(db: AsyncSession, user_id: UUID):

        # TODO: improve selectinload, find a better way to make it scalable

        try:
            query = (
                select(Conversation)
                .join(ConversationParticipant)
                .where(ConversationParticipant.user_id == user_id)
                .options(
                    selectinload(Conversation.messages),
                    selectinload(Conversation.participants).joinedload(
                        ConversationParticipant.user
                    ),
                )
            )

            result = await db.execute(query)

            conversations = result.scalars().all()

            formatted_conversations = []
            for conv in conversations:
                # Find the other person

                other_person_as_participant: Optional[ConversationParticipant] = next(
                    (p for p in conv.participants if p.user_id != user_id), None
                )

                if not other_person_as_participant:
                    continue

                other_person: Optional[UserProfile] = other_person_as_participant.user

                full_name = getattr(other_person, "full_name", "Deleted User")
                profile_image_url = getattr(
                    other_person, "profile_image_url", "Invalid URL"
                )

                latest_message_obj = max(
                    conv.messages, key=lambda m: m.created_at, default=None
                )
                latest_message_id = (
                    latest_message_obj.message_id if latest_message_obj else None
                )
                latest_message_sender_id = (
                    latest_message_obj.sender_id if latest_message_obj else None
                )
                latest_message = (
                    latest_message_obj.content if latest_message_obj else None
                )
                latest_message_time = (
                    latest_message_obj.created_at if latest_message_obj else None
                )

                formatted_conversations.append(
                    {
                        "conversation_id": conv.conversation_id,
                        "other_user_name": full_name,
                        "other_user_avatar": profile_image_url,
                        "latest_message": latest_message,
                        "latest_message_time": latest_message_time,
                        "has_seen_latest_message": (
                            True
                            if other_person_as_participant.last_read_message_id
                            == latest_message_id
                            else False
                        ),
                        "latest_message_sender_id": latest_message_sender_id,
                    }
                )

            if formatted_conversations:

                formatted_conversations.sort(
                    key=lambda x: x["latest_message_time"]
                    or datetime.min.replace(tzinfo=timezone.utc),
                    reverse=True,
                )

            return formatted_conversations
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_conversation_message_history(
        db: AsyncSession,
        conversation_id: UUID,
        limit: int,
        before_datetime: datetime | None,
    ):
        query = (
            select(Message, UserProfile.username)
            .join(UserProfile, UserProfile.user_id == Message.sender_id)
            .where(
                Message.conversation_id == conversation_id,
            )
        )

        if before_datetime:
            query = query.where(Message.created_at < before_datetime)

        query = query.order_by(Message.created_at.desc()).limit(limit)

        messages = (await db.execute(query)).mappings().all()

        formatted_messages = [
            {
                "message_id": row["Message"].message_id,
                "content": row["Message"].content,
                "created_at": row["Message"].created_at,
                "sender_id": row["Message"].sender_id,
                "conversation_id": row["Message"].conversation_id,
                "status": row["Message"].status,
                "username": row["username"],
            }
            for row in messages
        ]

        return formatted_messages[::-1]

    @staticmethod
    async def create_new_conversation(db: AsyncSession):
        try:
            conversation = Conversation()

            db.add(conversation)
            await db.commit()
            await db.refresh(conversation)

            return conversation.conversation_id
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def add_direct_message_participants(
        db: AsyncSession, conversation_id: UUID, user_id: UUID, target_user_id: UUID
    ):
        try:
            db.add_all(
                [
                    ConversationParticipant(
                        conversation_id=conversation_id, user_id=user_id
                    ),
                    ConversationParticipant(
                        conversation_id=conversation_id, user_id=target_user_id
                    ),
                ]
            )

            await db.commit()
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def check_if_in_existing_direct_message_conversation(
        db: AsyncSession, user_id: UUID, target_user_id: UUID
    ):
        try:
            stmt = MessagesQueries.get_conversation_id_between_two_users(
                user_id, target_user_id
            )

            conversation_id = (await db.execute(stmt)).scalar_one_or_none()

            return conversation_id

        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_conversation_theme(db: AsyncSession, conversation_id: UUID):

        stmt = MessagesQueries.get_conversation_by_id(conversation_id)

        result = await db.execute(stmt)
        conversation: Conversation | None = result.scalar_one_or_none()

        if not conversation:
            return None

        changed_by = (
            conversation.theme_changed_by_user.username
            if conversation.theme_changed_by_user
            else None
        )

        return {
            "theme": conversation.theme,
            "changed_by": changed_by,
            "changed_at": conversation.theme_changed_at,
        }

    @staticmethod
    async def update_conversation_theme(
        db: AsyncSession, conversation_id: UUID, theme: str, user_id: UUID
    ):

        stmt = MessagesQueries.update_conversation_theme_stmt(
            conversation_id, theme, user_id
        )

        await db.execute(stmt)
        await db.commit()

        return None

    @staticmethod
    async def mark_conversation_as_read(
        db: AsyncSession, conversation_id: UUID, user_id: UUID
    ) -> dict[str, Any] | None:

        latest_message_id_subquery = (
            select(Message.message_id)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(1)
            .scalar_subquery()
        )

        stmt = (
            update(ConversationParticipant)
            .where(
                ConversationParticipant.conversation_id == conversation_id,
                ConversationParticipant.user_id == user_id,
                or_(
                    ConversationParticipant.last_read_message_id.is_(
                        None
                    ),  # ← NULL case
                    ConversationParticipant.last_read_message_id
                    != latest_message_id_subquery,
                ),
            )
            .values(
                last_read_message_id=latest_message_id_subquery,
                last_read_message_at=func.now(),
            )
            .returning(
                ConversationParticipant.last_read_message_id,
                ConversationParticipant.last_read_message_at,
            )
        )

        result = await db.execute(stmt)
        await db.commit()
        row = result.fetchone()

        if row is None:
            return None

        # Get sender of the last read message
        sender_result = await db.execute(
            select(Message.sender_id).where(
                Message.message_id == row.last_read_message_id
            )
        )
        sender_id = sender_result.scalar_one_or_none()

        return {
            "last_read_message_id": row.last_read_message_id,
            "last_read_message_at": row.last_read_message_at,
            "latest_message_sender_id": sender_id,
        }
