from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.schemas.user import UserResponse
from app.api.dependencies import get_current_user
from app.modules.users.service import UserService

router = APIRouter(prefix="/users", tags=["users"])
user_service = UserService()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID."""
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.get("", response_model=list[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
):
    """List all users (requires authentication)."""
    users = await user_service.list_users(skip=skip, limit=limit)
    return users
