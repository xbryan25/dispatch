# src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import router as auth_router
from .messages import router as messages_router
from .friends import router as friends_router


def create_app():
    app = FastAPI(debug=True)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router)
    app.include_router(messages_router)
    app.include_router(friends_router)

    return app


app = create_app()
