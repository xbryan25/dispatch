from sqlalchemy.ext.asyncio import AsyncSession

from .queries import NotificationsQueries
from .models import Notification

from src.core import manager

from uuid import UUID

import traceback


class NotificationsService:

    @staticmethod
    async def create_notification(
        db: AsyncSession,
        notification_type,
        content: str,
        sender_id: UUID,
        sender_username: str,
        receiver_id: UUID,
    ):

        try:
            notification_data = {
                "type": notification_type,
                "content": content,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
            }

            db_message = Notification(**notification_data)

            db.add(db_message)
            await db.commit()
            await db.refresh(db_message)

            event_data = {
                "type": "NEW_NOTIFICATION",
                "data": {
                    "notificationId": str(db_message.notification_id),
                    "type": db_message.type,
                    "content": db_message.content,
                    "isReadByReceiver": db_message.is_read_by_receiver,
                    "senderUsername": sender_username,
                    "createdAt": db_message.created_at.isoformat(),
                },
            }

            await manager.send_to_user(receiver_id, event_data)

        except Exception:
            traceback.print_exc()

    @staticmethod
    async def get_notifications(
        db: AsyncSession,
        current_user_id: UUID,
        read_state: str,
        sort_state: str,
        page: int,
        limit: int,
    ):

        stmt = NotificationsQueries.get_notifications_stmt(
            current_user_id, read_state, sort_state
        )

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
                    "isReadByReceiver": notification.is_read_by_receiver,
                    "senderUsername": sender_username,
                }
            )

        return output, total_count

    @staticmethod
    async def delete_notifications(
        db: AsyncSession, current_user_id: UUID, notification_ids: list[UUID]
    ):

        stmt = NotificationsQueries.delete_notifications_stmt(
            current_user_id, notification_ids
        )

        await db.execute(stmt)
        await db.commit()

        return None

    @staticmethod
    async def mark_notifications_as_read_or_unread(
        db: AsyncSession, current_user_id: UUID, notification_ids: list[UUID], read_state: str
    ):

        stmt = NotificationsQueries.mark_notifications_as_read_or_unread_stmt(
            current_user_id, notification_ids, read_state
        )

        await db.execute(stmt)
        await db.commit()

        return None
