class TestGetNotifications:

    async def test_get_notifications(self, authenticated_client):
        response = await authenticated_client.get("/api/notifications")
        assert response.status_code == 200

    async def test_get_notifications_invalid_read_state(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/notifications", params={"read_state": "asdfadsf"}
        )
        assert response.status_code == 422

    async def test_get_notifications_invalid_sort_state(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/notifications", params={"sort_state": "asdfadsf"}
        )
        assert response.status_code == 422

    async def test_get_notifications_zero_page(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/notifications", params={"page": 0}
        )
        assert response.status_code == 422

    async def test_get_notifications_negative_page(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/notifications", params={"page": -1}
        )
        assert response.status_code == 422

    async def test_get_notifications_zero_limit(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/notifications", params={"limit": 0}
        )
        assert response.status_code == 422

    async def test_get_notifications_negative_limit(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/notifications", params={"limit": -1}
        )
        assert response.status_code == 422

    async def test_get_notifications_unauthenticated(self, client):
        response = await client.get("/api/notifications")
        assert response.status_code == 401

    async def test_get_notifications_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get("/api/notifications", headers=headers)
        assert response.status_code == 401


class TestBulkDeleteNotifications:

    async def test_bulk_delete_notifications(self, authenticated_client):
        response = await authenticated_client.request(
            "DELETE",
            "/api/notifications/bulk",
            json={"notificationIds": ["c976dffe-6d6c-495b-bd00-92c2cf9fd24c"]},
        )
        assert response.status_code == 200

    async def test_bulk_delete_notifications_no_payload(self, authenticated_client):
        response = await authenticated_client.request(
            "DELETE",
            "/api/notifications/bulk",
        )
        assert response.status_code == 422

    async def test_bulk_delete_notifications_unauthenticated(self, client):
        response = await client.request(
            "DELETE",
            "/api/notifications/bulk",
            json={"notificationIds": ["c976dffe-6d6c-495b-bd00-92c2cf9fd24c"]},
        )
        assert response.status_code == 401

    async def test_bulk_delete_notifications_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.request(
            "DELETE",
            "/api/notifications/bulk",
            json={"notificationIds": ["c976dffe-6d6c-495b-bd00-92c2cf9fd24c"]},
            headers=headers,
        )
        assert response.status_code == 401


class TestUpdateNotificationState:

    async def test_mark_notifications_as_read_or_unread(self, authenticated_client):
        response = await authenticated_client.patch(
            "/api/notifications/read-status",
            json={
                "notificationIds": ["c976dffe-6d6c-495b-bd00-92c2cf9fd24c"],
                "read_state": "read",
            },
        )
        assert response.status_code == 200

    async def test_mark_notifications_as_read_or_unread_no_payload(
        self, authenticated_client
    ):
        response = await authenticated_client.patch("/api/notifications/read-status")
        assert response.status_code == 422

    async def test_mark_notifications_as_read_or_unread_no_notification_ids(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/notifications/read-status", json={"read_state": "read"}
        )
        assert response.status_code == 422

    async def test_mark_notifications_as_read_or_unread_no_read_state(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/notifications/read-status",
            json={"notificationIds": ["c976dffe-6d6c-495b-bd00-92c2cf9fd24c"]},
        )
        assert response.status_code == 422

    async def test_mark_notifications_as_read_or_unread_invalid_read_state(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/notifications/read-status",
            json={
                "notificationIds": ["c976dffe-6d6c-495b-bd00-92c2cf9fd24c"],
                "read_state": "test",
            },
        )
        assert response.status_code == 422

    async def test_mark_notifications_as_read_or_unread_unauthenticated(self, client):
        response = await client.patch(
            "/api/notifications/read-status",
            json={
                "notificationIds": ["c976dffe-6d6c-495b-bd00-92c2cf9fd24c"],
                "read_state": "read",
            },
        )
        assert response.status_code == 401

    async def test_mark_notifications_as_read_or_unread_with_invalid_cookie(
        self, client
    ):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.patch(
            "/api/notifications/read-status",
            json={
                "notificationIds": ["c976dffe-6d6c-495b-bd00-92c2cf9fd24c"],
                "read_state": "read",
            },
            headers=headers,
        )
        assert response.status_code == 401
