from enum import Enum


class NotificationTypeEnum(str, Enum):
    friend_request_accepted = "friend_request_accepted"
    friend_request_received = "friend_request_received"
    friend_request_resent = "friend_request_resent"
    group_invite = "group_invite"
    group_removed = "group_removed"


class NotificationMessages:
    FRIEND_REQUEST_RECEIVED = (
        "{username} sent you a friend request. Accept to start chatting!"
    )
    FRIEND_REQUEST_ACCEPTED = (
        "{username} accepted your friend request. You can now chat with each other!"
    )
    FRIEND_REQUEST_RESENT = (
        "{username} sent you a friend request again. Reconnect to start chatting again!"
    )
    GROUP_INVITE = "{username} added you to {group_name}. Jump in and start chatting with the group!"
    GROUP_REMOVED = "You were removed from {group_name}. You can no longer send messages in this group."

    @staticmethod
    def format(notification_type: NotificationTypeEnum, **kwargs) -> str:
        templates = {
            NotificationTypeEnum.friend_request_received: NotificationMessages.FRIEND_REQUEST_RECEIVED,
            NotificationTypeEnum.friend_request_accepted: NotificationMessages.FRIEND_REQUEST_ACCEPTED,
            NotificationTypeEnum.friend_request_resent: NotificationMessages.FRIEND_REQUEST_RESENT,
            NotificationTypeEnum.group_invite: NotificationMessages.GROUP_INVITE,
            NotificationTypeEnum.group_removed: NotificationMessages.GROUP_REMOVED,
        }
        return templates[notification_type].format(**kwargs)
