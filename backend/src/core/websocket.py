from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[WebSocket]] = {}

        # User devices
        self.user_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, conversation_id: str, user_id: str):
        await websocket.accept()

        if conversation_id not in self.rooms:
            self.rooms[conversation_id] = []
        self.rooms[conversation_id].append(websocket)

        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(websocket)

        print(
            f"\n\nRooms: {self.rooms}\nCount {len(self.rooms['a9c6a2eb-872f-48da-a922-e4749092c75e'])}\n"
        )
        print(
            f"User connections: {self.user_connections}\nCount {len(self.user_connections['68d612a9-9b77-48f1-a648-69d160ccf521'])}\n\n"
        )

    def disconnect(self, websocket: WebSocket, conversation_id: str, user_id: str):
        if conversation_id in self.rooms:
            self.rooms[conversation_id].remove(websocket)
            if not self.rooms[conversation_id]:
                del self.rooms[conversation_id]

        if user_id in self.user_connections:
            self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def broadcast_to_room(self, conversation_id: str, message: dict):

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

    async def send_to_user(self, user_id: str, message: dict):

        # Sends a message to every active connection owned by a specific user.
        connections = self.user_connections.get(user_id)
        if connections:
            for websocket in connections:
                try:
                    await websocket.send_json(message)
                except Exception:
                    pass


manager = ConnectionManager()
