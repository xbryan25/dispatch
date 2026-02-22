from fastapi import APIRouter, Depends, Query, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from src.core import get_db, get_s3_client, settings
from .dependencies import get_current_user_id
from .services import AuthService
from .schemas import UsernameCheckResponse, UserResponse, UserUpdate

from typing import Annotated
from types_aiobotocore_s3 import S3Client

from uuid import UUID

import traceback

router = APIRouter(
    prefix="/api/auth", tags=["auth"], dependencies=[Depends(get_current_user_id)]
)


@router.get("/check-username", response_model=UsernameCheckResponse)
async def check_username(
    username: str = Query(..., min_length=3), db: AsyncSession = Depends(get_db)
):

    return await AuthService.check_username(db, username)


@router.get("/me")
async def get_me(user_id: Annotated[UUID, Depends(get_current_user_id)]):

    return {"currentUserId": user_id}


@router.get("/user-details", response_model=UserResponse)
async def get_user_details(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        return await AuthService.get_participant_details(db, user_id)

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/user-details")
async def update_user_details(
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
async def update_user_profile_image(
    filename: str,
    file_type: str,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    s3: S3Client = Depends(get_s3_client),
):

    if not file_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only images are allowed")

    file_extension = filename.split(".")[-1]
    file_key = f"{user_id}.{file_extension}"

    try:
        upload_url = await AuthService.get_upload_url(s3, file_key, file_type)

        return {
            "upload_url": upload_url,
            "final_image_url": f"{settings.SUPABASE_S3_BUCKET_NAME}/storage/v1/object/public/{settings.SUPABASE_S3_BUCKET_NAME}/{file_key}",
        }

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
