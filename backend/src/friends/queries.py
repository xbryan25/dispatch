from sqlalchemy import (
    literal_column,
    select,
    or_,
    func,
    Select,
    ScalarSelect,
    exists,
    Exists,
    and_,
    delete,
    Delete,
    update,
    Update,
)

from sqlalchemy.orm import aliased

from sqlalchemy.dialects.postgresql import insert, Insert

from .models import Friendship
from .constants import FriendshipStatusEnum

from src.auth.models import UserProfile
from src.messages.models import Conversation, ConversationParticipant

from uuid import UUID


class FriendsQueries:

    @staticmethod
    def get_total_friends_sub_stmt() -> ScalarSelect:
        """This sub statement links to an outer UserProfile query to count all rows where that specific user is either user_id_a or user_id_b with an accepted status."""

        stmt = (
            select(func.count())
            .where(
                or_(
                    Friendship.user_id_a == UserProfile.user_id,
                    Friendship.user_id_b == UserProfile.user_id,
                ),
                Friendship.status == FriendshipStatusEnum.accepted,
            )
            .correlate(UserProfile)
            .scalar_subquery()
        )

        return stmt

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
    def check_if_connection_exists_for_user_sub_stmt(current_user_id: UUID) -> Exists:
        """This sub statement receives user_id so it can check if a row exists connecting the current user specifically to whichever UserProfile the database is currently scanning in the suggestions list."""

        stmt = exists().where(
            or_(
                Friendship.user_id_a == UserProfile.user_id,
                Friendship.user_id_b == UserProfile.user_id,
            ),
            or_(
                Friendship.user_id_a == current_user_id,
                Friendship.user_id_b == current_user_id,
            ),
        )

        return stmt

    @staticmethod
    def check_if_connection_exists_between_two_users_stmt(
        current_user_id: UUID, target_user_id: UUID
    ) -> Select:
        """This statement checks whether there has already been a record between two users in the database."""

        stmt = select(Friendship).where(
            or_(
                and_(
                    Friendship.user_id_a == current_user_id,
                    Friendship.user_id_b == target_user_id,
                ),
                and_(
                    Friendship.user_id_a == target_user_id,
                    Friendship.user_id_b == current_user_id,
                ),
            )
        )

        return stmt

    @staticmethod
    def get_current_friends_stmt(
        current_user_id: UUID, sort_state: str, search_query: str
    ) -> Select:
        """This statement retrieves the current friends of the current user."""

        sub_stmt_a = FriendsQueries.get_total_friends_sub_stmt()
        sub_stmt_b = FriendsQueries.get_direct_message_conversation_id_sub_stmt(
            current_user_id
        )

        stmt = (
            select(
                UserProfile,
                sub_stmt_a.label("total_friend_count"),
                sub_stmt_b.label("conversation_id"),
            )
            .join(
                Friendship,
                or_(
                    Friendship.user_id_a == UserProfile.user_id,
                    Friendship.user_id_b == UserProfile.user_id,
                ),
            )
            .where(
                or_(
                    Friendship.user_id_a == current_user_id,
                    Friendship.user_id_b == current_user_id,
                )
            )
            .where(
                UserProfile.user_id != current_user_id,
                Friendship.status == FriendshipStatusEnum.accepted,
            )
            .order_by(
                (
                    UserProfile.username.asc()
                    if sort_state == "ascending"
                    else UserProfile.username.desc()
                )
            )
        )

        if search_query.strip():
            stmt = stmt.filter(
                func.lower(UserProfile.username).contains(search_query.lower())
            )

        return stmt

    @staticmethod
    def get_sent_requests_profiles_stmt(
        current_user_id: UUID, sort_state: str, search_query: str
    ) -> Select:
        """This statement retrieves the profiles of the users that the current user sent a friend request to."""

        sub_stmt = FriendsQueries.get_total_friends_sub_stmt()

        stmt = (
            select(UserProfile, sub_stmt.label("total_friend_count"))
            .join(
                Friendship,
                or_(
                    Friendship.user_id_a == UserProfile.user_id,
                    Friendship.user_id_b == UserProfile.user_id,
                ),
            )
            .where(
                or_(
                    Friendship.user_id_a == current_user_id,
                    Friendship.user_id_b == current_user_id,
                ),
                UserProfile.user_id != current_user_id,
                Friendship.status == FriendshipStatusEnum.pending,
                Friendship.action_by == current_user_id,
            )
            .order_by(
                (
                    UserProfile.username.asc()
                    if sort_state == "ascending"
                    else UserProfile.username.desc()
                )
            )
        )

        if search_query.strip():
            stmt = stmt.filter(
                func.lower(UserProfile.username).contains(search_query.lower())
            )

        return stmt

    @staticmethod
    def get_received_requests_profiles_stmt(
        current_user_id: UUID, sort_state: str, search_query: str
    ) -> Select:
        """This statement retrieves the profiles of the users sent a friend request to the current user."""

        sub_stmt = FriendsQueries.get_total_friends_sub_stmt()

        stmt = (
            select(UserProfile, sub_stmt.label("total_friend_count"))
            .join(
                Friendship,
                or_(
                    Friendship.user_id_a == UserProfile.user_id,
                    Friendship.user_id_b == UserProfile.user_id,
                ),
            )
            .where(
                or_(
                    Friendship.user_id_a == current_user_id,
                    Friendship.user_id_b == current_user_id,
                ),
                UserProfile.user_id != current_user_id,
                Friendship.status == FriendshipStatusEnum.pending,
                Friendship.action_by != current_user_id,
            )
            .order_by(
                UserProfile.username.asc()
                if sort_state == "ascending"
                else UserProfile.username.desc()
            )
        )

        if search_query.strip():
            stmt = stmt.filter(
                func.lower(UserProfile.username).contains(search_query.lower())
            )

        return stmt

    @staticmethod
    def get_former_friends_stmt(
        current_user_id: UUID, sort_state: str, search_query: str
    ) -> Select:
        """This statement retrieves the profiles of the users that were former friends of the current user."""

        sub_stmt = FriendsQueries.get_total_friends_sub_stmt()

        stmt = (
            select(UserProfile, sub_stmt.label("total_friend_count"))
            .join(
                Friendship,
                or_(
                    Friendship.user_id_a == UserProfile.user_id,
                    Friendship.user_id_b == UserProfile.user_id,
                ),
            )
            .where(
                or_(
                    Friendship.user_id_a == current_user_id,
                    Friendship.user_id_b == current_user_id,
                ),
                UserProfile.user_id != current_user_id,
                Friendship.status == FriendshipStatusEnum.unfriended,
            )
            .order_by(
                (
                    UserProfile.username.asc()
                    if sort_state == "ascending"
                    else UserProfile.username.desc()
                )
            )
        )

        if search_query.strip():
            stmt = stmt.filter(
                func.lower(UserProfile.username).contains(search_query.lower())
            )

        return stmt

    @staticmethod
    def get_friend_suggestions_stmt(
        current_user_id: UUID, sort_state: str, search_query: str
    ) -> Select:
        """This statement retrieves the profiles of the users that have no connections to the current user yet"""

        sub_stmt = FriendsQueries.get_total_friends_sub_stmt()
        connection_exists_stmt = (
            FriendsQueries.check_if_connection_exists_for_user_sub_stmt(current_user_id)
        )

        stmt = (
            select(UserProfile, sub_stmt.label("total_friend_count"))
            .where(UserProfile.user_id != current_user_id)
            .where(~connection_exists_stmt)
            .order_by(
                (
                    UserProfile.username.asc()
                    if sort_state == "ascending"
                    else UserProfile.username.desc()
                )
            )
        )

        if search_query.strip():
            stmt = stmt.filter(
                func.lower(UserProfile.username).contains(search_query.lower())
            )

        return stmt

    @staticmethod
    def delete_pending_friendship_stmt(
        current_user_id: UUID, target_user_id: UUID, mode: str
    ) -> Delete:
        """This statement removes a pending friend request. Used by both 'cancel request' and 'reject request'."""

        id_a, id_b = (
            (current_user_id, target_user_id)
            if current_user_id < target_user_id
            else (current_user_id, target_user_id)
        )

        security_rule = (
            Friendship.action_by == current_user_id
            if mode == "cancel"
            else Friendship.action_by != current_user_id
        )

        stmt = delete(Friendship).where(
            Friendship.user_id_a == id_a,
            Friendship.user_id_b == id_b,
            Friendship.status == FriendshipStatusEnum.pending,
            security_rule,
        )

        return stmt

    @staticmethod
    def accept_friend_request_stmt(
        current_user_id: UUID, target_user_id: UUID
    ) -> Update:
        """This statement updates a friend request and turns the status to 'accepted'."""

        id_a, id_b = (
            (current_user_id, target_user_id)
            if current_user_id < target_user_id
            else (current_user_id, target_user_id)
        )

        stmt = (
            update(Friendship)
            .where(
                Friendship.user_id_a == id_a,
                Friendship.user_id_b == id_b,
                Friendship.status == FriendshipStatusEnum.pending,
                Friendship.action_by != current_user_id,
            )
            .values(status=FriendshipStatusEnum.accepted, responded_at=func.now())
        )

        return stmt

    @staticmethod
    def unfriend_user_stmt(current_user_id: UUID, target_user_id: UUID) -> Update:
        """This statement updates a friend request and turns the status to 'unfriended'."""

        id_a, id_b = (
            (current_user_id, target_user_id)
            if current_user_id < target_user_id
            else (current_user_id, target_user_id)
        )

        stmt = (
            update(Friendship)
            .where(
                Friendship.user_id_a == id_a,
                Friendship.user_id_b == id_b,
                Friendship.status == FriendshipStatusEnum.accepted,
            )
            .values(status=FriendshipStatusEnum.unfriended, unfriended_at=func.now())
        )

        return stmt

    @staticmethod
    def send_or_restart_request_stmt(
        current_user_id: UUID, target_user_id: UUID
    ) -> Insert:
        """This statement performs an atomic upsert that either creates a new pending request or resets an existing friendship record."""

        # Insert is used instead of update to avoid race condition in db

        id_a, id_b = (
            (current_user_id, target_user_id)
            if current_user_id < target_user_id
            else (target_user_id, current_user_id)
        )

        stmt = insert(Friendship).values(
            user_id_a=id_a,
            user_id_b=id_b,
            action_by=current_user_id,
            status="pending",
            created_at=func.now(),
            responded_at=None,
            unfriended_at=None,
        )

        stmt = stmt.on_conflict_do_update(
            index_elements=["user_id_a", "user_id_b"],
            set_={
                "status": stmt.excluded.status,
                "action_by": stmt.excluded.action_by,
                "created_at": stmt.excluded.created_at,
                "responded_at": None,
                "unfriended_at": None,
            },
            where=(Friendship.status != "accepted"),
        )

        return stmt

    @staticmethod
    def get_total_count_of_users(stmt: Select):
        """
        Wraps a SQLAlchemy Select statement to return a count of total records.

        Optimizes performance by stripping expensive correlated subqueries,
        extra columns, and ordering, replacing them with a constant '1'
        to trigger an index-only scan where possible.
        """

        optimized_stmt = stmt.with_only_columns(literal_column("1")).order_by(None)
        inner_query = optimized_stmt.subquery()

        return select(func.count()).select_from(inner_query)

    @staticmethod
    def add_pagination_details_in_select_stmts(stmt: Select, page: int, limit: int):
        """
        Adds limit and offset to Select statements.
        """

        return stmt.limit(limit).offset((page - 1) * limit)
