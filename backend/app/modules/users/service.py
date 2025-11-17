from app.models.user import User
from bson import ObjectId


class UserService:
    """Service for user operations."""

    @staticmethod
    async def get_user_by_id(user_id: str) -> User | None:
        """Get user by ID."""
        try:
            return await User.get(ObjectId(user_id))
        except Exception:
            return None

    @staticmethod
    async def get_user_by_email(email: str) -> User | None:
        """Get user by email."""
        return await User.find_one(User.email == email)

    @staticmethod
    async def list_users(skip: int = 0, limit: int = 100) -> list[User]:
        """List users with pagination."""
        return await User.find_all().skip(skip).limit(limit).to_list()
