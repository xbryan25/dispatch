from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from src.core import manager, get_db

from src.auth.dependencies import get_current_user_id

from .services import MessagesService
from .schemas import MessageCreate, MessageRead

from sqlalchemy.ext.asyncio import AsyncSession

from uuid import UUID
import traceback

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, user_id: UUID = Depends(get_current_user_id)
):
    user_id_str = str(user_id)

    await manager.connect(user_id_str, websocket)
    try:
        while True:
            await websocket.receive_text()
    except (WebSocketDisconnect, Exception):
        traceback.print_exc()
        manager.disconnect(user_id_str)


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
        new_message = await MessagesService.create_message(
            db=db, message_data=payload, sender_id=user_id
        )

        receiver_id = await MessagesService.get_other_participant(
            db, payload.conversation_id, user_id
        )

        if receiver_id:
            msg_dict = MessageRead.model_validate(new_message).model_dump(mode="json", by_alias=True)

            receiver_id_str = str(receiver_id)
            await manager.send_to_user(receiver_id_str, msg_dict)

        return new_message
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
