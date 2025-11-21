"""
Application Settings and Configuration
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application Settings
    app_name: str = "PrescribeMe API"
    app_version: str = "1.0.0"
    # SECURITY: Set DEBUG=false in production via environment variable
    # debug=True exposes sensitive information in error responses
    debug: bool = False  # Default to False for security; override with DEBUG=true in .env
    api_v1_prefix: str = "/api/v1"
    
    # MongoDB Configuration (loaded from .env file)
    # For MongoDB Atlas, use format: mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_database: str = "prescribeme"
    
    # JWT Configuration
    # SECURITY: JWT secret key MUST be set via JWT_SECRET_KEY environment variable
    # Server will fail to start if this variable is missing
    # Generate a secure key using: openssl rand -hex 32
    jwt_secret_key: str  # Required - no default, must be set in .env file
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30  # 30 minutes
    refresh_token_expire_days: int = 7  # 7 days
    
    # Database Seeder Configuration
    # SECURITY: Seeder password MUST be set via SEEDER_PASSWORD environment variable
    # Server will fail to start if this variable is missing
    # This password is used for all test users created during database seeding
    seeder_password: str  # Required - no default, must be set in .env file
    
    # CORS Configuration
    # Comma-separated list of allowed origins (e.g., "http://localhost:5173,http://localhost:3000")
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse comma-separated CORS origins into a list"""
        if not self.cors_origins:
            return []
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


settings = Settings()

