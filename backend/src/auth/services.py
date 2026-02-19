from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import select

from .models import UserProfile

from uuid import UUID

import traceback


class AuthService:
    @staticmethod
    async def check_username(db: AsyncSession, username: str):

        stmt = select(UserProfile).where(UserProfile.username == username)

        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        return {"does_username_exist": user is not None}

    @staticmethod
    async def get_participant_details(db: AsyncSession, user_id: UUID):

        try:
            query = select(UserProfile).where(
                UserProfile.user_id == user_id,
            )
            result = await db.execute(query)
            return result.scalar_one_or_none()
        except Exception:
            traceback.print_exc()
