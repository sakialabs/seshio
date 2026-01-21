"""FastAPI dependencies for authentication and authorization"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth import auth_service


# HTTP Bearer token security scheme
security = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Dependency to get current authenticated user ID from JWT token
    
    Args:
        credentials: HTTP Bearer credentials from request header
        
    Returns:
        User ID (UUID string)
        
    Raises:
        HTTPException: If authentication fails
    """
    token = credentials.credentials
    user_id = auth_service.get_user_id_from_token(token)
    return user_id


async def get_current_user(
    user_id: str = Depends(get_current_user_id)
) -> dict:
    """
    Dependency to get current authenticated user data
    
    Args:
        user_id: User ID from get_current_user_id dependency
        
    Returns:
        User data dictionary
        
    Raises:
        HTTPException: If user not found
    """
    user = await auth_service.get_user(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


async def get_optional_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[str]:
    """
    Dependency to optionally get user ID (doesn't raise error if not authenticated)
    
    Args:
        credentials: Optional HTTP Bearer credentials
        
    Returns:
        User ID if authenticated, None otherwise
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        return user_id
    except HTTPException:
        return None
