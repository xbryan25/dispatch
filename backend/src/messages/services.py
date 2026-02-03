from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .schemas import MessageCreate

from .models import Message, ConversationParticipant, Conversation

from uuid import UUID

import traceback


class MessagesService:
    @staticmethod
    async def create_message(
        db: AsyncSession, message_data: MessageCreate, sender_id: str
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
        db: AsyncSession, conversation_id: UUID, current_user_id: str
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
    async def get_conversation_by_id(db: AsyncSession, conversation_id: str):

        try:
            query = select(Conversation).where(
                Conversation.conversation_id == conversation_id
            )
            result = await db.execute(query)
            return result.scalar_one_or_none()
        except Exception:
            traceback.print_exc()
