from enum import Enum


class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    others = "others"
    prefer_not_to_say = "prefer_not_to_say"
