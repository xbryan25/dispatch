from enum import Enum


class MessageStatusEnum(str, Enum):
    delivered = "delivered"
    read = "read"


class ConversationThemes(str, Enum):
    default = "default"
    purple = "purple"
    ocean = "ocean"
    rose = "rose"
    emerald = "emerald"
    amber = "amber"
    midnight = "midnight"
    sunset = "sunset"
    candy = "candy"
    forest = "forest"
    lavender = "lavender"
    coral = "coral"
    sky = "sky"
    mocha = "mocha"
    arctic = "arctic"
    grape = "grape"
    gold = "gold"
    charcoal = "charcoal"
