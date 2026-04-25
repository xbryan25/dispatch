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
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
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
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
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
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
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
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
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
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get("/api/friends/suggestions", headers=headers)
        assert response.status_code == 401


class TestCreateNewFriendRequest:
    pass


class TestCancelFriendRequest:
    pass


class TestAcceptFriendRequest:
    pass


class TestRejectFriendRequest:
    pass


class TestUnfriendUser:
    pass


class TestReconnectToFormerFriend:
    pass
