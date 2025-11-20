"""
Home/Health Check Routes
"""
from fastapi import APIRouter
from app.schemas.home import HealthResponse

router = APIRouter()


@router.get("/", response_model=HealthResponse, tags=["health"])
async def root():
    """
    Root endpoint to confirm server is running
    
    Returns:
        HealthResponse: Server status confirmation
    """
    return HealthResponse(message="Server is running", status="running")

