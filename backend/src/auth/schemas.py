from pydantic import BaseModel, Field
from src.auth.constants import GenderEnum
from datetime import date


class UsernameCheckRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)


class UsernameCheckResponse(BaseModel):
    does_username_exist: bool


class UserProfileCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    full_name: str | None = None
    date_of_birth: date | None = None
    gender: GenderEnum | None = None
