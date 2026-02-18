from pydantic import Field
from datetime import date

from src.auth.constants import GenderEnum
from src.core import BaseSchema

from uuid import UUID

from typing import Optional


class UsernameCheckResponse(BaseSchema):
    does_username_exist: bool


class UserUpdate(BaseSchema):
    username: Optional[str] = None
    full_name: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_image_url: Optional[str] = None

class UserMinimal(BaseSchema):
    user_id: UUID
    username: str
    profile_image_url: Optional[str] = None

class UserResponse(UserMinimal):
    full_name: str
    gender: str
    date_of_birth: date
