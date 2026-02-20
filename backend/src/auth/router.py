from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.core import get_db
from .dependencies import get_current_user_id
from .services import AuthService
from .schemas import UsernameCheckResponse, UserResponse, UserUpdate

from typing import Annotated

from uuid import UUID

import traceback

router = APIRouter(prefix="/api/auth", tags=["auth"])


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
        print(payload)

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
