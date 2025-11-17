import pytest
from beanie import init_beanie
from mongomock_motor import AsyncMongoMockClient
from app.models.user import User
from app.main import app
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for tests."""
    import asyncio

    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def mock_mongodb():
    """Create mock MongoDB for tests."""
    client = AsyncMongoMockClient()
    await init_beanie(
        database=client["prescribeme"],
        models=[User],
    )
    yield client
    client.close()


@pytest.fixture
def client(mock_mongodb):
    """Create test client with mock MongoDB."""
    return TestClient(app)
