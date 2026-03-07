from src.auth.schemas import BaseFriendResponse
from src.core import BaseSchema


class PaginationDetails(BaseSchema):
    total_users: int
    total_pages: int
    current_page: int
    page_size: int


class UsersWithPaginationDetails(BaseSchema):
    users: list[BaseFriendResponse]
    pagination: PaginationDetails
