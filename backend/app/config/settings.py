"""
Application Settings and Configuration
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application Settings
    app_name: str = "PrescribeMe API"
    app_version: str = "1.0.0"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"
    
    # MongoDB Configuration (loaded from .env file)
    # For MongoDB Atlas, use format: mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_database: str = "prescribeme"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


settings = Settings()

