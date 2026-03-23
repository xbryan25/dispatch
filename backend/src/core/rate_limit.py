from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
import base64
import json
from jose import jwt
from src.core.config import settings


def get_user_id_or_ip(request: Request) -> str:
    try:
        cookie_str = request.cookies.get(settings.SUPABASE_COOKIE_NAME)
        if not cookie_str:
            return get_remote_address(request)

        if cookie_str.startswith("base64-"):
            encoded_content = cookie_str.replace("base64-", "")
            missing_padding = len(encoded_content) % 4
            if missing_padding:
                encoded_content += "=" * (4 - missing_padding)
            decoded_cookie = json.loads(
                base64.b64decode(encoded_content).decode("utf-8")
            )
        else:
            decoded_cookie = json.loads(cookie_str)

        access_token = decoded_cookie.get("access_token")
        payload = jwt.decode(
            access_token,
            str(settings.JWT_SECRET),
            algorithms=["HS256"],
            options={"verify_aud": False, "verify_signature": True},
        )
        return str(payload.get("sub"))
    except Exception:
        return get_remote_address(request)


limiter = Limiter(key_func=get_user_id_or_ip, storage_uri=settings.REDIS_URL)
