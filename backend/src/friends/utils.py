from typing import Any, Sequence


class FriendsUtils:

    @staticmethod
    def parse_users_with_friend_counts(
        users_with_counts: Sequence[Any], with_conversation_id: bool = False
    ) -> list[dict[str, Any]]:
        output = []

        for row in users_with_counts:

            print(f"\n\n{row}\n\n")

            user_obj = row.UserProfile
            count = row.total_friend_count

            if with_conversation_id:
                conversation_id = row.conversation_id

                output.append(
                    {
                        "user_id": user_obj.user_id,
                        "username": user_obj.username,
                        "full_name": user_obj.full_name,
                        "profile_image_url": user_obj.profile_image_url,
                        "total_friend_count": count,
                        "conversation_id": conversation_id,
                    }
                )

            else:
                output.append(
                    {
                        "user_id": user_obj.user_id,
                        "username": user_obj.username,
                        "full_name": user_obj.full_name,
                        "profile_image_url": user_obj.profile_image_url,
                        "total_friend_count": count,
                    }
                )

        return output
