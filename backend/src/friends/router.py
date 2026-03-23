from fastapi import APIRouter, Depends, HTTPException, Request
from src.core import manager, get_db, limiter

from src.auth.dependencies import get_current_user_id

from .services import FriendsService

from src.auth.schemas import TargetUserId
from .schemas import UsersWithPaginationDetails

from src.auth.services import AuthService

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from uuid import UUID
import uuid

import traceback
from typing import Annotated

import math

router = APIRouter(
    prefix="/api/friends",
    tags=["Friends"],
    dependencies=[Depends(get_current_user_id)],
)


@router.get("", response_model=UsersWithPaginationDetails)
@limiter.limit("30/minute")
async def get_current_friends(
    request: Request,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    sort_state: str = "ascending",
    search_query: str = "",
    page: int = 1,
    limit: int = 24,
    db: AsyncSession = Depends(get_db),
):

    try:
        result = await FriendsService.get_current_friends(
            db, user_id, sort_state, search_query, page, limit
        )

        total_users = result[1] if result[1] else 0
        total_pages = math.ceil(total_users / limit)

        pagination_details = {
            "total_users": total_users,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
        }

        return {"users": result[0], "pagination": pagination_details}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/sent", response_model=UsersWithPaginationDetails)
@limiter.limit("30/minute")
async def get_sent_requests_profiles(
    request: Request,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    sort_state: str = "ascending",
    search_query: str = "",
    page: int = 1,
    limit: int = 24,
    db: AsyncSession = Depends(get_db),
):

    try:
        result = await FriendsService.get_sent_requests_profiles(
            db, user_id, sort_state, search_query, page, limit
        )

        total_users = result[1] if result[1] else 0
        total_pages = math.ceil(total_users / limit)

        pagination_details = {
            "total_users": total_users,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
        }

        return {"users": result[0], "pagination": pagination_details}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/received", response_model=UsersWithPaginationDetails)
@limiter.limit("30/minute")
async def get_received_requests_profiles(
    request: Request,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    sort_state: str = "ascending",
    search_query: str = "",
    page: int = 1,
    limit: int = 24,
    db: AsyncSession = Depends(get_db),
):

    try:
        result = await FriendsService.get_received_requests_profiles(
            db, user_id, sort_state, search_query, page, limit
        )

        total_users = result[1] if result[1] else 0
        total_pages = math.ceil(total_users / limit)

        pagination_details = {
            "total_users": total_users,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
        }

        return {"users": result[0], "pagination": pagination_details}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/former", response_model=UsersWithPaginationDetails)
@limiter.limit("30/minute")
async def get_former_friends(
    request: Request,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    sort_state: str = "ascending",
    search_query: str = "",
    page: int = 1,
    limit: int = 24,
    db: AsyncSession = Depends(get_db),
):

    try:
        result = await FriendsService.get_former_friends(
            db, user_id, sort_state, search_query, page, limit
        )

        total_users = result[1] if result[1] else 0
        total_pages = math.ceil(total_users / limit)

        pagination_details = {
            "total_users": total_users,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
        }

        return {"users": result[0], "pagination": pagination_details}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/suggestions", response_model=UsersWithPaginationDetails)
@limiter.limit("30/minute")
async def get_friend_suggestions(
    request: Request,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    sort_state: str = "ascending",
    search_query: str = "",
    page: int = 1,
    limit: int = 24,
    db: AsyncSession = Depends(get_db),
):

    try:
        result = await FriendsService.get_friend_suggestions(
            db, user_id, sort_state, search_query, page, limit
        )

        total_users = result[1] if result[1] else 0
        total_pages = math.ceil(total_users / limit)

        pagination_details = {
            "total_users": total_users,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
        }

        return {"users": result[0], "pagination": pagination_details}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/friend-request")
@limiter.limit("20/minute")
async def create_new_friend_request(
    request: Request,
    payload: TargetUserId,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        formatted_target_user_id = uuid.UUID(payload.target_user_id)

        await FriendsService.create_new_friend_request(
            db, user_id, formatted_target_user_id
        )

        return {"status": "success"}

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400, detail="Receiver not found or request already pending"
        )

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/friend-request/{target_user_id}")
@limiter.limit("20/minute")
async def cancel_friend_request(
    request: Request,
    target_user_id: UUID,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        await FriendsService.cancel_friend_request(db, user_id, target_user_id)

        return {"status": "success"}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/friend-request")
@limiter.limit("20/minute")
async def accept_friend_request(
    request: Request,
    payload: TargetUserId,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        formatted_target_user_id = uuid.UUID(payload.target_user_id)

        await FriendsService.accept_friend_request(
            db, user_id, formatted_target_user_id
        )

        target_user_details = await AuthService.get_user_details(db, user_id)

        if target_user_details:
            friendship_status_dict = {
                "friendshipStatus": "accepted",
                "otherParticipantUsername": target_user_details.username,
            }

            event_data = {"type": "UPDATE_CONVERSATION", "data": friendship_status_dict}

            await manager.send_to_user(formatted_target_user_id, event_data)

        return {"status": "success"}

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400, detail="Receiver not found or request already pending"
        )

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/friend-request/reject/{target_user_id}")
@limiter.limit("20/minute")
async def reject_friend_request(
    request: Request,
    target_user_id: UUID,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        await FriendsService.reject_friend_request(db, user_id, target_user_id)

        return {"status": "success"}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/unfriend")
@limiter.limit("20/minute")
async def unfriend_user(
    request: Request,
    payload: TargetUserId,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        formatted_target_user_id = uuid.UUID(payload.target_user_id)

        await FriendsService.unfriend_user(db, user_id, formatted_target_user_id)

        target_user_details = await AuthService.get_user_details(db, user_id)

        if target_user_details:
            friendship_status_dict = {
                "friendshipStatus": "unfriended",
                "otherParticipantUsername": target_user_details.username,
            }

            event_data = {"type": "UPDATE_CONVERSATION", "data": friendship_status_dict}

            await manager.send_to_user(formatted_target_user_id, event_data)

        return {"status": "success"}

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400, detail="Other user is not found or request already pending"
        )

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/friend-request/reconnect")
@limiter.limit("20/minute")
async def reconnect_to_former_friend(
    request: Request,
    payload: TargetUserId,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        formatted_target_user_id = uuid.UUID(payload.target_user_id)

        await FriendsService.create_new_friend_request(
            db, user_id, formatted_target_user_id
        )

        return {"status": "success"}

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400, detail="Receiver not found or request already pending"
        )

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
