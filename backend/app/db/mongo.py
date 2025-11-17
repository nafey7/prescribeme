from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.models.user import User


async def init_db():
    """Initialize MongoDB connection and Beanie."""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client[settings.MONGODB_DB_NAME],
        document_models=[User],
    )
    return client


async def close_db(client: AsyncIOMotorClient):
    """Close MongoDB connection."""
    client.close()
