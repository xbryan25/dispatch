from enum import Enum


class FriendshipStatusEnum(str, Enum):
    accepted = "accepted"
    pending = "pending"
    rejected = "rejected"
    unfriended = "unfriended"
