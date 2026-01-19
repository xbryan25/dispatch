from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from .dependencies import get_db
from .services import AuthService
from .schemas import UsernameCheckResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/check-username", response_model=UsernameCheckResponse)
async def check_username(
    username: str = Query(..., min_length=3), db: AsyncSession = Depends(get_db)
):

    return await AuthService.check_username(db, username)
