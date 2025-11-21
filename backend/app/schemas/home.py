"""
Home/Health Check Schemas
"""
from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response schema"""
    message: str
    status: str = "running"

