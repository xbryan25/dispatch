from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Depends,
)

from sqlalchemy.ext.asyncio import AsyncSession

from uuid import UUID
import json

import traceback
from typing import Annotated

from redis.asyncio import Redis
import asyncio

from src.messages.exceptions import InvalidConversationID

from src.core import manager, get_db, get_redis

from src.auth.dependencies import get_current_user_id_ws

from src.auth.services import AuthService


router = APIRouter(prefix="/api/websocket", tags=["Webscoket"])


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: Annotated[UUID, Depends(get_current_user_id_ws)],
    redis: Redis = Depends(get_redis),
    db: AsyncSession = Depends(get_db),
):

    await manager.connect(websocket, user_id)

    # online:{user_id} is for general online state, while online_users is for group operations

    # Only store "1" in redis, it is just a placeholder to know if user is online
    await redis.set(f"online:{user_id}", "1", ex=60)

    await redis.sadd("online_users", str(user_id))  # type: ignore

    pubsub = redis.pubsub()
    await pubsub.subscribe(f"user:{user_id}")

    try:
        online_direct_message_participants = await redis.sinter(f"user:direct_message:{user_id}", "online_users")  # type: ignore

        for participant in online_direct_message_participants:
            await redis.publish(
                f"user:{participant}",
                json.dumps({"type": "USER_ONLINE", "data": {"isOnline": True}}),
            )

        # run pubsub listener and websocket receiver concurrently
        async def listen_to_redis():
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = json.loads(message["data"])
                    await websocket.send_json(data)

        async def listen_to_websocket():
            while True:
                data = await websocket.receive_json()
                if data["type"] == "PING":
                    await redis.set(f"online:{user_id}", "1", ex=60)
                    await redis.sadd("online_users", str(user_id))  # type: ignore
                    await websocket.send_json({"type": "PONG"})

        try:
            await asyncio.gather(
                listen_to_redis(), listen_to_websocket(), return_exceptions=False
            )
        except WebSocketDisconnect:
            raise 
        except Exception:
            raise

    except InvalidConversationID:
        traceback.print_exc()
        await websocket.close(code=3001)
    except WebSocketDisconnect:
        traceback.print_exc()

        await pubsub.unsubscribe(f"user:{user_id}")
        manager.disconnect(websocket, user_id)

        remaining_connections = manager.get_num_of_current_connections_for_a_user(
            user_id
        )

        if remaining_connections == 0:
            online_direct_message_participants = await redis.sinter(f"user:direct_message:{user_id}", "online_users")  # type: ignore

            await redis.delete(f"online:{user_id}")
            await redis.srem("online_users", str(user_id))  # type: ignore

            last_online = await AuthService.update_last_online(db, user_id)

            for participant in online_direct_message_participants:
                await redis.publish(
                    f"user:{participant}",
                    json.dumps(
                        {
                            "type": "USER_OFFLINE",
                            "data": {
                                "isOnline": False,
                                "lastOnline": (
                                    last_online.isoformat() if last_online else None
                                ),
                            },
                        }
                    ),
                )

    except Exception:
        traceback.print_exc()
