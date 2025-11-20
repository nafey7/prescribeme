"""
FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.settings import settings
from app.routes import home
from app.database import init_beanie, close_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    print(f"{settings.app_name} v{settings.app_version} is starting...")
    
    # Initialize Beanie database connection
    await init_beanie()
    
    yield
    
    # Shutdown
    print(f"{settings.app_name} is shutting down...")
    await close_database()


# Initialize FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
    description="PrescribeMe API - FastAPI Boilerplate",
    lifespan=lifespan
)

# Include routers
app.include_router(home.router)

