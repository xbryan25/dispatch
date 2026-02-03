from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from src.core import manager, get_db, AsyncSessionLocal

from src.auth.dependencies import get_current_user_id

from .services import MessagesService
from .schemas import MessageCreate, MessageRead

from sqlalchemy.ext.asyncio import AsyncSession

from uuid import UUID
import traceback

from .exceptions import InvalidConversationID

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.websocket("/ws/{conversation_id_str}")
async def websocket_endpoint(
    websocket: WebSocket,
    conversation_id_str: str,
    user_id: UUID = Depends(get_current_user_id),
):
    user_id_str = str(user_id)

    # Open short lived db connection to verify conversation_id_str
    async with AsyncSessionLocal() as db:
        # 2. Perform your check
        conversation = await MessagesService.get_conversation_by_id(
            db, conversation_id_str
        )

        if not conversation:
            raise InvalidConversationID("Conversation ID does not exist.")

    await manager.connect(websocket, conversation_id_str, user_id_str)
    try:
        while True:
            await websocket.receive_text()
    except InvalidConversationID:
        traceback.print_exc()
        await websocket.close(code=3001)
    except (WebSocketDisconnect, Exception):
        traceback.print_exc()
        manager.disconnect(websocket, conversation_id_str, user_id_str)


@router.post("/send", response_model=MessageRead)
async def send_message(
    payload: MessageCreate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """
    Creates a new message. The user_id is automatically
    extracted from the Supabase cookie.
    """

    try:
        conversation_id = payload.conversation_id
        conversation_id_str = str(conversation_id)

        conversation = await MessagesService.get_conversation_by_id(
            db, str(conversation_id)
        )

        if not conversation:
            raise InvalidConversationID("Conversation ID does not exist.")

        new_message = await MessagesService.create_message(
            db=db, message_data=payload, sender_id=user_id
        )

        msg_dict = MessageRead.model_validate(new_message).model_dump(
            mode="json", by_alias=True
        )

        await manager.broadcast_to_room(conversation_id_str, msg_dict)

        return new_message
    except InvalidConversationID:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail="Conversation ID does not exist.")

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
