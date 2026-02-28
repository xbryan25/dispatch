from datetime import date, datetime

from src.auth.constants import GenderEnum
from src.core import BaseSchema

from uuid import UUID

from typing import Optional


class UsernameCheckResponse(BaseSchema):
    does_username_exist: bool


class UserUpdate(BaseSchema):
    username: Optional[str] = None
    full_name: Optional[str] = None
    gender: Optional[GenderEnum] = None
    date_of_birth: Optional[date] = None


class UserProfileImageUrl(BaseSchema):
    profile_image_url: Optional[str] = None


class UserMinimal(UserProfileImageUrl):
    user_id: UUID
    username: str


class UserResponse(UserMinimal):
    full_name: str
    gender: Optional[GenderEnum]
    date_of_birth: Optional[date]
    joined_at: datetime
    is_email_verified: bool


class BaseFriendResponse(UserMinimal):
    full_name: Optional[str]
    total_friend_count: int
