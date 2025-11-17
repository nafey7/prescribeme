from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password, create_access_token


class AuthService:
    """Service for authentication operations."""

    async def register_user(self, user_data: UserCreate) -> User:
        """Register a new user."""
        # Check if user already exists
        existing_user = await User.find_one(User.email == user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        # Create new user
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=get_password_hash(user_data.password),
        )
        await user.save()
        return user

    async def authenticate_user(
        self, email: str, password: str
    ) -> User | None:
        """Authenticate a user with email and password."""
        user = await User.find_one(User.email == email)

        if not user or not verify_password(password, user.hashed_password):
            return None

        return user

    @staticmethod
    def create_token(user_id: str) -> str:
        """Create access token for user."""
        return create_access_token(data={"sub": user_id})
