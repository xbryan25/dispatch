from .config import settings
from typing import AsyncGenerator

import aioboto3
from botocore.config import Config
from types_aiobotocore_s3 import S3Client

s3_session = aioboto3.Session()


def get_s3_config():
    return Config(
        s3={"addressing_style": "path"},
        signature_version="s3v4",
        retries={"max_attempts": 3, "mode": "standard"},
    )


async def get_s3_client() -> AsyncGenerator[S3Client, None]:
    async with s3_session.client(  # type: ignore
        "s3",
        endpoint_url=settings.SUPABASE_S3_ENDPOINT,
        aws_access_key_id=settings.SUPABASE_S3_ACCESS_KEY,
        aws_secret_access_key=settings.SUPABASE_S3_SECRET_KEY,
        config=get_s3_config(),
        region_name="ap-south-1",
    ) as client:
        yield client
