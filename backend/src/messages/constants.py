from enum import Enum


class MessageStatusEnum(str, Enum):
    delivered = "delivered"
    read = "read"
