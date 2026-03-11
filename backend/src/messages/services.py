from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from .schemas import MessageCreate
from .models import Message, ConversationParticipant, Conversation
from .queries import MessagesQueries

from src.auth.models import UserProfile

from uuid import UUID

from typing import Optional

import traceback

from datetime import datetime, timezone


class MessagesService:
    @staticmethod
    async def create_message(
        db: AsyncSession, message_data: MessageCreate, sender_id: UUID
    ):

        try:
            db_message = Message(
                **message_data.model_dump(),
                sender_id=sender_id,
            )

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
                other_person: Optional[UserProfile] = next(
                    (p.user for p in conv.participants if p.user_id != user_id), None
                )

                full_name = getattr(other_person, "full_name", "Deleted User")
                profile_image_url = getattr(
                    other_person, "profile_image_url", "Invalid URL"
                )

                latest_message_obj = max(
                    conv.messages, key=lambda m: m.created_at, default=None
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

        print()
        print(messages)
        print()

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
