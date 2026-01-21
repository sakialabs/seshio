"""Material service for upload and management operations"""
import logging
from typing import Optional
from datetime import datetime
from fastapi import HTTPException, status
from supabase import Client
from app.core.config import settings
from app.services.auth import auth_service


logger = logging.getLogger(__name__)


class MaterialService:
    """Service for handling material operations"""

    def __init__(self):
        """Initialize with Supabase client"""
        self.supabase: Client = auth_service.supabase

    async def create_material(
        self,
        notebook_id: str,
        material_id: str,
        filename: str,
        file_path: str,
        file_size: int,
        mime_type: str
    ) -> dict:
        """
        Create a material record after file upload and trigger processing
        
        Args:
            notebook_id: Notebook UUID
            material_id: Material UUID (pre-generated)
            filename: Original filename
            file_path: Supabase storage path
            file_size: File size in bytes
            mime_type: MIME type of the file
            
        Returns:
            Created material data
            
        Raises:
            HTTPException: If creation fails
            
        Requirements: 4.1, 4.2, 4.3
        """
        # Validate file size
        max_size = settings.MAX_FILE_SIZE_MB * 1024 * 1024
        if file_size > max_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds {settings.MAX_FILE_SIZE_MB}MB limit"
            )
        
        # Validate file type
        allowed_types = [
            'application/pdf',
            'text/plain',
            'text/markdown',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        if mime_type not in allowed_types:
            # Check file extension as fallback
            file_ext = filename.split('.')[-1].lower()
            if file_ext not in settings.allowed_file_types_list:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File type not supported. Allowed types: {', '.join(settings.allowed_file_types_list)}"
                )
        
        try:
            now = datetime.utcnow().isoformat()
            response = self.supabase.table("materials").insert({
                "id": material_id,
                "notebook_id": notebook_id,
                "filename": filename,
                "file_path": file_path,
                "file_size": file_size,
                "mime_type": mime_type,
                "processing_status": "pending",
                "created_at": now
            }).execute()
            
            if response.data and len(response.data) > 0:
                material = response.data[0]
                
                # Trigger background processing task (lazy import to avoid circular dependency)
                try:
                    from app.tasks.material_processing import process_material
                    process_material.delay(material_id)
                    logger.info(f"Triggered background processing for material {material_id}")
                except Exception as task_error:
                    logger.error(f"Failed to trigger background task: {task_error}")
                    # Don't fail the request - material is created, processing can be retried
                
                return material
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create material record"
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create material: {str(e)}"
            )

    async def get_material(self, material_id: str, user_id: str) -> dict:
        """
        Get a material by ID, ensuring user ownership
        
        Args:
            material_id: Material UUID
            user_id: User UUID (for ownership verification)
            
        Returns:
            Material data
            
        Raises:
            HTTPException: If material not found or access denied
            
        Requirements: 11.1, 13.4
        """
        try:
            # Get material with notebook info
            response = self.supabase.table("materials").select(
                "*, notebooks(user_id)"
            ).eq("id", material_id).execute()
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Material not found"
                )
            
            material = response.data[0]
            
            # Verify ownership
            if material.get("notebooks", {}).get("user_id") != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied"
                )
            
            return material
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch material: {str(e)}"
            )

    async def get_material_status(self, material_id: str, user_id: str) -> dict:
        """
        Get material processing status
        
        Args:
            material_id: Material UUID
            user_id: User UUID (for ownership verification)
            
        Returns:
            Material status data
            
        Requirements: 4.9
        """
        material = await self.get_material(material_id, user_id)
        
        return {
            "id": material["id"],
            "processing_status": material["processing_status"],
            "filename": material["filename"]
        }

    async def update_material_status(
        self,
        material_id: str,
        status: str
    ) -> dict:
        """
        Update material processing status
        
        Args:
            material_id: Material UUID
            status: New processing status (pending, processing, completed, failed)
            
        Returns:
            Updated material data
            
        Requirements: 4.8
        """
        try:
            response = self.supabase.table("materials").update({
                "processing_status": status
            }).eq("id", material_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Material not found"
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update material status: {str(e)}"
            )

    async def delete_material(self, material_id: str, user_id: str) -> None:
        """
        Delete a material and its file from storage
        
        Args:
            material_id: Material UUID
            user_id: User UUID (for ownership verification)
            
        Raises:
            HTTPException: If material not found or access denied
            
        Requirements: 11.5
        """
        # Verify ownership first
        material = await self.get_material(material_id, user_id)
        
        try:
            # Delete file from storage
            file_path = material["file_path"]
            try:
                self.supabase.storage.from_("materials").remove([file_path])
            except Exception as storage_error:
                # Log error but continue with database deletion
                print(f"Warning: Failed to delete file from storage: {storage_error}")
            
            # Delete material record (cascade will handle chunks)
            response = self.supabase.table("materials").delete().eq(
                "id", material_id
            ).execute()
            
            # Supabase doesn't return error for successful delete
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete material: {str(e)}"
            )


# Singleton instance
material_service = MaterialService()
