from sqlalchemy.ext.asyncio import AsyncSession

from .queries import FriendsQueries


from uuid import UUID

import traceback


class FriendsService:

    @staticmethod
    async def get_current_friends(db: AsyncSession, user_id: UUID):

        try:
            stmt = FriendsQueries.get_current_friends_stmt(user_id)

            result = await db.execute(stmt)

            friends_with_counts = result.all()

            output = []

            for row in friends_with_counts:
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

            return output

        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_sent_requests_profiles(db: AsyncSession, user_id: UUID):

        try:
            stmt = FriendsQueries.get_sent_requests_profiles_stmt(user_id)

            result = await db.execute(stmt)

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

            return output

        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_received_requests_profiles(db: AsyncSession, user_id: UUID):

        try:
            stmt = FriendsQueries.get_received_requests_profiles_stmt(user_id)

            result = await db.execute(stmt)

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

            return output

        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_former_friends(db: AsyncSession, user_id: UUID):

        try:
            stmt = FriendsQueries.get_former_friends_stmt(user_id)

            result = await db.execute(stmt)

            former_friends_with_counts = result.all()

            output = []

            for row in former_friends_with_counts:
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

            return output

        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_friend_suggestions(db: AsyncSession, user_id: UUID):

        try:
            stmt = FriendsQueries.get_friend_suggestions_stmt(user_id)

            result = await db.execute(stmt)

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

            print(output)

            return output

        except Exception:
            traceback.print_exc()
