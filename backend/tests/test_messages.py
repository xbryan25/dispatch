class TestSendMessage:
    async def test_send_message(self, authenticated_client, mock_redis):
        response = await authenticated_client.post(
            "/api/messages/send",
            json={
                "conversationId": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "content": "Test message",
                "tempMessageId": "25c38acc-e104-486f-b199-8b5f489cb50d",
            },
        )
        assert response.status_code == 200

    async def test_send_message_not_existing_conversation(self, authenticated_client):
        response = await authenticated_client.post(
            "/api/messages/send",
            json={
                "conversationId": "f08d3025-a5bc-4b96-9722-99cba99159ff",
                "content": "Test message",
                "tempMessageId": "25c38acc-e104-486f-b199-8b5f489cb50d",
            },
        )
        assert response.status_code == 400

    async def test_send_message_no_conversation_id(self, authenticated_client):
        response = await authenticated_client.post(
            "/api/messages/send",
            json={
                "content": "Test message",
                "tempMessageId": "25c38acc-e104-486f-b199-8b5f489cb50d",
            },
        )
        assert response.status_code == 422

    async def test_send_message_invalid_conversation_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.post(
            "/api/messages/send",
            json={
                "conversationId": "invalid-id-format",
                "content": "Test message",
                "tempMessageId": "25c38acc-e104-486f-b199-8b5f489cb50d",
            },
        )
        assert response.status_code == 422

    async def test_send_message_no_content(self, authenticated_client):
        response = await authenticated_client.post(
            "/api/messages/send",
            json={
                "conversationId": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "tempMessageId": "25c38acc-e104-486f-b199-8b5f489cb50d",
            },
        )
        assert response.status_code == 422

    async def test_send_message_invalid_content_format(self, authenticated_client):
        response = await authenticated_client.post(
            "/api/messages/send",
            json={
                "conversationId": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "content": 123,
                "tempMessageId": "25c38acc-e104-486f-b199-8b5f489cb50d",
            },
        )
        assert response.status_code == 422

    async def test_send_message_no_temp_message_id(self, authenticated_client):
        response = await authenticated_client.post(
            "/api/messages/send",
            json={"conversationId": "42f3e11b-7c0d-4744-a527-738001c154e1"},
        )
        assert response.status_code == 422

    async def test_send_message_invalid_temp_message_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.post(
            "/api/messages/send",
            json={
                "conversationId": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "content": 123,
                "tempMessageId": "invalid-id-format",
            },
        )
        assert response.status_code == 422

    async def test_send_message_no_payload(self, authenticated_client):
        response = await authenticated_client.post(
            "/api/messages/send",
        )
        assert response.status_code == 422

    async def test_send_message_unauthenticated(self, client):
        response = await client.post(
            "/api/messages/send",
            json={
                "conversationId": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "content": 123,
                "tempMessageId": "25c38acc-e104-486f-b199-8b5f489cb50d",
            },
        )
        assert response.status_code == 401

    async def test_send_message_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.post(
            "/api/messages/send",
            json={
                "conversationId": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "content": 123,
                "tempMessageId": "25c38acc-e104-486f-b199-8b5f489cb50d",
            },
            headers=headers,
        )
        assert response.status_code == 401


class TestGetConversationList:
    async def test_get_conversation_list(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/messages/conversations",
        )
        assert response.status_code == 200

    async def test_get_conversation_list_unauthenticated(self, client):
        response = await client.get(
            "/api/messages/conversations",
        )
        assert response.status_code == 401

    async def test_get_conversation_list_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get(
            "/api/messages/conversations",
            headers=headers,
        )
        assert response.status_code == 401


