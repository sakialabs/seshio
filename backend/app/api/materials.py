"""Material API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.material import (
    MaterialUploadRequest,
    MaterialUploadResponse,
    MaterialStatusResponse,
    MaterialResponse
)
from app.services.materials import material_service
from app.core.dependencies import get_current_user_id


router = APIRouter(prefix="/materials", tags=["materials"])


@router.get("/{material_id}/status", response_model=MaterialStatusResponse)
async def get_material_status(
    material_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get material processing status
    
    Returns the current processing status of a material.
    
    **Requirements**: 4.9
    """
    material = await material_service.get_material_status(material_id, user_id)
    
    return MaterialStatusResponse(
        id=str(material["id"]),
        processing_status=material["processing_status"],
        filename=material["filename"]
    )


@router.get("/{material_id}", response_model=MaterialResponse)
async def get_material(
    material_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get material details
    
    Returns material metadata and processing status.
    
    **Requirements**: 11.1
    """
    material = await material_service.get_material(material_id, user_id)
    
    return MaterialResponse(
        id=str(material["id"]),
        notebook_id=str(material["notebook_id"]),
        filename=material["filename"],
        file_path=material["file_path"],
        file_size=material["file_size"],
        mime_type=material["mime_type"],
        processing_status=material["processing_status"],
        created_at=material["created_at"]
    )


@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_material(
    material_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Delete a material
    
    Deletes the material record and associated file from storage.
    
    **Requirements**: 11.5
    """
    await material_service.delete_material(material_id, user_id)
    return None
