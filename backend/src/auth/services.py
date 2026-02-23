from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import select, update

from .models import UserProfile
from .schemas import UserUpdate

from uuid import UUID

import traceback

from types_aiobotocore_s3 import S3Client
import botocore.exceptions

from src.core import settings


class AuthService:
    @staticmethod
    async def check_username(db: AsyncSession, username: str):

        query = select(UserProfile).where(UserProfile.username == username)

        result = await db.execute(query)
        user = result.scalar_one_or_none()

        return {"does_username_exist": user is not None}

    @staticmethod
    async def get_user_details(db: AsyncSession, user_id: UUID):

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
    async def get_upload_url(s3: S3Client, file_key: str, file_type: str):

        try:
            upload_url = await s3.generate_presigned_url(
                ClientMethod="put_object",
                Params={
                    "Bucket": settings.SUPABASE_S3_BUCKET_NAME,
                    "Key": file_key,
                    "ContentType": file_type,
                },
                ExpiresIn=3600,
            )

            return upload_url
        except Exception:
            traceback.print_exc()

    @staticmethod
    async def verify_image_existence(s3: S3Client, file_key: str):
        try:
            # Doesn't raise exception if image exists
            await s3.head_object(
                Bucket=settings.SUPABASE_S3_BUCKET_NAME,
                Key=file_key,
            )

        except botocore.exceptions.ClientError:
            raise HTTPException(
                status_code=400, detail="File verification failed. Please upload again."
            )

        except Exception:
            traceback.print_exc()

    @staticmethod
    async def delete_user_profile_image(s3: S3Client, old_profile_image_url: str):
        try:

            file_key = old_profile_image_url.split(
                f"/{settings.SUPABASE_S3_BUCKET_NAME}/"
            )[-1]

            # Doesn't raise exception if image doesn't exist
            await s3.delete_object(
                Bucket=settings.SUPABASE_S3_BUCKET_NAME,
                Key=file_key,
            )

        except Exception:
            traceback.print_exc()
