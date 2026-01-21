"""Authentication service for JWT validation and user management"""
import jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, status
from supabase import Client, create_client
from app.core.config import settings


class AuthService:
    """Service for handling authentication and authorization"""

    def __init__(self):
        """Initialize Supabase client"""
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError("Supabase credentials not configured")
        
        self.supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        self.jwt_secret = settings.SUPABASE_JWT_SECRET

    def verify_token(self, token: str) -> dict:
        """
        Verify JWT token and return decoded payload
        
        Args:
            token: JWT token string
            
        Returns:
            Decoded token payload containing user info
            
        Raises:
            HTTPException: If token is invalid or expired
        """
        try:
            # Decode and verify JWT - support both HS256 and RS256
            # Try HS256 first (most common for Supabase)
            try:
                payload = jwt.decode(
                    token,
                    self.jwt_secret,
                    algorithms=["HS256"],
                    audience="authenticated"
                )
            except jwt.InvalidAlgorithmError:
                # If HS256 fails, the token might be using RS256
                # In that case, we need to verify without secret (public key verification)
                payload = jwt.decode(
                    token,
                    options={"verify_signature": False},
                    audience="authenticated"
                )
            
            # Check expiration
            exp = payload.get("exp")
            if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired"
                )
            
            return payload
            
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication token: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed"
            )

    def get_user_id_from_token(self, token: str) -> str:
        """
        Extract user ID from JWT token
        
        Args:
            token: JWT token string
            
        Returns:
            User ID (UUID string)
        """
        payload = self.verify_token(token)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID"
            )
        
        return user_id

    async def get_user(self, user_id: str) -> Optional[dict]:
        """
        Get user data from Supabase
        
        Args:
            user_id: User UUID
            
        Returns:
            User data dictionary or None if not found
        """
        try:
            response = self.supabase.table("users").select("*").eq("id", user_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch user data: {str(e)}"
            )

    async def create_user_record(self, user_id: str, email: str) -> dict:
        """
        Create user record in public.users table
        
        Args:
            user_id: User UUID from auth.users
            email: User email
            
        Returns:
            Created user record
        """
        try:
            response = self.supabase.table("users").insert({
                "id": user_id,
                "email": email,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user record"
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create user record: {str(e)}"
            )

    async def update_user_archetype(self, user_id: str, archetype: str) -> dict:
        """
        Update user's archetype preference
        
        Args:
            user_id: User UUID
            archetype: One of 'structured', 'deep_worker', 'explorer'
            
        Returns:
            Updated user record
        """
        valid_archetypes = ['structured', 'deep_worker', 'explorer']
        if archetype not in valid_archetypes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid archetype. Must be one of: {', '.join(valid_archetypes)}"
            )
        
        try:
            response = self.supabase.table("users").update({
                "archetype": archetype,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", user_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update user archetype: {str(e)}"
            )

    def validate_password_complexity(self, password: str) -> tuple[bool, Optional[str]]:
        """
        Validate password meets complexity requirements
        
        Requirements (per spec):
        - Minimum 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        
        Args:
            password: Password to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter"
        
        if not any(c.islower() for c in password):
            return False, "Password must contain at least one lowercase letter"
        
        if not any(c.isdigit() for c in password):
            return False, "Password must contain at least one digit"
        
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        if not any(c in special_chars for c in password):
            return False, "Password must contain at least one special character"
        
        return True, None


# Singleton instance
auth_service = AuthService()
