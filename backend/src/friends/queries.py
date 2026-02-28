from sqlalchemy import select, or_, func, Select

from .models import Friendship
from src.auth.models import UserProfile

from uuid import UUID


class FriendsQueries:

    @staticmethod
    def get_current_friends_stmt(user_id: UUID) -> Select:
        total_friends_sub = (
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

        stmt = (
            select(UserProfile, total_friends_sub.label("total_friend_count"))
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
        )

        return stmt
