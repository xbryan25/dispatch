from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.core import get_db
from .dependencies import get_current_user_id
from .services import AuthService
from .schemas import UsernameCheckResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/check-username", response_model=UsernameCheckResponse)
async def check_username(
    username: str = Query(..., min_length=3), db: AsyncSession = Depends(get_db)
):

    return await AuthService.check_username(db, username)


@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user_id)):

    return {"currentUserId": user_id}
