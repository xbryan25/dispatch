import botocore.exceptions
from unittest.mock import AsyncMock

import os
from dotenv import load_dotenv

load_dotenv(".env.test")


class TestCheckUsername:
    # GET /check-username

    async def test_check_username_available(self, client):
        response = await client.get(
            "/api/auth/check-username", params={"username": "availableuser"}
        )
        assert response.status_code == 200
        assert not response.json()["doesUsernameExist"]

    async def test_check_username_taken(self, client):
        response = await client.get(
            "/api/auth/check-username", params={"username": "newUsername"}
        )
        assert response.status_code == 200
        assert response.json()["doesUsernameExist"]

    async def test_check_username_too_short(self, client):
        response = await client.get(
            "/api/auth/check-username", params={"username": "ab"}
        )
        assert response.status_code == 422

    async def test_check_username_missing_param(self, client):
        response = await client.get("/api/auth/check-username")
        assert response.status_code == 422


class TestGetMe:
    # GET /me

    async def test_get_me_authenticated(self, authenticated_client):
        response = await authenticated_client.get("/api/auth/me")
        assert response.status_code == 200

    async def test_get_me_unauthenticated(self, client):
        response = await client.get("/api/auth/me")
        assert response.status_code == 401

    async def test_get_me_with_invalid_cookie(self, client):
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get("/api/auth/me", headers=headers)
        assert response.status_code == 401


class TestGetUserDetails:
    # GET /user-details

    async def test_get_user_details(self, authenticated_client):
        response = await authenticated_client.get("/api/auth/user-details")
        assert response.status_code == 200

    async def test_get_user_details_unauthenticated(self, client):
        response = await client.get("/api/auth/user-details")
        assert response.status_code == 401

    async def test_get_user_details_with_invalid_cookie(self, client):
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get("/api/auth/user-details", headers=headers)
        assert response.status_code == 401

    async def test_get_user_details_user_not_found(self, authenticated_client_no_user):
        response = await authenticated_client_no_user.get("/api/auth/user-details")
        assert response.status_code == 404


class TestUpdateUserDetails:
    # PATCH /user-details

    async def test_update_user_details(self, authenticated_client):
        response = await authenticated_client.patch(
            "/api/auth/user-details", json={"username": "newUsername"}
        )
        assert response.status_code == 200

    async def test_update_user_details_no_payload(self, authenticated_client):
        response = await authenticated_client.patch("/api/auth/user-details")
        assert response.status_code == 422

    async def test_update_user_details_unauthenticated(self, client):
        response = await client.patch(
            "/api/auth/user-details", json={"username": "newUsername"}
        )
        assert response.status_code == 401

    async def test_update_user_details_with_invalid_cookie(self, client):
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.patch(
            "/api/auth/user-details", headers=headers, json={"username": "newUsername"}
        )
        assert response.status_code == 401


class TestGetProfileImageUploadUrl:
    # GET /profile-image-upload-url

    async def test_get_upload_url_success(self, authenticated_client, mock_s3):
        response = await authenticated_client.get(
            "/api/auth/profile-image-upload-url",
            params={"filename": "photo.jpg", "file_type": "image/jpeg"},
        )
        assert response.status_code == 200
        assert "upload_url" in response.json()
        assert "final_image_url" in response.json()

    async def test_get_upload_url_invalid_file_type(
        self, authenticated_client, mock_s3
    ):
        response = await authenticated_client.get(
            "/api/auth/profile-image-upload-url",
            params={"filename": "file.pdf", "file_type": "application/pdf"},
        )
        assert response.status_code == 400

    async def test_get_upload_url_unauthenticated(self, client):
        response = await client.get(
            "/api/auth/profile-image-upload-url",
            params={"filename": "photo.jpg", "file_type": "image/jpeg"},
        )
        assert response.status_code == 401

    async def test_update_user_details_with_invalid_cookie(self, client):
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.get(
            "/api/auth/profile-image-upload-url",
            headers=headers,
            params={"filename": "photo.jpg", "file_type": "image/jpeg"},
        )
        assert response.status_code == 401


class TestUpdateProfileImage:
    # PATCH /profile-image-upload-url

    valid_url = f"https://{os.getenv("SUPABASE_PROJECT_ID")}.supabase.co/storage/v1/object/public/sample-bucket-name/some-image.jpg"

    async def test_update_profile_image_success(self, authenticated_client, mock_s3):
        response = await authenticated_client.patch(
            "/api/auth/profile-image", json={"profile_image_url": self.valid_url}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "success"

    async def test_update_profile_image_invalid_url(
        self, authenticated_client, mock_s3
    ):
        response = await authenticated_client.patch(
            "/api/auth/profile-image",
            json={"profile_image_url": "https://not-supabase.com/image.jpg"},
        )
        assert response.status_code == 400

    async def test_update_profile_image_not_in_s3(self, authenticated_client, mock_s3):
        # simulate S3 saying image doesn't exist
        mock_s3.head_object = AsyncMock(
            side_effect=botocore.exceptions.ClientError(
                {"Error": {"Code": "404"}}, "head_object"
            )
        )
        response = await authenticated_client.patch(
            "/api/auth/profile-image", json={"profile_image_url": self.valid_url}
        )
        assert response.status_code == 400

    async def test_update_profile_image_unauthenticated(self, client):
        response = await client.patch(
            "/api/auth/profile-image", json={"profile_image_url": self.valid_url}
        )
        assert response.status_code == 401

    async def test_update_profile_image_no_url(self, authenticated_client, mock_s3):
        response = await authenticated_client.patch(
            "/api/auth/profile-image", json={"profile_image_url": None}
        )
        assert response.status_code == 400

    async def test_update_user_details_with_invalid_cookie(self, client, mock_s3):
        cookie_name = "sb-tkwaptgyevrrzkfrpyxh-auth-token"
        headers = {"Cookie": f"{cookie_name}=not-a-real-token"}

        response = await client.patch(
            "/api/auth/profile-image",
            headers=headers,
            json={"profile_image_url": self.valid_url},
        )
        assert response.status_code == 401
