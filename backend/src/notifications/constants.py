from enum import Enum


class NotificationTypeEnum(str, Enum):
    friend_request_accepted = "friend_request_accepted"
    friend_request_received = "friend_request_received"
    friend_request_rejected = "friend_request_rejected"
    group_invite = "group_invite"
    group_removed = "group_removed"
