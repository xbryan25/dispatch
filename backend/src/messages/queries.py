from sqlalchemy import select, Select, ScalarSelect, update, Update, func

from sqlalchemy.orm import joinedload

from sqlalchemy.orm import aliased

from uuid import UUID

from .models import Conversation, ConversationParticipant

from src.auth.models import UserProfile


class MessagesQueries:

    @staticmethod
    def get_direct_message_conversation_id_sub_stmt(
        current_user_id: UUID,
    ) -> ScalarSelect:
        """This sub statement retrieves the conversation_id of the direct message conversation shared between
        the current user and another user (correlated from the outer query via UserProfile)..
        """

        cp_profile = aliased(ConversationParticipant)
        cp_current = aliased(ConversationParticipant)

        stmt = (
            select(Conversation.conversation_id)
            .join(
                cp_profile,
                Conversation.conversation_id == cp_profile.conversation_id,
            )
            .join(
                cp_current,
                Conversation.conversation_id == cp_current.conversation_id,
            )
            .where(
                cp_profile.user_id == UserProfile.user_id,
                cp_current.user_id == current_user_id,
            )
            .correlate(UserProfile)
            .scalar_subquery()
        )

        return stmt

    @staticmethod
    def get_conversation_id_between_two_users(
        current_user_id: UUID, target_user_id: UUID
    ) -> Select:
        """This statements gets the conversation_id between two users, if it exists."""

        cp_target = aliased(ConversationParticipant)
        cp_current = aliased(ConversationParticipant)

        stmt = (
            select(Conversation.conversation_id)
            .join(
                cp_target,
                Conversation.conversation_id == cp_target.conversation_id,
            )
            .join(
                cp_current,
                Conversation.conversation_id == cp_current.conversation_id,
            )
            .where(
                cp_target.user_id == target_user_id,
                cp_current.user_id == current_user_id,
            )
        )

        return stmt

    @staticmethod
    def get_conversation_by_id(conversation_id: UUID) -> Select:
        """This statement gets the current theme of a conversation."""

        stmt = (
            select(Conversation)
            .where(Conversation.conversation_id == conversation_id)
            .options(joinedload(Conversation.theme_changed_by_user))
        )

        return stmt

    @staticmethod
    def update_conversation_theme_stmt(
        conversation_id: UUID, theme: str, user_id: UUID
    ) -> Update:
        """This statement updates a the theme of a conversation."""

        stmt = (
            update(Conversation)
            .where(Conversation.conversation_id == conversation_id)
            .values(theme=theme, theme_changed_by=user_id, theme_changed_at=func.now())
            .options(joinedload(Conversation.theme_changed_by_user))
        )

        return stmt
