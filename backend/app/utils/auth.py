"""
Authentication utilities for password hashing and JWT token generation
"""
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config.settings import settings


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _prehash_password(password: str) -> str:
    """
    Pre-hash password with SHA-256 to handle passwords longer than bcrypt's 72-byte limit.
    This ensures compatibility with longer passwords while maintaining security.
    
    Args:
        password: Plain text password
        
    Returns:
        SHA-256 hashed password (64 bytes, hex encoded to 128 characters)
    """
    # Encode password to bytes and hash with SHA-256
    password_bytes = password.encode('utf-8')
    sha256_hash = hashlib.sha256(password_bytes).hexdigest()
    return sha256_hash


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt with SHA-256 pre-hashing.
    Pre-hashing ensures passwords longer than 72 bytes can be handled.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    # Pre-hash with SHA-256 to handle long passwords
    prehashed = _prehash_password(password)
    # Then hash with bcrypt (the prehashed value is always 64 bytes, well within bcrypt's limit)
    return pwd_context.hash(prehashed)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash.
    Uses the same pre-hashing approach as hash_password for consistency.
    Also supports backward compatibility with passwords hashed without pre-hashing.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    # Try new method: pre-hash with SHA-256 before verification
    prehashed = _prehash_password(plain_password)
    if pwd_context.verify(prehashed, hashed_password):
        return True
    
    # Fallback: try old method (direct bcrypt) for backward compatibility
    # This handles passwords that were hashed before we added pre-hashing
    try:
        if pwd_context.verify(plain_password, hashed_password):
            return True
    except ValueError:
        # Password too long for direct bcrypt, which is fine - we already tried prehashed
        pass
    
    return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Dictionary containing token claims (e.g., user_id, email, role)
        expires_delta: Optional custom expiration time
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT access token
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        
        # Verify it's an access token
        if payload.get("type") != "access":
            return None
            
        return payload
    except JWTError:
        return None


def generate_refresh_token() -> str:
    """
    Generate a secure random refresh token
    
    Returns:
        Random token string suitable for use as refresh token
    """
    import secrets
    return secrets.token_urlsafe(32)

