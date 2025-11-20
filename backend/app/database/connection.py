"""
Beanie Database Connection Setup
"""
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie as beanie_init
from app.config.settings import settings
from app.models import User  # Import document models for Beanie initialization


# Global client instance to manage connection lifecycle
_client: AsyncIOMotorClient | None = None


async def init_beanie():
    """
    Initialize Beanie ODM with MongoDB connection
    
    This function:
    1. Creates a Motor async client connection to MongoDB
    2. Initializes Beanie with the database and all document models
    """
    global _client
    
    try:        
        # Create Motor client
        _client = AsyncIOMotorClient(settings.mongodb_url)
        
        # Test the connection by pinging the database
        await _client.admin.command('ping')
        
        # Initialize Beanie with the database and document models
        await beanie_init(
            database=_client[settings.mongodb_database],
            document_models=[
                User,
                # Add more document models here as you create them
                # Example: Prescription, Patient, Doctor, MedicalRecord, etc.
            ]
        )        
        print("✅ Database connection ready")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB")
        print(f"❌ Error: {str(e)}")
        print(f"❌ Connection URL: {settings.mongodb_url}")
        print(f"❌ Database: {settings.mongodb_database}")
        raise


async def close_database():
    """
    Close MongoDB connection
    
    This function closes the Motor client connection to MongoDB
    """
    global _client
    
    try:
        if _client:
            _client.close()
            print("✅ Database connection closed successfully")
        else:
            print("⚠️  No active database connection to close")
    except Exception as e:
        print(f"❌ Error closing database connection: {str(e)}")
        raise

