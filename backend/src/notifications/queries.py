from sqlalchemy import literal_column, select, func, Select, Delete, delete


from .models import Notification

from src.auth.models import UserProfile

from uuid import UUID


class NotificationsQueries:
    @staticmethod
    def get_notifications_stmt(current_user_id: UUID, sort_state: str) -> Select:

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

        # if search_query.strip():
        #     stmt = stmt.filter(
        #         func.lower(UserProfile.username).contains(search_query.lower())
        #     )

        return stmt

    @staticmethod
    def delete_notification_stmt(notification_id: UUID) -> Delete:

        stmt = delete(Notification).where(
            Notification.notification_id == notification_id,
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
