from uuid import UUID
from .conftest import as_user


class TestGetCurrentFriends:

    async def test_get_current_friends(self, authenticated_client):
        response = await authenticated_client.get("/api/friends")
        assert response.status_code == 200

    async def test_get_current_friends_invalid_sort_state(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends", params={"sort_state": "asdfadsf"}
        )
        assert response.status_code == 422

    async def test_get_current_friends_zero_page(self, authenticated_client):
        response = await authenticated_client.get("/api/friends", params={"page": 0})
        assert response.status_code == 422

    async def test_get_current_friends_negative_page(self, authenticated_client):
        response = await authenticated_client.get("/api/friends", params={"page": -1})
        assert response.status_code == 422

    async def test_get_current_friends_zero_limit(self, authenticated_client):
        response = await authenticated_client.get("/api/friends", params={"limit": 0})
        assert response.status_code == 422

    async def test_get_current_friends_negative_limit(self, authenticated_client):
        response = await authenticated_client.get("/api/friends", params={"limit": -1})
        assert response.status_code == 422

    async def test_get_current_friends_unauthenticated(self, client):
        response = await client.get("/api/friends")
        assert response.status_code == 401

    async def test_get_current_friends_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get("/api/friends", headers=headers)
        assert response.status_code == 401


class TestGetSentRequestsProfiles:
    async def test_get_sent_requests_profiles(self, authenticated_client):
        response = await authenticated_client.get("/api/friends/sent")
        assert response.status_code == 200

    async def test_get_sent_requests_profiles_invalid_sort_state(
        self, authenticated_client
    ):
        response = await authenticated_client.get(
            "/api/friends/sent", params={"sort_state": "asdfadsf"}
        )
        assert response.status_code == 422

    async def test_get_sent_requests_profiles_zero_page(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/sent", params={"page": 0}
        )
        assert response.status_code == 422

    async def test_get_sent_requests_profiles_negative_page(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/sent", params={"page": -1}
        )
        assert response.status_code == 422

    async def test_get_sent_requests_profiles_zero_limit(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/sent", params={"limit": 0}
        )
        assert response.status_code == 422

    async def test_get_sent_requests_profiles_negative_limit(
        self, authenticated_client
    ):
        response = await authenticated_client.get(
            "/api/friends/sent", params={"limit": -1}
        )
        assert response.status_code == 422

    async def test_get_sent_requests_profiles_unauthenticated(self, client):
        response = await client.get("/api/friends/sent")
        assert response.status_code == 401

    async def test_get_sent_requests_profiles_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get("/api/friends/sent", headers=headers)
        assert response.status_code == 401


class TestGetReceivedRequestsProfiles:
    async def test_get_received_requests_profiles(self, authenticated_client):
        response = await authenticated_client.get("/api/friends/received")
        assert response.status_code == 200

    async def test_get_received_requests_profiles_invalid_sort_state(
        self, authenticated_client
    ):
        response = await authenticated_client.get(
            "/api/friends/received", params={"sort_state": "asdfadsf"}
        )
        assert response.status_code == 422

    async def test_get_received_requests_profiles_zero_page(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/received", params={"page": 0}
        )
        assert response.status_code == 422

    async def test_get_received_requests_profiles_negative_page(
        self, authenticated_client
    ):
        response = await authenticated_client.get(
            "/api/friends/received", params={"page": -1}
        )
        assert response.status_code == 422

    async def test_get_received_requests_profiles_zero_limit(
        self, authenticated_client
    ):
        response = await authenticated_client.get(
            "/api/friends/received", params={"limit": 0}
        )
        assert response.status_code == 422

    async def test_get_received_requests_profiles_negative_limit(
        self, authenticated_client
    ):
        response = await authenticated_client.get(
            "/api/friends/received", params={"limit": -1}
        )
        assert response.status_code == 422

    async def test_get_received_requests_profiles_unauthenticated(self, client):
        response = await client.get("/api/friends/received")
        assert response.status_code == 401

    async def test_get_received_requests_profiles_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get("/api/friends/received", headers=headers)
        assert response.status_code == 401


