import asyncio

import pytest
from httpx import AsyncClient, ASGITransport

from dotenv import load_dotenv
load_dotenv(".env.test")

from src.main import app

asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

@pytest.fixture(scope="session")
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        yield client

