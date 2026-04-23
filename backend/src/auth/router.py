from fastapi import APIRouter, Depends, Query, HTTPException, Request

from sqlalchemy.ext.asyncio import AsyncSession

from typing import Annotated
from types_aiobotocore_s3 import S3Client

from uuid import UUID
import uuid

import traceback

from src.core import get_db, get_s3_client, settings, limiter

from .dependencies import get_current_user_id
from .services import AuthService
from .schemas import (
    UsernameCheckResponse,
    UserResponse,
    UserUpdate,
    UserProfileImageUrl,
)

router = APIRouter(
    prefix="/api/auth", tags=["auth"], dependencies=[Depends(get_current_user_id)]
)

public_router = APIRouter(prefix="/api/auth", tags=["auth"])


@public_router.get("/check-username", response_model=UsernameCheckResponse)
@limiter.limit("10/minute")
async def check_username(
    request: Request,
    username: str = Query(..., min_length=3),
    db: AsyncSession = Depends(get_db),
):  # noqa: F401

    return await AuthService.check_username(db, username)


@router.get("/me")
@limiter.limit("120/minute")
async def get_me(
    request: Request, user_id: Annotated[UUID, Depends(get_current_user_id)]
):

    return {"currentUserId": user_id}


@router.get("/user-details", response_model=UserResponse)
@limiter.limit("30/minute")
async def get_user_details(
    request: Request,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        user = await AuthService.get_user_details(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/user-details")
@limiter.limit("10/minute")
async def update_user_details(
    request: Request,
    payload: UserUpdate,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):
    try:
        return await AuthService.update_participant_details(db, user_id, payload)

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/profile-image-upload-url")
@limiter.limit("30/minute")
async def get_profile_image_upload_url(
    request: Request,
    filename: str,
    file_type: str,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    s3: S3Client = Depends(get_s3_client),
):

    if not file_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only images are allowed")

    new_uuid = uuid.uuid4()

    file_extension = filename.split(".")[-1]
    file_key = f"{user_id}/{new_uuid}.{file_extension}"

    try:
        upload_url = await AuthService.get_upload_url(s3, file_key, file_type)

        return {
            "upload_url": upload_url,
            "final_image_url": f"https://{settings.SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/{settings.SUPABASE_S3_BUCKET_NAME}/{file_key}",
        }

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/profile-image")
@limiter.limit("10/minute")
async def update_profile_image_url(
    request: Request,
    payload: UserProfileImageUrl,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
    s3: S3Client = Depends(get_s3_client),
):

    image_url = payload.profile_image_url

    if not image_url:
        raise HTTPException(status_code=400, detail="Image URL cannot be None.")

    file_key = image_url.split(f"/{settings.SUPABASE_S3_BUCKET_NAME}/")[-1]

    if not image_url.startswith(
        f"https://{settings.SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/"
    ):
        raise HTTPException(status_code=400, detail="Not a valid image URL.")

    try:
        user = await AuthService.get_user_details(db, user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User record not found")

        old_url = user.profile_image_url

        await AuthService.verify_image_existence(s3, file_key)

        await AuthService.update_user_profile_image_url(db, user_id, image_url)

        if old_url:
            await AuthService.delete_user_profile_image(s3, old_url)

        return {"status": "success"}

    except HTTPException:
        raise

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
