from fastapi import APIRouter, Depends, HTTPException, Request
from src.core import limiter

from src.auth.dependencies import get_current_user_id


import traceback


router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
    dependencies=[Depends(get_current_user_id)],
)


@router.get("")
@limiter.limit("30/minute")
async def test_route(
    request: Request,
):

    try:

        return {"status": "successfully added notification"}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
