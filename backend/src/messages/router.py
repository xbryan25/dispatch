from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Depends,
    HTTPException,
    Query,
    Request,
)
from src.core import manager, get_db, get_redis, limiter

from src.auth.dependencies import get_current_user_id

from .services import MessagesService
from .schemas import (
    MessageCreate,
    MessageRead,
    ConversationList,
    HistoryFilter,
    PastMessagesList,
    ConversationIdWithType,
    ConversationIdWithTheme,
    ConversationTheme,
    ConversationId,
)

from src.auth.schemas import UserMinimalWithStatus, TargetUserId
from src.auth.services import AuthService

from sqlalchemy.ext.asyncio import AsyncSession

from uuid import UUID
import uuid

import traceback
from typing import Annotated

from redis.asyncio import Redis

from .exceptions import InvalidConversationID


router = APIRouter(
    prefix="/api/messages",
    tags=["Messages"],
    dependencies=[Depends(get_current_user_id)],
)


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    redis: Redis = Depends(get_redis),
    db: AsyncSession = Depends(get_db),
):

    await manager.connect(websocket, user_id)

    # online:{user_id} is for general online state, while online_users is for group operations

    # Only store "1" in redis, it is just a placeholder to know if user is online
    await redis.set(f"online:{user_id}", "1", ex=60)

    await redis.sadd("online_users", str(user_id))  # type: ignore

    try:
        online_direct_message_participants = await redis.sinter(f"user:direct_message:{user_id}", "online_users")  # type: ignore

        for online_direct_message_participant in online_direct_message_participants:
            online_status_dict = {"isOnline": True}

            event_data = {"type": "USER_ONLINE", "data": online_status_dict}

            await manager.send_to_user(
                UUID(online_direct_message_participant), event_data
            )

        while True:
            data = await websocket.receive_json()

            if data["type"] == "PING":
                await redis.set(f"online:{user_id}", "1", ex=60)
                await redis.sadd("online_users", str(user_id))  # type: ignore
                await websocket.send_json({"type": "PONG"})

    except InvalidConversationID:
        traceback.print_exc()
        await websocket.close(code=3001)
    except WebSocketDisconnect:
        traceback.print_exc()
        manager.disconnect(websocket, user_id)

        remaining_connections = manager.get_num_of_current_connections_for_a_user(
            user_id
        )

        if remaining_connections == 0:
            online_direct_message_participants = await redis.sinter(f"user:direct_message:{user_id}", "online_users")  # type: ignore

            await redis.delete(f"online:{user_id}")
            await redis.srem("online_users", str(user_id))  # type: ignore

            last_online = await AuthService.update_last_online(db, user_id)

            for online_direct_message_participant in online_direct_message_participants:
                offline_status_dict = {
                    "isOnline": False,
                    "lastOnline": last_online.isoformat() if last_online else None,
                }

                event_data = {"type": "USER_OFFLINE", "data": offline_status_dict}

                await manager.send_to_user(
                    UUID(online_direct_message_participant), event_data
                )

    except Exception:
        traceback.print_exc()


@router.post("/send", response_model=MessageRead)
@limiter.limit("30/minute")
async def send_message(
    request: Request,
    payload: MessageCreate,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):
    """
    Creates a new message. The user_id is automatically
    extracted from the Supabase cookie.
    """

    try:
        conversation_id = payload.conversation_id

        conversation = await MessagesService.get_conversation_by_id(db, conversation_id)

        if not conversation:
            raise InvalidConversationID("Conversation ID does not exist.")

        new_message = await MessagesService.create_message(
            db=db, message_data=payload, sender_id=user_id
        )

        conversation_participants = (
            await MessagesService.get_participant_ids_in_conversation(
                db, conversation_id
            )
            or []
        )

        user_details = await AuthService.get_user_details(db, user_id)

        msg_dict = MessageRead.model_validate(new_message).model_dump(
            mode="json", by_alias=True
        )

        if user_details:
            msg_dict.update(
                {
                    "username": user_details.username,
                    "tempMessageId": str(payload.temp_message_id),
                }
            )

            event_data = {"type": "NEW_MESSAGE", "data": msg_dict}

            for conversation_participant in conversation_participants:
                await manager.send_to_user(conversation_participant, event_data)

        return msg_dict

    except InvalidConversationID:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail="Conversation ID does not exist.")

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/conversations", response_model=ConversationList)
@limiter.limit("60/minute")
async def get_conversation_list(
    request: Request,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):
    """
    add later
    """

    try:
        formatted_conversations = await MessagesService.get_conversations(db, user_id)

        return {"conversations": formatted_conversations or []}
    except InvalidConversationID:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail="Conversation ID does not exist.")

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get(
    "/{conversation_id}/other-participant",
    response_model=UserMinimalWithStatus,
)
@limiter.limit("60/minute")
async def get_other_conversation_participant(
    request: Request,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):

    try:
        conversation = await MessagesService.get_conversation_by_id(db, conversation_id)

        if not conversation:
            raise InvalidConversationID("Conversation ID does not exist.")

        conversation_participants = []

        conversation_participants = (
            await MessagesService.get_other_participants_details_in_conversation(
                db, conversation_id, user_id
            )
            or []
        )

        other_participant = next(
            (p for p in conversation_participants if p["user_id"] != user_id), None
        )

        if other_participant is None:
            raise HTTPException(status_code=404, detail="User not found")

        other_participant_dict = dict(other_participant)

        is_online = (
            True
            if await redis.exists(f"online:{other_participant_dict["user_id"]}") == 1
            else False
        )

        await redis.sadd(f"user:direct_message:{user_id}", str(other_participant_dict["user_id"]))  # type: ignore
        await redis.expire(f"user:direct_message:{user_id}", 3600)

        other_participant_dict.update({"is_online": is_online})

        return other_participant_dict

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/new-direct-message", response_model=ConversationIdWithType)
@limiter.limit("20/minute")
async def create_direct_message(
    request: Request,
    payload: TargetUserId,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):
    """
    Creates a new conversation, and assigns the current user_id and the target_user_id as conversation participants. Returns conversation_id. If conversation between users already exists, the conversation_id of that conversation will be returned instead.
    """

    try:

        formatted_target_user_id = uuid.UUID(payload.target_user_id)

        conversation_id = (
            await MessagesService.check_if_in_existing_direct_message_conversation(
                db, user_id, formatted_target_user_id
            )
        )

        if not conversation_id:

            conversation_id = await MessagesService.create_new_conversation(db)

            if not conversation_id or not formatted_target_user_id:
                raise Exception

            await MessagesService.add_direct_message_participants(
                db, conversation_id, user_id, formatted_target_user_id
            )

            return {"conversation_id": conversation_id, "conversation_id_type": "new"}

        return {"conversation_id": conversation_id, "conversation_id_type": "existing"}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/theme", response_model=ConversationTheme)
