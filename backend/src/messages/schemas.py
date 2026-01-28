from pydantic import BaseModel, Field
from src.auth.constants import GenderEnum
from datetime import date

from uuid import UUID

class MessageCreate(BaseModel):
    receiver_id: UUID
    content: str