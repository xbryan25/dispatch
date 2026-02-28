from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from src.core import get_db

from src.auth.dependencies import get_current_user_id

from .services import FriendsService

from src.auth.schemas import BaseFriendResponse

from sqlalchemy.ext.asyncio import AsyncSession

from uuid import UUID
import traceback
from typing import Annotated

router = APIRouter(
    prefix="/api/friends",
    tags=["Friends"],
    dependencies=[Depends(get_current_user_id)],
)


@router.get("/", response_model=list[BaseFriendResponse])
async def get_current_friends(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        return await FriendsService.get_current_friends(db, user_id)

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