class TestGetFormerFriends:
    async def test_get_former_friends(self, authenticated_client):
        response = await authenticated_client.get("/api/friends/former")
        assert response.status_code == 200

    async def test_get_former_friends_invalid_sort_state(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/former", params={"sort_state": "asdfadsf"}
        )
        assert response.status_code == 422

    async def test_get_former_friends_zero_page(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/former", params={"page": 0}
        )
        assert response.status_code == 422

    async def test_get_former_friends_negative_page(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/former", params={"page": -1}
        )
        assert response.status_code == 422

    async def test_get_former_friends_zero_limit(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/former", params={"limit": 0}
        )
        assert response.status_code == 422

    async def test_get_former_friends_negative_limit(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/former", params={"limit": -1}
        )
        assert response.status_code == 422

    async def test_get_former_friends_unauthenticated(self, client):
        response = await client.get("/api/friends/former")
        assert response.status_code == 401

    async def test_get_former_friends_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get("/api/friends/former", headers=headers)
        assert response.status_code == 401


class TestGetFriendSuggestions:
    async def test_get_friend_suggestions(self, authenticated_client):
        response = await authenticated_client.get("/api/friends/suggestions")
        assert response.status_code == 200

    async def test_get_friend_suggestions_invalid_sort_state(
        self, authenticated_client
    ):
        response = await authenticated_client.get(
            "/api/friends/suggestions", params={"sort_state": "asdfadsf"}
        )
        assert response.status_code == 422

    async def test_get_friend_suggestions_zero_page(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/suggestions", params={"page": 0}
        )
        assert response.status_code == 422

    async def test_get_friend_suggestions_negative_page(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/suggestions", params={"page": -1}
        )
        assert response.status_code == 422

    async def test_get_friend_suggestions_zero_limit(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/suggestions", params={"limit": 0}
        )
        assert response.status_code == 422

    async def test_get_friend_suggestions_negative_limit(self, authenticated_client):
        response = await authenticated_client.get(
            "/api/friends/suggestions", params={"limit": -1}
        )
        assert response.status_code == 422

    async def test_get_friend_suggestions_unauthenticated(self, client):
        response = await client.get("/api/friends/suggestions")
        assert response.status_code == 401

    async def test_get_friend_suggestions_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get("/api/friends/suggestions", headers=headers)
        assert response.status_code == 401


