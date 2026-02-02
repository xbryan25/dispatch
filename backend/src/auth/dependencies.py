import json
from fastapi import Cookie, HTTPException
from jose import jwt
from src.core.config import settings
import base64

from uuid import UUID


async def get_current_user_id(
    cookie_str: str | None = Cookie(None, alias=settings.SUPABASE_COOKIE_NAME)
) -> UUID:

    if not cookie_str:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        if cookie_str.startswith("base64-"):
            encoded_content = cookie_str.replace("base64-", "")

            missing_padding = len(encoded_content) % 4
            if missing_padding:
                encoded_content += "=" * (4 - missing_padding)

            decoded_json_str = base64.b64decode(encoded_content).decode("utf-8")
            decoded_cookie = json.loads(decoded_json_str)
        else:
            decoded_cookie = json.loads(cookie_str)

        access_token = decoded_cookie.get("access_token")

        if not access_token:
            raise HTTPException(
                status_code=401, detail="No access token found in cookie"
            )

        payload = jwt.decode(
            access_token,
            str(settings.JWT_SECRET),
            algorithms=["HS256"],
            options={
                "verify_aud": False,
                "verify_signature": True,
            },
        )

        user_id_str = payload.get("sub")
        if not user_id_str:
            raise HTTPException(status_code=401, detail="Invalid token: missing sub")

        return UUID(user_id_str)

    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
