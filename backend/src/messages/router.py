from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from src.core import manager

from .dependencies import get_db
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import MessageCreate

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            # Keeps Websocket open
            await websocket.receive_text()
    except (WebSocketDisconnect, Exception):
        manager.disconnect(user_id)


@router.post("/send")
async def send_message(payload: MessageCreate, db: AsyncSession = Depends(get_db)):

    # TODO: Make this a service that saves messages to messages table in db, in service, pass payload and db

    new_message = await supabase_service.save(payload)
    # 2. Trigger the WebSocket push to the recipient

    await manager.send_to_user(payload.receiver_id, new_message)

    return {"status": "sent"}