class TestCreateNewFriendRequest:
    async def test_create_new_friend_request(self, authenticated_client):
        await authenticated_client.delete(
            "/api/friends/friend-request/cancel",
            params={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
        )

        response = await authenticated_client.post(
            "/api/friends/friend-request",
            json={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
        )
        assert response.status_code == 200

    async def test_create_new_friend_request_invalid_target_user_id(
        self, authenticated_client
    ):
        response = await authenticated_client.post(
            "/api/friends/friend-request",
            json={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 400

    async def test_create_new_friend_request_invalid_target_user_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.post(
            "/api/friends/friend-request",
            json={"target_user_id": "invalid-id-format"},
        )
        assert response.status_code == 422

    async def test_create_new_friend_request_no_target_user_id(
        self, authenticated_client
    ):
        response = await authenticated_client.post(
            "/api/friends/friend-request",
        )
        assert response.status_code == 422

    async def test_create_new_friend_request_unauthenticated(self, client):
        response = await client.post(
            "/api/friends/friend-request",
            json={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401

    async def test_create_new_friend_request_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.post(
            "/api/friends/friend-request",
            headers=headers,
            json={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401


class TestCancelFriendRequest:
    async def test_cancel_friend_request(self, authenticated_client):
        response = await authenticated_client.delete(
            "/api/friends/friend-request/cancel",
            params={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
        )
        assert response.status_code == 200

    async def test_cancel_friend_request_invalid_target_user_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.delete(
            "/api/friends/friend-request/cancel",
            params={"target_user_id": "invalid-id-format"},
        )
        assert response.status_code == 422

    async def test_cancel_friend_request_no_target_user_id(self, authenticated_client):
        response = await authenticated_client.delete(
            "/api/friends/friend-request/cancel",
        )
        assert response.status_code == 422

    async def test_cancel_friend_request_unauthenticated(self, client):
        response = await client.delete(
            "/api/friends/friend-request/cancel",
            params={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401

    async def test_cancel_friend_request_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.delete(
            "/api/friends/friend-request/cancel",
            headers=headers,
            params={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401


class TestAcceptFriendRequest:
    async def test_accept_friend_request(self, client):
        user_a = UUID("c976dffe-6d6c-495b-bd00-92c2cf9fd24c")
        user_b = UUID("441cff8e-1338-4c01-bace-daed0f308eed")

        async with as_user(user_a):
            await client.post(
                "/api/friends/friend-request",
                json={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
            )

        async with as_user(user_b):
            response = await client.patch(
                "/api/friends/friend-request/accept",
                json={"target_user_id": "c976dffe-6d6c-495b-bd00-92c2cf9fd24c"},
            )
            assert response.status_code == 200

    async def test_accept_friend_request_invalid_target_user_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/friends/friend-request/accept",
            params={"target_user_id": "invalid-id-format"},
        )
        assert response.status_code == 422

    async def test_accept_friend_request_no_target_user_id(self, authenticated_client):
        response = await authenticated_client.patch(
            "/api/friends/friend-request/accept",
        )
        assert response.status_code == 422

    async def test_accept_friend_request_unauthenticated(self, client):
        response = await client.patch(
            "/api/friends/friend-request/accept",
            params={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401

    async def test_accept_friend_request_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.patch(
            "/api/friends/friend-request/accept",
            headers=headers,
            params={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401


class TestRejectFriendRequest:
    async def test_reject_friend_request(self, authenticated_client):
        response = await authenticated_client.delete(
            "/api/friends/friend-request/reject",
            params={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
        )
        assert response.status_code == 200

    async def test_reject_friend_request_invalid_target_user_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.delete(
            "/api/friends/friend-request/reject",
            params={"target_user_id": "invalid-id-format"},
        )
        assert response.status_code == 422

    async def test_reject_friend_request_no_target_user_id(self, authenticated_client):
        response = await authenticated_client.delete(
            "/api/friends/friend-request/reject",
        )
        assert response.status_code == 422

    async def test_reject_friend_request_unauthenticated(self, client):
        response = await client.delete(
            "/api/friends/friend-request/reject",
            params={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401

    async def test_reject_friend_request_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.delete(
            "/api/friends/friend-request/reject",
            headers=headers,
            params={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401


class TestUnfriendUser:
    async def test_unfriend_user(self, authenticated_client):
        response = await authenticated_client.patch(
            "/api/friends/unfriend",
            json={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
        )
        assert response.status_code == 200

    async def test_unfriend_user_invalid_target_user_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/friends/unfriend",
            json={"target_user_id": "invalid-id-format"},
        )
        assert response.status_code == 422

    async def test_unfriend_user_no_target_user_id(self, authenticated_client):
        response = await authenticated_client.patch(
            "/api/friends/unfriend",
        )
        assert response.status_code == 422

    async def test_unfriend_user_unauthenticated(self, client):
        response = await client.patch(
            "/api/friends/unfriend",
            json={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401

    async def test_unfriend_user_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.patch(
            "/api/friends/unfriend",
            headers=headers,
            json={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401


class TestReconnectToFormerFriend:
    async def test_reconnect_to_former_friend(self, authenticated_client):
        response = await authenticated_client.patch(
            "/api/friends/friend-request/reconnect",
            json={"target_user_id": "441cff8e-1338-4c01-bace-daed0f308eed"},
        )
        assert response.status_code == 200

    async def test_reconnect_to_former_friend_invalid_target_user_id_format(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/friends/friend-request/reconnect",
            json={"target_user_id": "invalid-id-format"},
        )
        assert response.status_code == 422

    async def test_reconnect_to_former_friend_no_target_user_id(
        self, authenticated_client
    ):
        response = await authenticated_client.patch(
            "/api/friends/friend-request/reconnect",
        )
        assert response.status_code == 422

    async def test_reconnect_to_former_friend_unauthenticated(self, client):
        response = await client.patch(
            "/api/friends/friend-request/reconnect",
            json={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401

    async def test_reconnect_to_former_friend_with_invalid_cookie(self, client):
        cookie_name = "sb-t...-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.patch(
            "/api/friends/friend-request/reconnect",
            headers=headers,
            json={"target_user_id": "d8b4eaa8-83a8-4ae2-b728-d3601b19817c"},
        )
        assert response.status_code == 401
