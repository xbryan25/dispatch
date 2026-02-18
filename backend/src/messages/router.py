from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Depends,
    HTTPException,
    Query,
)
from src.core import manager, get_db, AsyncSessionLocal

from src.auth.dependencies import get_current_user_id

from .services import MessagesService
from .schemas import (
    MessageCreate,
    MessageRead,
    ConversationList,
    HistoryFilter,
    PastMessagesList,
)

from src.auth.schemas import UserMinimal

from sqlalchemy.ext.asyncio import AsyncSession

from uuid import UUID
import traceback
from typing import Annotated

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
):

    await manager.connect(websocket, user_id)
    try:
        while True:
            await websocket.receive_text()
    except InvalidConversationID:
        traceback.print_exc()
        await websocket.close(code=3001)
    except (WebSocketDisconnect, Exception):
        traceback.print_exc()
        manager.disconnect(websocket, user_id)


@router.post("/send", response_model=MessageRead)
async def send_message(
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

        msg_dict = MessageRead.model_validate(new_message).model_dump(
            mode="json", by_alias=True
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
async def get_conversation_list(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    db: AsyncSession = Depends(get_db),
):
    """
    add later
    """

    try:
        formatted_conversations = await MessagesService.get_conversations(db, user_id)

        return {"conversations": formatted_conversations}
    except InvalidConversationID:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail="Conversation ID does not exist.")

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/{conversation_id}", response_model=PastMessagesList)
async def get_conversation_message_history(
    conversation_id: UUID,
    filter_params: Annotated[HistoryFilter, Query()],
    db: AsyncSession = Depends(get_db),
):

    try:
        async with AsyncSessionLocal() as db:
            conversation = await MessagesService.get_conversation_by_id(
                db, conversation_id
            )

            if not conversation:
                raise InvalidConversationID("Conversation ID does not exist.")

        past_messages = await MessagesService.get_conversation_message_history(
            db, conversation_id, filter_params.limit, filter_params.before_datetime
        )

        return {"past_messages": past_messages}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/{conversation_id}/other-participant", response_model=UserMinimal)
async def get_other_conversation_participant(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
):

    try:
        async with AsyncSessionLocal() as db:
            conversation = await MessagesService.get_conversation_by_id(
                db, conversation_id
            )

            if not conversation:
                raise InvalidConversationID("Conversation ID does not exist.")

        conversation_participants = []

        conversation_participants = (
            await MessagesService.get_participants_details_in_conversation(
                db,
                conversation_id,
            )
            or []
        )

        other_participant = next(
            (p for p in conversation_participants if p["user_id"] != user_id), None
        )

        if other_participant is None:
            raise HTTPException(status_code=404, detail="User not found")

        return other_participant

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
