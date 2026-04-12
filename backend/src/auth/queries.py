from fastapi import HTTPException

from sqlalchemy import (
    select,
    func,
    Select,
    update,
    Update,
)

from uuid import UUID


from src.auth.models import UserProfile
from .schemas import UserUpdate


class AuthQueries:

    @staticmethod
    def get_user_using_username_stmt(username: str) -> Select:

        stmt = select(UserProfile).where(UserProfile.username == username)

        return stmt

    @staticmethod
    def get_user_using_user_id_stmt(user_id: UUID) -> Select:

        stmt = select(UserProfile).where(UserProfile.user_id == user_id)

        return stmt

    @staticmethod
    def update_user_details_stmt(user_id: UUID, payload: UserUpdate) -> Update:

        update_data = payload.model_dump(exclude_unset=True, exclude_none=True)

        update_data = {k: v for k, v in update_data.items() if v != ""}

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields provided for update")

        return (
            update(UserProfile)
            .where(UserProfile.user_id == user_id)
            .values(**update_data)
            .execution_options(synchronize_session="fetch")
        )

    @staticmethod
    def update_user_profile_image_url_stmt(user_id: UUID, image_url: str) -> Update:

        return (
            update(UserProfile)
            .where(UserProfile.user_id == user_id)
            .values(profile_image_url=image_url)
        )

    @staticmethod
    def update_last_online_stmt(user_id: UUID) -> Update:

        return (
            update(UserProfile)
            .where(UserProfile.user_id == user_id)
            .values(last_online=func.now())
            .returning(UserProfile.last_online)
        )
