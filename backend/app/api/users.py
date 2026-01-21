"""User management API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import UpdateArchetypeRequest, UserResponse
from app.services.auth import auth_service
from app.core.dependencies import get_current_user_id

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: str = Depends(get_current_user_id)):
    """
    Get current user information
    
    **Requirements**: 1.4
    """
    user_data = await auth_service.get_user(user_id)
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user_data["id"],
        email=user_data["email"],
        archetype=user_data.get("archetype"),
        created_at=user_data["created_at"]
    )


@router.patch("/me/archetype", response_model=UserResponse)
async def update_user_archetype(
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
