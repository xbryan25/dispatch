from pydantic import Field
from datetime import date

from src.auth.constants import GenderEnum
from src.core import BaseSchema

from uuid import UUID


class UsernameCheckResponse(BaseSchema):
    does_username_exist: bool


class UserProfileCreate(BaseSchema):
    username: str = Field(..., min_length=3, max_length=30)
    full_name: str | None = None
    date_of_birth: date | None = None
    gender: GenderEnum | None = None


class PartialUserDetails(BaseSchema):
    user_id: UUID
    username: str
    profile_image_url: str | None
