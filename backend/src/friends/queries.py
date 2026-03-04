from sqlalchemy import (
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

from .models import Friendship
from .constants import FriendshipStatusEnum

from src.auth.models import UserProfile

from uuid import UUID


class FriendsQueries:

    @staticmethod
    def get_total_friends_sub_stmt() -> ScalarSelect:

        stmt = (
            select(func.count(Friendship.sender_id))
            .where(
                or_(
                    Friendship.sender_id == UserProfile.user_id,
                    Friendship.receiver_id == UserProfile.user_id,
                ),
                Friendship.status == "accepted",
            )
            .correlate(UserProfile)
            .scalar_subquery()
        )

        return stmt

    @staticmethod
    def check_if_connection_exists_for_user_stmt(user_id: UUID) -> Exists:

        stmt = exists().where(
            or_(
                Friendship.sender_id == UserProfile.user_id,
                Friendship.receiver_id == UserProfile.user_id,
            ),
            or_(Friendship.sender_id == user_id, Friendship.receiver_id == user_id),
        )

        return stmt

    @staticmethod
    def check_if_connection_exists_between_two_users_stmt(
        user_id: UUID, target_id: UUID
    ) -> Select:

        stmt = select(Friendship).where(
            or_(
                and_(
                    Friendship.sender_id == user_id, Friendship.receiver_id == target_id
                ),
                and_(
                    Friendship.sender_id == target_id, Friendship.receiver_id == user_id
                ),
            )
        )

        return stmt

    @staticmethod
    def get_current_friends_stmt(user_id: UUID) -> Select:

        sub_stmt = FriendsQueries.get_total_friends_sub_stmt()

        stmt = (
            select(UserProfile, sub_stmt.label("total_friend_count"))
            .join(
                Friendship,
                or_(
                    Friendship.sender_id == UserProfile.user_id,
                    Friendship.receiver_id == UserProfile.user_id,
                ),
            )
            .where(
                or_(Friendship.sender_id == user_id, Friendship.receiver_id == user_id)
            )
            .where(UserProfile.user_id != user_id, Friendship.status == "accepted")
            .order_by(UserProfile.username.asc())
        )

        return stmt

    @staticmethod
    def get_sent_requests_profiles_stmt(user_id: UUID) -> Select:

        sub_stmt = FriendsQueries.get_total_friends_sub_stmt()

        stmt = (
            select(UserProfile, sub_stmt.label("total_friend_count"))
            .join(Friendship, Friendship.receiver_id == UserProfile.user_id)
            .where(
                Friendship.sender_id == user_id,
                UserProfile.user_id != user_id,
                Friendship.status == "pending",
            )
            .order_by(UserProfile.username.asc())
        )

        return stmt

    @staticmethod
    def get_received_requests_profiles_stmt(user_id: UUID) -> Select:

        sub_stmt = FriendsQueries.get_total_friends_sub_stmt()

        stmt = (
            select(UserProfile, sub_stmt.label("total_friend_count"))
            .join(Friendship, Friendship.sender_id == UserProfile.user_id)
            .where(
                Friendship.receiver_id == user_id,
                UserProfile.user_id != user_id,
                Friendship.status == "pending",
            )
            .order_by(UserProfile.username.asc())
        )

        return stmt

    @staticmethod
    def get_former_friends_stmt(user_id: UUID) -> Select:

        sub_stmt = FriendsQueries.get_total_friends_sub_stmt()

        stmt = (
            select(UserProfile, sub_stmt.label("total_friend_count"))
            .join(
                Friendship,
                or_(
                    Friendship.sender_id == UserProfile.user_id,
                    Friendship.receiver_id == UserProfile.user_id,
                ),
            )
            .where(
                or_(Friendship.sender_id == user_id, Friendship.receiver_id == user_id)
            )
            .where(UserProfile.user_id != user_id, Friendship.status == "unfriended")
            .order_by(UserProfile.username.asc())
        )

        return stmt

    @staticmethod
    def get_friend_suggestions_stmt(user_id: UUID) -> Select:

        sub_stmt = FriendsQueries.get_total_friends_sub_stmt()
        connection_exists_stmt = (
            FriendsQueries.check_if_connection_exists_for_user_stmt(user_id)
        )

        stmt = (
            select(UserProfile, sub_stmt.label("total_friend_count"))
            .where(UserProfile.user_id != user_id)
            .where(~connection_exists_stmt)
            .order_by(UserProfile.username.asc())
        )

        return stmt

    @staticmethod
    def delete_pending_friendship_stmt(sender_id: UUID, receiver_id: UUID) -> Delete:
        # Used by both 'cancel request' and 'reject request'

        stmt = delete(Friendship).where(
            Friendship.sender_id == sender_id,
            Friendship.receiver_id == receiver_id,
            Friendship.status == "pending",
        )

        return stmt

    @staticmethod
    def accept_friend_request_stmt(sender_id: UUID, receiver_id: UUID) -> Update:

        stmt = (
            update(Friendship)
            .where(
                Friendship.sender_id == sender_id,
                Friendship.receiver_id == receiver_id,
                Friendship.status == "pending",
            )
            .values(status=FriendshipStatusEnum.accepted, responded_at=func.now())
        )

        return stmt
