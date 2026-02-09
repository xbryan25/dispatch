from fastapi import WebSocket

from uuid import UUID


class ConnectionManager:
    def __init__(self):
        self.user_connections: dict[UUID, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: UUID):
        await websocket.accept()

        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: UUID):
        if user_id in self.user_connections:
            self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def send_to_user(self, user_id: UUID, message: dict):
        # Sends a message to every active connection owned by a specific user.
        connections = self.user_connections.get(user_id)
        print(self.user_connections)
        if connections:
            for websocket in connections:
                try:
                    await websocket.send_json(message)
                except Exception:
                    pass


manager = ConnectionManager()
