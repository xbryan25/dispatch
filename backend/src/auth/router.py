from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .dependencies import get_db
from .services import AuthService
from .schemas import UsernameCheckRequest, UsernameCheckResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/check-username", response_model=UsernameCheckResponse)
async def check_username(
    payload: UsernameCheckRequest, db: AsyncSession = Depends(get_db)
):

    return await AuthService.check_username(db, payload.username)
