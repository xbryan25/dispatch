from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from src.core import limiter

from .auth import router as auth_router
from .auth import public_router as auth_public_router

from .messages import router as messages_router
from .friends import router as friends_router
from .notifications import router as notifications_router


def create_app():
    app = FastAPI(debug=True)
    app.state.limiter = limiter

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please try again in a minute."},
        )

    app.include_router(auth_router)
    app.include_router(auth_public_router)
    app.include_router(messages_router)
    app.include_router(friends_router)
    app.include_router(notifications_router)

    return app


app = create_app()