class TestGetOtherConversationParticipant:
    async def test_get_other_conversation_participant(
        self, authenticated_client, mock_redis
    ):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}/other-participant",
        )
        assert response.status_code == 200

    async def test_get_other_conversation_participant_no_participant(
        self, authenticated_client, mock_redis
    ):
        conversation_id = "baae9e2c-df97-4ac6-880e-7d2499c8bbdd"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}/other-participant",
        )
        assert response.status_code == 404

    async def test_get_other_conversation_participant_invalid_conversation(
        self, authenticated_client, mock_redis
    ):
        conversation_id = "f08d3025-a5bc-4b96-9722-99cba99159ff"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}/other-participant",
        )
        assert response.status_code == 400

    async def test_get_other_conversation_participant_invalid_conversation_id_format(
        self, authenticated_client, mock_redis
    ):
        conversation_id = "invalid-id-format"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}/other-participant",
        )
        assert response.status_code == 422

    async def test_get_other_conversation_participant_unauthenticated(self, client):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        response = await client.get(
            f"/api/messages/{conversation_id}/other-participant",
        )
        assert response.status_code == 401

    async def test_get_conversation_list_with_invalid_cookie(self, client):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get(
            f"/api/messages/{conversation_id}/other-participant",
            headers=headers,
        )
        assert response.status_code == 401


