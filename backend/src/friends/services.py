from sqlalchemy.ext.asyncio import AsyncSession

from .queries import FriendsQueries
from .models import Friendship

from uuid import UUID


class FriendsService:

    @staticmethod
    async def get_current_friends(
        db: AsyncSession,
        current_user_id: UUID,
        sort_state: str,
        search_query: str,
        page: int,
        limit: int,
    ):

        stmt = FriendsQueries.get_current_friends_stmt(
            current_user_id, sort_state, search_query
        )

        count_stmt = FriendsQueries.get_total_count_of_users(stmt)
        total_count = await db.scalar(count_stmt)

        data_stmt = FriendsQueries.add_pagination_details_in_select_stmts(
            stmt, page, limit
        )

        result = await db.execute(data_stmt)

        friends_with_counts = result.all()

        output = []

        # TODO: put this in util somehow, it's repetitive
        for row in friends_with_counts:
            user_obj = row.UserProfile
            count = row.total_friend_count
            conversation_id = row.conversation_id

            output.append(
                {
                    "user_id": user_obj.user_id,
                    "username": user_obj.username,
                    "full_name": user_obj.full_name,
                    "profile_image_url": user_obj.profile_image_url,
                    "total_friend_count": count,
                    "conversation_id": conversation_id,
                }
            )

        return output, total_count

    @staticmethod
    async def get_sent_requests_profiles(
        db: AsyncSession,
        current_user_id: UUID,
        sort_state: str,
        search_query: str,
        page: int,
        limit: int,
    ):

        stmt = FriendsQueries.get_sent_requests_profiles_stmt(
            current_user_id, sort_state, search_query
        )

        count_stmt = FriendsQueries.get_total_count_of_users(stmt)
        total_count = await db.scalar(count_stmt)

        data_stmt = FriendsQueries.add_pagination_details_in_select_stmts(
            stmt, page, limit
        )

        result = await db.execute(data_stmt)

        sent_requests_with_counts = result.all()

        output = []

        for row in sent_requests_with_counts:
            user_obj = row.UserProfile
            count = row.total_friend_count

            output.append(
                {
                    "user_id": user_obj.user_id,
                    "username": user_obj.username,
                    "full_name": user_obj.full_name,
                    "profile_image_url": user_obj.profile_image_url,
                    "total_friend_count": count,
                }
            )

        return output, total_count

    @staticmethod
    async def get_received_requests_profiles(
        db: AsyncSession,
        current_user_id: UUID,
        sort_state: str,
        search_query: str,
        page: int,
        limit: int,
    ):

        stmt = FriendsQueries.get_received_requests_profiles_stmt(
            current_user_id, sort_state, search_query
        )

        count_stmt = FriendsQueries.get_total_count_of_users(stmt)
        total_count = await db.scalar(count_stmt)

        data_stmt = FriendsQueries.add_pagination_details_in_select_stmts(
            stmt, page, limit
        )

        result = await db.execute(data_stmt)

        received_requests_with_counts = result.all()

        output = []

        for row in received_requests_with_counts:
            user_obj = row.UserProfile
            count = row.total_friend_count

            output.append(
                {
                    "user_id": user_obj.user_id,
                    "username": user_obj.username,
                    "full_name": user_obj.full_name,
                    "profile_image_url": user_obj.profile_image_url,
                    "total_friend_count": count,
                }
            )

        return output, total_count

    @staticmethod
    async def get_former_friends(
        db: AsyncSession,
        current_user_id: UUID,
        sort_state: str,
        search_query: str,
        page: int,
        limit: int,
    ):

        stmt = FriendsQueries.get_former_friends_stmt(
            current_user_id, sort_state, search_query
        )

        count_stmt = FriendsQueries.get_total_count_of_users(stmt)
        total_count = await db.scalar(count_stmt)

        data_stmt = FriendsQueries.add_pagination_details_in_select_stmts(
            stmt, page, limit
        )

        result = await db.execute(data_stmt)

        former_friends_with_counts = result.all()

        output = []

        for row in former_friends_with_counts:
            user_obj = row.UserProfile
            count = row.total_friend_count
            conversation_id = row.conversation_id

            output.append(
                {
                    "user_id": user_obj.user_id,
                    "username": user_obj.username,
                    "full_name": user_obj.full_name,
                    "profile_image_url": user_obj.profile_image_url,
                    "total_friend_count": count,
                    "conversation_id": conversation_id,
                }
            )

        return output, total_count

    @staticmethod
    async def get_friend_suggestions(
        db: AsyncSession,
        current_user_id: UUID,
        sort_state: str,
        search_query: str,
        page: int,
        limit: int,
    ):

        stmt = FriendsQueries.get_friend_suggestions_stmt(
            current_user_id, sort_state, search_query
        )

        count_stmt = FriendsQueries.get_total_count_of_users(stmt)
        total_count = await db.scalar(count_stmt)

        data_stmt = FriendsQueries.add_pagination_details_in_select_stmts(
            stmt, page, limit
        )

        result = await db.execute(data_stmt)

        suggestions_with_counts = result.all()

        output = []

        for row in suggestions_with_counts:
            user_obj = row.UserProfile
            count = row.total_friend_count

            output.append(
                {
                    "user_id": user_obj.user_id,
                    "username": user_obj.username,
                    "full_name": user_obj.full_name,
                    "profile_image_url": user_obj.profile_image_url,
                    "total_friend_count": count,
                }
            )

        return output, total_count

    @staticmethod
    async def create_new_friend_request(
        db: AsyncSession, current_user_id: UUID, target_user_id: UUID
    ):

        stmt = FriendsQueries.send_or_restart_request_stmt(
            current_user_id, target_user_id
        ).returning(Friendship)

        result = await db.execute(stmt)
        db_friendship = result.scalar_one()

        await db.commit()

        return db_friendship

    @staticmethod
    async def cancel_friend_request(
        db: AsyncSession, current_user_id: UUID, target_user_id: UUID
    ):

        stmt = FriendsQueries.delete_pending_friendship_stmt(
            current_user_id, target_user_id, "cancel"
        )

        await db.execute(stmt)
        await db.commit()

        return None

    @staticmethod
    async def accept_friend_request(
        db: AsyncSession, current_user_id: UUID, target_user_id: UUID
    ):
        print(f"\n\nuser_a: {current_user_id} | user_b: {target_user_id}\n\n")

        stmt = FriendsQueries.accept_friend_request_stmt(
            current_user_id, target_user_id
        )

        await db.execute(stmt)
        await db.commit()

        return None

    @staticmethod
    async def reject_friend_request(
        db: AsyncSession, current_user_id: UUID, target_user_id: UUID
    ):

        stmt = FriendsQueries.delete_pending_friendship_stmt(
            current_user_id, target_user_id, "reject"
        )

        await db.execute(stmt)
        await db.commit()

        return None

    @staticmethod
    async def unfriend_user(
        db: AsyncSession, current_user_id: UUID, target_user_id: UUID
    ):

        stmt = FriendsQueries.unfriend_user_stmt(current_user_id, target_user_id)

        await db.execute(stmt)
        await db.commit()

        return None

    @staticmethod
    async def reconnect_to_former_friend(
        db: AsyncSession, current_user_id: UUID, target_user_id: UUID
    ):

        stmt = FriendsQueries.send_or_restart_request_stmt(
            current_user_id, target_user_id
        )

        await db.execute(stmt)
        await db.commit()

        return None
