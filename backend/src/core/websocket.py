from fastapi import WebSocket

from uuid import UUID


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[UUID, list[WebSocket]] = {}

        # User devices
        self.user_connections: dict[UUID, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, conversation_id: UUID, user_id: UUID):
        await websocket.accept()

        if conversation_id not in self.rooms:
            self.rooms[conversation_id] = []
        self.rooms[conversation_id].append(websocket)

        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, conversation_id: UUID, user_id: UUID):
        if conversation_id in self.rooms:
            self.rooms[conversation_id].remove(websocket)
            if not self.rooms[conversation_id]:
                del self.rooms[conversation_id]

        if user_id in self.user_connections:
            self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def broadcast_to_room(self, conversation_id: UUID, message: dict):

        if conversation_id not in self.rooms:
            return

        dead_sockets = []

        for connection in self.rooms[conversation_id]:
            try:
                await connection.send_json(message)
            except Exception:
                # If sending fails, this socket is dead
                dead_sockets.append(connection)

        for dead in dead_sockets:
            self.rooms[conversation_id].remove(dead)

    async def send_to_user(self, user_id: UUID, message: dict):

        # Sends a message to every active connection owned by a specific user.
        connections = self.user_connections.get(user_id)
        if connections:
            for websocket in connections:
                try:
                    await websocket.send_json(message)
                except Exception:
                    pass


manager = ConnectionManager()
