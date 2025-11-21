"""
Authentication routes for login, signup, refresh, and logout
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import User, Doctor, Patient, RefreshToken
from app.schemas.auth import (
    SignUpRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
)
from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    generate_refresh_token,
)
from app.config.settings import settings


router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


def hash_token(token: str) -> str:
    """Hash a refresh token for storage"""
    import hashlib
    return hashlib.sha256(token.encode()).hexdigest()


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    signup_data: SignUpRequest,
    response: Response,
    request: Request
):
    """
    User signup endpoint
    
    Creates a new user account and returns access + refresh tokens.
    For doctors and patients, also creates the respective profile.
    """
    # Check if user with email already exists
    existing_user = await User.find_one(User.email == signup_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = await User.find_one(User.username == signup_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Validate role
    if signup_data.role not in ["patient", "doctor"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'patient' or 'doctor'"
        )
    
    # Hash password
    password_hash = hash_password(signup_data.password)
    
    # Create user
    user = User(
        email=signup_data.email,
        username=signup_data.username,
        full_name=signup_data.full_name,
        password_hash=password_hash,
        role=signup_data.role,
        is_active=True,
        is_verified=False,  # Can implement email verification later
    )
    await user.insert()
    
    # Create role-specific profile
    if signup_data.role == "doctor":
        doctor_profile = Doctor(
            user=user,
            specialty="",  # Can be filled later
            hospital="",
            experience_years=0,
            accepting_new_patients=True,
        )
        await doctor_profile.insert()
    elif signup_data.role == "patient":
        patient_profile = Patient(
            user=user,
            status="active",
        )
        await patient_profile.insert()
    
    # Generate tokens
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "username": user.username,
        }
    )
    
    # Generate and store refresh token
    refresh_token = generate_refresh_token()
    refresh_token_hash = hash_token(refresh_token)
    
    # Get client IP and user agent for security tracking
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    refresh_token_doc = RefreshToken(
        user=user,
        token_hash=refresh_token_hash,
        ip_address=client_ip,
        device_info=user_agent,
    )
    await refresh_token_doc.insert()
    
    # Set refresh token as httpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,  # seconds
        httponly=True,
        secure=not settings.debug,  # Only secure in production
        samesite="lax",
        path="/",  # Available to all routes
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
        user={
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat(),
        }
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    response: Response,
    request: Request
):
    """
    User login endpoint
    
    Authenticates user credentials and returns access + refresh tokens.
    Works for both doctors and patients.
    """
    # Find user by email
    user = await User.find_one(User.email == login_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Generate access token
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "username": user.username,
        }
    )
    
    # Generate and store refresh token
    refresh_token = generate_refresh_token()
    refresh_token_hash = hash_token(refresh_token)
    
    # Get client IP and user agent for security tracking
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    refresh_token_doc = RefreshToken(
        user=user,
        token_hash=refresh_token_hash,
        ip_address=client_ip,
        device_info=user_agent,
    )
    await refresh_token_doc.insert()
    
    # Set refresh token as httpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,  # seconds
        httponly=True,
        secure=not settings.debug,  # Only secure in production
        samesite="lax",
        path="/",  # Available to all routes
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
        user={
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat(),
        }
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    response: Response,
    request: Request
):
    """
    Refresh access token endpoint
    
    Uses the httpOnly refresh token cookie to issue a new access token.
    Also implements refresh token rotation for security.
    """
    # Get refresh token from cookie
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found"
        )
    
    # Hash the token to look it up
    refresh_token_hash = hash_token(refresh_token)
    
    # Find refresh token in database
    refresh_token_doc = await RefreshToken.find_one(
        RefreshToken.token_hash == refresh_token_hash
    )
    
    if not refresh_token_doc or not refresh_token_doc.is_valid():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Get user
    await refresh_token_doc.fetch_link(RefreshToken.user)
    user = refresh_token_doc.user
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Revoke old refresh token (rotation)
    refresh_token_doc.is_revoked = True
    refresh_token_doc.last_used_at = datetime.utcnow()  # Track usage
    await refresh_token_doc.save()
    
    # Generate new access token
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "username": user.username,
        }
    )
    
    # Generate new refresh token (rotation)
    new_refresh_token = generate_refresh_token()
    new_refresh_token_hash = hash_token(new_refresh_token)
    
    # Get client IP and user agent
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    new_refresh_token_doc = RefreshToken(
        user=user,
        token_hash=new_refresh_token_hash,
        ip_address=client_ip,
        device_info=user_agent,
    )
    await new_refresh_token_doc.insert()
    
    # Set new refresh token cookie
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        httponly=True,
        secure=not settings.debug,
        samesite="lax",
        path="/",  # Available to all routes
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
        user={
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat(),
        }
    )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    response: Response,
    request: Request
):
    """
    Logout endpoint
    
    Revokes the refresh token and clears the cookie.
    """
    # Get refresh token from cookie
    refresh_token = request.cookies.get("refresh_token")
    
    if refresh_token:
        # Hash and revoke the token
        refresh_token_hash = hash_token(refresh_token)
        refresh_token_doc = await RefreshToken.find_one(
            RefreshToken.token_hash == refresh_token_hash
        )
        
        if refresh_token_doc:
            refresh_token_doc.is_revoked = True
            await refresh_token_doc.save()
    
    # Clear the cookie
    response.delete_cookie(
        key="refresh_token",
        path="/",
        samesite="lax",
    )
    
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get current user information
    
    Requires valid access token in Authorization header.
    """
    # Decode access token
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Get user ID from token
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Fetch user
    user = await User.get(user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    return UserResponse(
        id=str(user.id),
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified,
        created_at=user.created_at.isoformat(),
    )

