from fastapi import APIRouter, HTTPException, status
from app.schemas.user import UserCreate, UserResponse, Token
from app.modules.auth.service import AuthService
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])
auth_service = AuthService()


class LoginRequest(BaseModel):
    """Login request schema."""

    email: str
    password: str


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user."""
    try:
        user = await auth_service.register_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=Token)
async def login(request: LoginRequest):
    """Authenticate user and return JWT token."""
    user = await auth_service.authenticate_user(request.email, request.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = auth_service.create_token(str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}
