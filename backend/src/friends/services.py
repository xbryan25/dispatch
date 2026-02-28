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
