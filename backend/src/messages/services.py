from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from .schemas import MessageCreate

from .models import Message, ConversationParticipant, Conversation

from src.auth.models import UserProfile

from uuid import UUID

from typing import Optional

import traceback


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
    async def get_other_participant(
        db: AsyncSession, conversation_id: UUID, current_user_id: UUID
    ):

        try:
            query = select(ConversationParticipant.user_id).where(
                ConversationParticipant.conversation_id == conversation_id,
                ConversationParticipant.user_id != current_user_id,
            )
            result = await db.execute(query)
            return result.scalar_one_or_none()
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

        try:
            query = (
                select(Conversation)
                .join(ConversationParticipant)
                .where(ConversationParticipant.user_id == user_id)
                .options(
                    selectinload(Conversation.latest_message),
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
                latest_message = getattr(conv.latest_message, "content", None)

                formatted_conversations.append(
                    {
                        "conversation_id": conv.conversation_id,
                        "other_user_name": full_name,
                        "other_user_avatar": profile_image_url,
                        "latest_message": latest_message,
                        "latest_message_time": conv.latest_message_time,
                    }
                )

            return formatted_conversations
        except Exception:
            traceback.print_exc()
