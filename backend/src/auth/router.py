from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File
from fastapi.concurrency import run_in_threadpool

from sqlalchemy.ext.asyncio import AsyncSession

from src.core import get_db
from .dependencies import get_current_user_id
from .services import AuthService
from .schemas import UsernameCheckResponse, UserResponse, UserUpdate

from typing import Annotated

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


@router.patch("/profile-image")
async def update_user_profile_image(
    file: Annotated[UploadFile, File()],
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):
    if file.content_type is None:
        raise HTTPException(
            status_code=400,
            detail="Could not determine file type. Please ensure you are uploading an image.",
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        image_url = await run_in_threadpool(
            AuthService.upload_user_profile_image_to_bucket, file
        )

        if image_url:
            await AuthService.update_user_profile_image_url(db, user_id, image_url)

        return image_url

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
