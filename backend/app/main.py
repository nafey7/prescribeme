"""
FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.routes import home, auth, doctors, patients, shared
from app.database import init_beanie, close_database, seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    print(f"{settings.app_name} v{settings.app_version} is starting...")
    
    # Initialize Beanie database connection
    await init_beanie()
    
    # Seed database with test data (if not already seeded)
    await seed_database()
    
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

# Configure CORS - important for httpOnly cookies to work
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,  # Loaded from environment variable
    allow_credentials=True,  # Critical for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(home.router)
app.include_router(auth.router, prefix=settings.api_v1_prefix)

# Protected routes (require authentication and role verification)
app.include_router(doctors.router, prefix=settings.api_v1_prefix)
app.include_router(patients.router, prefix=settings.api_v1_prefix)
app.include_router(shared.router, prefix=settings.api_v1_prefix)

