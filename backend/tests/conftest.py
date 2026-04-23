import asyncio

import pytest
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport

import os
from dotenv import load_dotenv

if os.path.exists(".env.test"):
    load_dotenv(".env.test")

from uuid import UUID

from src.main import app
from src.auth.dependencies import get_current_user_id
from src.core.storage import get_s3_client
from src.core import limiter

import sys

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


@pytest.fixture(scope="session")
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client


@pytest.fixture(autouse=True)
def disable_rate_limiting():
    limiter.enabled = False
    yield
    limiter.enabled = True


@pytest.fixture
async def authenticated_client(client):
    # Mock user ID
    fake_user_id = UUID("c976dffe-6d6c-495b-bd00-92c2cf9fd24c")

    # Force FastAPI to skip cookie parsing and just return this UUID
    app.dependency_overrides[get_current_user_id] = lambda: fake_user_id

    yield client

    # Clear overrides so other tests can test "Not Authenticated" states
    app.dependency_overrides.clear()


@pytest.fixture
async def authenticated_client_no_user(client):
    # UUID that doesn't exist in DB
    fake_user_id = UUID("00000000-0000-0000-0000-000000000000")

    app.dependency_overrides[get_current_user_id] = lambda: fake_user_id

    yield client

    app.dependency_overrides.clear()


@pytest.fixture()
def mock_s3():
    mock_s3_client = MagicMock()
    mock_s3_client.generate_presigned_url = AsyncMock(
        return_value="https://fake-upload-url.com/upload"
    )
    mock_s3_client.head_object = AsyncMock(
        return_value={}
    )  # return_value={} mimics that the operation "succeeded"
    mock_s3_client.delete_object = AsyncMock(return_value={})
    app.dependency_overrides[get_s3_client] = lambda: mock_s3_client
    yield mock_s3_client
    app.dependency_overrides.clear()
