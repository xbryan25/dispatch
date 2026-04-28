import redis.asyncio as redis

import json

from typing import AsyncGenerator
from .config import settings

# Async Redis client
redis_client = redis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)


async def get_redis() -> AsyncGenerator[redis.Redis, None]:
    try:
        yield redis_client
    except Exception:
        raise
    finally:
        pass


async def close_redis():
    await redis_client.aclose()


async def publish_to_user(user_id: str, event: dict):
    await redis_client.publish(f"user:{user_id}", json.dumps(event))
