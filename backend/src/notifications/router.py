from fastapi import APIRouter, Depends, HTTPException, Request
from src.core import get_db, limiter

from src.auth.dependencies import get_current_user_id

from .services import NotificationsService
from .schemas import (
    NotificationsWithPaginationDetails,
    NotificationIdsList,
    NotificationIdsListWithReadState,
)


from sqlalchemy.ext.asyncio import AsyncSession

from uuid import UUID

import traceback
from typing import Annotated


import math

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
    dependencies=[Depends(get_current_user_id)],
)


@router.get("", response_model=NotificationsWithPaginationDetails)
@limiter.limit("30/minute")
async def get_notifications(
    request: Request,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    read_state: str = "all",
    sort_state: str = "ascending",
    page: int = 1,
    limit: int = 24,
    db: AsyncSession = Depends(get_db),
):

    try:
        result = await NotificationsService.get_notifications(
            db, user_id, read_state, sort_state, page, limit
        )

        total_notifications = result[1] if result[1] else 0
        total_pages = math.ceil(total_notifications / limit)

        pagination_details = {
            "total_notifications": total_notifications,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
        }

        return {"notifications": result[0], "pagination": pagination_details}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/bulk")
@limiter.limit("20/minute")
async def bulk_delete_notifications(
    request: Request,
    data: NotificationIdsList,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        await NotificationsService.delete_notifications(
            db, user_id, data.notification_ids
        )

        return {"status": "success"}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/read-status")
@limiter.limit("20/minute")
async def mark_notifications_as_read_or_unread(
    request: Request,
    data: NotificationIdsListWithReadState,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        await NotificationsService.mark_notifications_as_read_or_unread(
            db, user_id, data.notification_ids, data.read_state
        )

        return {"status": "success"}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
