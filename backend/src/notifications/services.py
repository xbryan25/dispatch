from sqlalchemy.ext.asyncio import AsyncSession

from .queries import NotificationsQueries

from uuid import UUID


class NotificationsService:

    @staticmethod
    async def get_notifications(
        db: AsyncSession,
        current_user_id: UUID,
        sort_state: str,
        page: int,
        limit: int,
    ):

        stmt = NotificationsQueries.get_notifications_stmt(current_user_id, sort_state)

        count_stmt = NotificationsQueries.get_total_count_of_notifications(stmt)
        total_count = await db.scalar(count_stmt)

        data_stmt = NotificationsQueries.add_pagination_details_in_select_stmts(
            stmt, page, limit
        )

        result = await db.execute(data_stmt)

        notifications_with_sender_username = result.all()

        output = []

        for row in notifications_with_sender_username:
            notification = row[0]
            sender_username = row[1]

            output.append(
                {
                    "notification_id": notification.notification_id,
                    "created_at": notification.created_at,
                    "content": notification.content,
                    "type": notification.type,
                    "isSeenByReceiver": notification.is_seen_by_receiver,
                    "senderUsername": sender_username,
                }
            )

        return output, total_count
