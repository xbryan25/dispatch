import json
from fastapi import Cookie, HTTPException
from jose import jwt
from src.core.config import settings


async def get_current_user_id(
    cookie_str: str | None = Cookie(None, alias=settings.SUPABASE_COOKIE_NAME)
) -> str:
    if not cookie_str:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        decoded_cookie = json.loads(cookie_str)
        access_token = decoded_cookie[0]

        payload = jwt.decode(
            access_token,
            settings.JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
