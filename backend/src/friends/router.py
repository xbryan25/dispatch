from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from src.core import get_db

from src.auth.dependencies import get_current_user_id

from .services import FriendsService

from src.auth.schemas import BaseFriendResponse, ReceiverId, SenderId

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from uuid import UUID
import uuid

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


@router.get("/sent", response_model=list[BaseFriendResponse])
async def get_sent_requests_profiles(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        return await FriendsService.get_sent_requests_profiles(db, user_id)

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/received", response_model=list[BaseFriendResponse])
async def get_received_requests_profiles(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        return await FriendsService.get_received_requests_profiles(db, user_id)

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/former", response_model=list[BaseFriendResponse])
async def get_former_friends(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        return await FriendsService.get_former_friends(db, user_id)

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/suggestions", response_model=list[BaseFriendResponse])
async def get_friend_suggestions(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        return await FriendsService.get_friend_suggestions(db, user_id)

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/friend-request")
async def create_new_friend_request(
    payload: ReceiverId,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    receiver_id = payload.receiver_id

    try:
        formatted_receiver_id = uuid.UUID(receiver_id)

        await FriendsService.create_new_friend_request(
            db, user_id, formatted_receiver_id
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


@router.delete("/friend-request/{receiver_id}")
async def cancel_friend_request(
    receiver_id: UUID,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        await FriendsService.cancel_friend_request(db, user_id, receiver_id)

        return {"status": "success"}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/friend-request")
async def accept_friend_request(
    payload: SenderId,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    sender_id = payload.sender_id

    try:
        formatted_sender_id = uuid.UUID(sender_id)

        await FriendsService.accept_friend_request(db, user_id, formatted_sender_id)

        return {"status": "success"}

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400, detail="Receiver not found or request already pending"
        )

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
