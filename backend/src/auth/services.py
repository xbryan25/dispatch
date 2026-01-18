from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import select

from .models import UserProfile


class AuthService:
    @staticmethod
    async def check_username(db: AsyncSession, username: str):

        stmt = select(UserProfile).where(UserProfile.username == username)

        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        return {"does_username_exist": user is not None}