class TestCreateDirectMessage:
    async def test_create_direct_message(self, authenticated_client):
        response = await authenticated_client.post(
            "/api/messages/new-direct-message",
            json={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
        )
        assert response.status_code == 200

    async def test_create_direct_message_other_user_not_existing(
        self, authenticated_client
    ):
        response = await authenticated_client.post(
            "/api/messages/new-direct-message",
            json={"target_user_id": "e3c87765-3e29-4931-83de-54bacfc48895"},
        )
        assert response.status_code == 400

    async def test_create_direct_message_other_invalid_target_user_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.post(
            "/api/messages/new-direct-message",
            json={"target_user_id": "invalid-id-format"},
        )
        assert response.status_code == 422

    async def test_create_direct_message_no_payload(self, authenticated_client):
        response = await authenticated_client.post(
            "/api/messages/new-direct-message",
        )
        assert response.status_code == 422

    async def test_create_direct_message_unauthenticated(self, client):
        response = await client.post(
            "/api/messages/new-direct-message",
            json={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
        )
        assert response.status_code == 401

    async def test_create_direct_message_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.post(
            "/api/messages/new-direct-message",
            json={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
            headers=headers,
        )
        assert response.status_code == 401


class TestGetConversationTheme:
    async def test_get_conversation_theme(self, authenticated_client, mock_redis):
        response = await authenticated_client.get(
            "/api/messages/theme",
            params={"conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1"},
        )
        assert response.status_code == 200

    async def test_get_conversation_theme_invalid_conversation(
        self, authenticated_client, mock_redis
    ):
        response = await authenticated_client.get(
            "/api/messages/theme",
            params={"conversation_id": "f08d3025-a5bc-4b96-9722-99cba99159ff"},
        )
        assert response.status_code == 400

    async def test_get_conversation_theme_invalid_conversation_id_format(
        self, authenticated_client, mock_redis
    ):
        response = await authenticated_client.get(
            "/api/messages/theme", params={"conversation_id": "invalid-id-format"}
        )
        assert response.status_code == 422

    async def test_get_conversation_theme_unauthenticated(self, client):
        response = await client.get(
            "/api/messages/theme",
            params={"conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1"},
        )
        assert response.status_code == 401

    async def test_get_conversation_theme_with_invalid_cookie(self, client):

        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get(
            "/api/messages/theme",
            params={"conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1"},
            headers=headers,
        )
        assert response.status_code == 401


class TestUpdateConversationTheme:
    async def test_update_conversation_theme(self, authenticated_client, mock_redis):
        response = await authenticated_client.patch(
            "/api/messages/update-theme",
            json={
                "conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "theme": "default",
            },
        )
        assert response.status_code == 200

    async def test_update_conversation_theme_invalid_conversation(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/messages/update-theme",
            json={
                "conversation_id": "f08d3025-a5bc-4b96-9722-99cba99159ff",
                "theme": "default",
            },
        )
        assert response.status_code == 400

    async def test_update_conversation_theme_invalid_conversation_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/messages/update-theme",
            json={"conversation_id": "invalid-id-format", "theme": "default"},
        )
        assert response.status_code == 422

    async def test_update_conversation_theme_no_conversation_id(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/messages/update-theme",
            json={"theme": "default"},
        )
        assert response.status_code == 422

    async def test_update_conversation_theme_invalid_theme(self, authenticated_client):
        response = await authenticated_client.patch(
            "/api/messages/update-theme",
            json={
                "conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "theme": "invalid-theme",
            },
        )
        assert response.status_code == 422

    async def test_update_conversation_theme_no_theme(self, authenticated_client):
        response = await authenticated_client.patch(
            "/api/messages/update-theme",
            json={"theme": "invalid-theme"},
        )
        assert response.status_code == 422

    async def test_update_conversation_theme_unauthenticated(self, client):
        response = await client.patch(
            "/api/messages/update-theme",
            json={
                "conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "theme": "default",
            },
        )
        assert response.status_code == 401

    async def test_update_conversation_theme_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.patch(
            "/api/messages/update-theme",
            json={
                "conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1",
                "theme": "default",
            },
            headers=headers,
        )
        assert response.status_code == 401


class TestMarkConversationAsRead:
    async def test_mark_conversation_as_read(self, authenticated_client, mock_redis):
        response = await authenticated_client.patch(
            "/api/messages/mark-as-read",
            json={"conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1"},
        )
        assert response.status_code == 200

    async def test_mark_conversation_as_read_no_other_participant(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/messages/mark-as-read",
            json={"conversation_id": "baae9e2c-df97-4ac6-880e-7d2499c8bbdd"},
        )
        assert response.status_code == 404

    async def test_mark_conversation_as_read_invalid_conversation(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/messages/mark-as-read",
            json={"conversation_id": "f08d3025-a5bc-4b96-9722-99cba99159ff"},
        )
        assert response.status_code == 400

    async def test_mark_conversation_as_read_invalid_conversation_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/messages/mark-as-read",
            json={"conversation_id": "invalid-id-format"},
        )
        assert response.status_code == 422

    async def test_mark_conversation_as_read_unauthenticated(self, client):
        response = await client.patch(
            "/api/messages/mark-as-read",
            json={"conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1"},
        )
        assert response.status_code == 401

    async def test_mark_conversation_as_read_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.patch(
            "/api/messages/mark-as-read",
            json={"conversation_id": "42f3e11b-7c0d-4744-a527-738001c154e1"},
            headers=headers,
        )
        assert response.status_code == 401


class TestGetConversationMessageHistory:
    async def test_get_conversation_message_history(self, authenticated_client):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}",
        )
        assert response.status_code == 200

    async def test_get_conversation_message_history_invalid_conversation(
        self, authenticated_client
    ):
        conversation_id = "f08d3025-a5bc-4b96-9722-99cba99159ff"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}",
        )
        assert response.status_code == 400

    async def test_get_conversation_message_history_invalid_conversation_id_format(
        self, authenticated_client
    ):
        conversation_id = "invalid-id-format"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}",
        )
        assert response.status_code == 422

    async def test_get_conversation_message_history_negative_limit(
        self, authenticated_client
    ):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}", params={"limit": -1}
        )
        assert response.status_code == 422

    async def test_get_conversation_message_history_zero_limit(
        self, authenticated_client
    ):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}", params={"limit": 0}
        )
        assert response.status_code == 422

    async def test_get_conversation_message_history_above_limit(
        self, authenticated_client
    ):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}", params={"limit": 101}
        )
        assert response.status_code == 422

    async def test_get_conversation_message_history_invalid_datetime(
        self, authenticated_client
    ):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        response = await authenticated_client.get(
            f"/api/messages/{conversation_id}",
            params={"before_datetime": "invalid-datetime"},
        )
        assert response.status_code == 422

    async def test_get_conversation_message_history_unauthenticated(self, client):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        response = await client.get(
            f"/api/messages/{conversation_id}",
        )
        assert response.status_code == 401

    async def test_get_conversation_message_history_with_invalid_cookie(self, client):
        conversation_id = "42f3e11b-7c0d-4744-a527-738001c154e1"

        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get(f"/api/messages/{conversation_id}", headers=headers)
        assert response.status_code == 401
