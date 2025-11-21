"""
Authentication dependencies for protected routes

This module provides FastAPI dependencies for:
- Token verification and user authentication
- Role-based access control (doctor, patient, admin)
- Shared access for routes accessible by multiple roles
"""
from typing import Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import User
from app.utils.auth import decode_access_token


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """
    Dependency to get the current authenticated user
    
    Verifies the JWT access token, extracts user ID, and fetches the user
    from the database. This ensures the user still exists and is active.
    
    Args:
        credentials: HTTP Bearer token from Authorization header
        
    Returns:
        User: The authenticated user object
        
    Raises:
        HTTPException: 
            - 401 if token is invalid, expired, or user not found
            - 403 if user account is inactive
    """
    # Decode access token
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user ID from token
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database (ensures user still exists and role is current)
    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify user account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    
    return user


async def get_current_doctor(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure the current user is a doctor
    
    This middleware verifies that the authenticated user has the "doctor" role.
    Patients attempting to access doctor-only routes will receive a 403 error.
    
    Args:
        current_user: The authenticated user from get_current_user
        
    Returns:
        User: The authenticated doctor user
        
    Raises:
        HTTPException: 403 if user is not a doctor
    """
    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to doctors only"
        )
    
    return current_user


async def get_current_patient(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure the current user is a patient
    
    This middleware verifies that the authenticated user has the "patient" role.
    Doctors attempting to access patient-only routes will receive a 403 error.
    
    Args:
        current_user: The authenticated user from get_current_user
        
    Returns:
        User: The authenticated patient user
        
    Raises:
        HTTPException: 403 if user is not a patient
    """
    if current_user.role != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to patients only"
        )
    
    return current_user


async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure the current user is an admin
    
    This middleware verifies that the authenticated user has the "admin" role.
    
    Args:
        current_user: The authenticated user from get_current_user
        
    Returns:
        User: The authenticated admin user
        
    Raises:
        HTTPException: 403 if user is not an admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to administrators only"
        )
    
    return current_user


def require_roles(allowed_roles: List[str]):
    """
    Factory function to create a dependency that allows multiple roles
    
    Use this for routes that should be accessible by multiple user roles
    (e.g., both doctors and patients can access notifications).
    
    Args:
        allowed_roles: List of role names that can access the route
        
    Returns:
        Dependency function that checks if user role is in allowed_roles
        
    Example:
        @router.get("/notifications")
        async def get_notifications(
            current_user: User = Depends(require_roles(["doctor", "patient"]))
        ):
            ...
    """
    async def role_checker(
        current_user: User = Depends(get_current_user)
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access restricted to: {', '.join(allowed_roles)}"
            )
        return current_user
    
    return role_checker

