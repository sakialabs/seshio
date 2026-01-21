"""Authentication API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from app.schemas.auth import (
    SignUpRequest,
    SignInRequest,
    AuthResponse,
    UserResponse,
    UpdateArchetypeRequest,
    PasswordResetRequest,
    TokenRefreshRequest
)
from app.services.auth import auth_service
from app.core.dependencies import get_current_user_id, get_current_user


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def sign_up(request: SignUpRequest):
    """
    Create a new user account
    
    Validates password complexity and creates user in Supabase Auth.
    The user record in public.users table is created automatically via trigger.
    
    **Requirements**: 1.1, 1.2, 13.3
    """
    # Validate password complexity
    is_valid, error_message = auth_service.validate_password_complexity(request.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message
        )
    
    try:
        # Sign up with Supabase
        response = auth_service.supabase.auth.sign_up({
            "email": request.email,
            "password": request.password
        })
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account"
            )
        
        # Get user data
        user_data = await auth_service.get_user(response.user.id)
        
        return AuthResponse(
            access_token=response.session.access_token,
            token_type="bearer",
            expires_in=response.session.expires_in or 3600,
            refresh_token=response.session.refresh_token,
            user=UserResponse(
                id=response.user.id,
                email=response.user.email,
                archetype=user_data.get("archetype") if user_data else None,
                created_at=response.user.created_at
            )
        )
        
    except HTTPException:
        raise
    except Exception as e:
        # Handle Supabase errors
        error_message = str(e)
        if "already registered" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create account: {error_message}"
        )


@router.post("/signin", response_model=AuthResponse)
async def sign_in(request: SignInRequest):
    """
    Sign in with email and password
    
    Authenticates user and returns JWT tokens.
    
    **Requirements**: 1.2, 1.3
    """
    try:
        # Sign in with Supabase
        response = auth_service.supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if not response.user or not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Get user data
        user_data = await auth_service.get_user(response.user.id)
        
        return AuthResponse(
            access_token=response.session.access_token,
            token_type="bearer",
            expires_in=response.session.expires_in or 3600,
            refresh_token=response.session.refresh_token,
            user=UserResponse(
                id=response.user.id,
                email=response.user.email,
                archetype=user_data.get("archetype") if user_data else None,
                created_at=response.user.created_at
            )
        )
        
    except HTTPException:
        raise
    except Exception as e:
        error_message = str(e)
        if "invalid" in error_message.lower() or "credentials" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed"
        )


@router.post("/signout")
async def sign_out(user_id: str = Depends(get_current_user_id)):
    """
    Sign out current user
    
    Invalidates the current session.
    
    **Requirements**: 1.5
    """
    try:
        auth_service.supabase.auth.sign_out()
        return {"message": "Successfully signed out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sign out: {str(e)}"
        )


@router.post("/refresh", response_model=AuthResponse)
async def refresh_token(request: TokenRefreshRequest):
    """
    Refresh access token using refresh token
    
    **Requirements**: 1.4
    """
    try:
        response = auth_service.supabase.auth.refresh_session(request.refresh_token)
        
        if not response.user or not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Get user data
        user_data = await auth_service.get_user(response.user.id)
        
        return AuthResponse(
            access_token=response.session.access_token,
            token_type="bearer",
            expires_in=response.session.expires_in or 3600,
            refresh_token=response.session.refresh_token,
            user=UserResponse(
                id=response.user.id,
                email=response.user.email,
                archetype=user_data.get("archetype") if user_data else None,
                created_at=response.user.created_at
            )
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to refresh token"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(user: dict = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    **Requirements**: 1.4
    """
    return UserResponse(
        id=user["id"],
        email=user["email"],
        archetype=user.get("archetype"),
        created_at=user["created_at"]
    )


@router.patch("/me/archetype", response_model=UserResponse)
async def update_archetype(
    request: UpdateArchetypeRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Update user's archetype preference
    
    **Requirements**: 2.3, 2.5
    """
    updated_user = await auth_service.update_user_archetype(user_id, request.archetype)
    
    return UserResponse(
        id=updated_user["id"],
        email=updated_user["email"],
        archetype=updated_user["archetype"],
        created_at=updated_user["created_at"]
    )


@router.post("/password-reset")
async def request_password_reset(request: PasswordResetRequest):
    """
    Request password reset email
    
    **Requirements**: 14.3
    """
    try:
        auth_service.supabase.auth.reset_password_email(request.email)
        return {"message": "Password reset email sent if account exists"}
    except Exception as e:
        # Don't reveal if email exists
        return {"message": "Password reset email sent if account exists"}
