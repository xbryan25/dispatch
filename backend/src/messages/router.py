from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from src.core import manager, get_db

from src.auth.dependencies import get_current_user_id

from .services import MessagesService
from .schemas import MessageCreate, MessageRead, ConversationList

from sqlalchemy.ext.asyncio import AsyncSession

from uuid import UUID
import traceback

from .exceptions import InvalidConversationID

router = APIRouter(prefix="/api/messages", tags=["Messages"])


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: UUID = Depends(get_current_user_id),
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
    db: AsyncSession = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id),
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
            await MessagesService.get_participants_in_conversation(db, conversation_id)
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
    db: AsyncSession = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id),
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
