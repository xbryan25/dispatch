from src.core import BaseSchema

from uuid import UUID
from datetime import datetime

from .constants import NotificationTypeEnum


class Notification(BaseSchema):
    notification_id: UUID
    created_at: datetime
    content: str
    type: NotificationTypeEnum
    is_read_by_receiver: bool
    sender_username: str


class PaginationDetails(BaseSchema):
    total_notifications: int
    total_pages: int
    current_page: int
    page_size: int


class NotificationsWithPaginationDetails(BaseSchema):
    notifications: list[Notification]
    pagination: PaginationDetails


class NotificationIdsList(BaseSchema):
    notification_ids: list[UUID]