@limiter.limit("60/minute")
async def get_conversation_theme(
    request: Request,
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
):

    try:
        theme_details = await MessagesService.get_conversation_theme(
            db, conversation_id
        )

        return theme_details

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/update-theme", response_model=ConversationTheme)
async def update_conversation_theme(
    request: Request,
    payload: ConversationIdWithTheme,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        conversation_id = payload.conversation_id
        new_theme = payload.theme

        await MessagesService.update_conversation_theme(
            db, conversation_id, new_theme, user_id
        )

        theme_details = await MessagesService.get_conversation_theme(
            db, conversation_id
        )

        conversation_participants = (
            await MessagesService.get_participant_ids_in_conversation(
                db, conversation_id
            )
            or []
        )

        if theme_details:
            event_data = {
                "type": "NEW_THEME",
                "data": {
                    "theme": theme_details["theme"],
                    "changedBy": theme_details["changed_by"],
                    "changedAt": (
                        theme_details["changed_at"].isoformat()
                        if theme_details["changed_at"]
                        else None
                    ),
                },
            }

            for conversation_participant in conversation_participants:
                if conversation_participant != user_id:
                    await manager.send_to_user(conversation_participant, event_data)

        return theme_details

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/mark-as-read")
@limiter.limit("20/minute")
async def mark_conversation_as_read(
    request: Request,
    payload: ConversationId,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):

    try:
        conversation_id = payload.conversation_id

        result = await MessagesService.mark_conversation_as_read(
            db, payload.conversation_id, user_id
        )

        conversation_participants = []

        conversation_participants = (
            await MessagesService.get_other_participants_details_in_conversation(
                db, conversation_id, user_id
            )
            or []
        )

        other_participant = next(
            (p for p in conversation_participants if p["user_id"] != user_id), None
        )

        if other_participant is None:
            raise HTTPException(status_code=404, detail="User not found")

        if result:
            message_seen_dict = {
                "conversationId": str(conversation_id),
                "lastReadMessageId": str(result["last_read_message_id"]),
                "lastReadMessageAt": (
                    result["last_read_message_at"].isoformat()
                    if result["last_read_message_at"]
                    else None
                ),
                "hasSeenLatestMessage": True,
                "latestMessageSenderId": str(result["latest_message_sender_id"]),
            }

            event_data = {"type": "MESSAGE_SEEN", "data": message_seen_dict}

            await manager.send_to_user(UUID(str(other_participant.user_id)), event_data)

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/{conversation_id}", response_model=PastMessagesList)
@limiter.limit("90/minute")
async def get_conversation_message_history(
    request: Request,
    conversation_id: UUID,
    filter_params: Annotated[HistoryFilter, Query()],
    db: AsyncSession = Depends(get_db),
):

    try:

        conversation = await MessagesService.get_conversation_by_id(db, conversation_id)

        if not conversation:
            raise InvalidConversationID("Conversation ID does not exist.")

        past_messages = await MessagesService.get_conversation_message_history(
            db, conversation_id, filter_params.limit, filter_params.before_datetime
        )

        return {"past_messages": past_messages}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
