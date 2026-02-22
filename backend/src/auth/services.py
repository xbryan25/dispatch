from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import select, update

from .models import UserProfile
from .schemas import UserUpdate

from src.core import s3_client
from src.core import settings


from uuid import UUID

import traceback


class AuthService:
    @staticmethod
    async def check_username(db: AsyncSession, username: str):

        query = select(UserProfile).where(UserProfile.username == username)

        result = await db.execute(query)
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

    @staticmethod
    async def update_participant_details(
        db: AsyncSession, user_id: UUID, payload: UserUpdate
    ):

        try:
            update_data = payload.model_dump(exclude_unset=True)

            update_data = {k: v for k, v in update_data.items() if v != ""}

            if not update_data:
                raise HTTPException(
                    status_code=400, detail="No fields provided for update"
                )

            query = (
                update(UserProfile)
                .where(UserProfile.user_id == user_id)
                .values(**update_data)
                .execution_options(synchronize_session="fetch")
            )

            await db.execute(query)
            await db.commit()

            return {"message": "Profile updated successfully"}
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def update_user_profile_image_url(
        db: AsyncSession, user_id: UUID, image_url: str
    ):

        try:
            query = (
                update(UserProfile)
                .where(UserProfile.user_id == user_id)
                .values(profile_image_url=image_url)
            )

            await db.execute(query)
            await db.commit()

            return {"message": "Profile image URL updated successfully"}
        except Exception:
            traceback.print_exc()

    @staticmethod
    def upload_user_profile_image_to_bucket(file: UploadFile):

        try:
            s3_client.upload_fileobj(
                file.file,
                settings.SUPABASE_S3_BUCKET_NAME,
                file.filename,
                ExtraArgs={"ContentType": file.content_type},
            )

            image_url = f"https://{settings.SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/{settings.SUPABASE_S3_BUCKET_NAME}/{file.filename}"

            return image_url
        except Exception:
            traceback.print_exc()
