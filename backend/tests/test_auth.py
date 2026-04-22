from .conftest import client

# /check-username

async def test_check_username_available(client):
    response = await client.get("/api/auth/check-username", params={"username": "availableuser"})
    assert response.status_code == 200
    assert response.json()["doesUsernameExist"] == False

async def test_check_username_taken(client):
    response = await client.get("/api/auth/check-username", params={"username": "test_user"})
    assert response.status_code == 200
    assert response.json()["doesUsernameExist"] == True

async def test_check_username_too_short(client):
    response = await client.get("/api/auth/check-username", params={"username": "ab"})
    assert response.status_code == 422

async def test_check_username_missing_param(client):
    response = await client.get("/api/auth/check-username")
    assert response.status_code == 422  