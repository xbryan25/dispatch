from fastapi import WebSocket

from uuid import UUID


class ConnectionManager:
    def __init__(self):
        self.user_connections: dict[UUID, list[WebSocket]] = {}

    def get_current_connections_for_a_user(self, user_id: UUID) -> list[WebSocket]:
        return self.user_connections.get(user_id, [])

    def get_num_of_current_connections_for_a_user(self, user_id: UUID) -> int:
        return len(self.get_current_connections_for_a_user(user_id))

    async def connect(self, websocket: WebSocket, user_id: UUID) -> None:
        await websocket.accept()

        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: UUID) -> None:
        if user_id in self.user_connections:
            self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]


manager = ConnectionManager()
