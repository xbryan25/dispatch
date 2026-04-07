from sqlalchemy import (
    literal_column,
    select,
    func,
    Select,
    Delete,
    delete,
    update,
    Update,
)


from .models import Notification

from src.auth.models import UserProfile

from uuid import UUID


class NotificationsQueries:
    @staticmethod
    def get_notifications_stmt(
        current_user_id: UUID, read_state: str, sort_state: str
    ) -> Select:

        stmt = (
            select(Notification, UserProfile.username)
            .join(
                UserProfile,
                Notification.sender_id == UserProfile.user_id,
            )
            .where(Notification.receiver_id == current_user_id)
            .order_by(
                (
                    Notification.created_at.asc()
                    if sort_state == "ascending"
                    else Notification.created_at.desc()
                )
            )
        )

        if read_state != "all":
            stmt = stmt.where(
                Notification.is_read_by_receiver.is_(True)
                if read_state == "read"
                else Notification.is_read_by_receiver.is_(True)
            )

        # if search_query.strip():
        #     stmt = stmt.filter(
        #         func.lower(UserProfile.username).contains(search_query.lower())
        #     )

        return stmt

    @staticmethod
    def delete_notifications_stmt(
        current_user_id: UUID, notification_ids: list[UUID]
    ) -> Delete:

        stmt = delete(Notification).where(
            Notification.notification_id.in_(notification_ids),
            Notification.receiver_id == current_user_id,
        )

        return stmt

    @staticmethod
    def mark_notifications_as_read_or_unread_stmt(
        current_user_id: UUID, notification_ids: list[UUID], read_state: str
    ) -> Update:

        is_read_by_receiver = True if read_state == "read" else False

        stmt = (
            update(Notification)
            .where(
                Notification.notification_id.in_(notification_ids),
                Notification.receiver_id == current_user_id,
            )
            .values(is_read_by_receiver=is_read_by_receiver)
        )

        return stmt

    @staticmethod
    def get_unread_notifications_count(current_user_id: UUID) -> Select:

        stmt = (
            select(func.count())
            .select_from(Notification)
            .where(
                Notification.is_read_by_receiver.is_(False),
                Notification.receiver_id == current_user_id,
            )
        )

        return stmt

    @staticmethod
    def get_total_count_of_notifications(stmt: Select):
        """
        Wraps a SQLAlchemy Select statement to return a count of total records.

        Optimizes performance by stripping expensive correlated subqueries,
        extra columns, and ordering, replacing them with a constant '1'
        to trigger an index-only scan where possible.
        """

        optimized_stmt = stmt.with_only_columns(literal_column("1")).order_by(None)
        inner_query = optimized_stmt.subquery()

        return select(func.count()).select_from(inner_query)

    @staticmethod
    def add_pagination_details_in_select_stmts(stmt: Select, page: int, limit: int):
        """
        Adds limit and offset to Select statements.
        """

        return stmt.limit(limit).offset((page - 1) * limit)
