"""Authorization helpers for checking resource ownership"""
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.notebook import Notebook
from app.models.material import Material


class AuthorizationService:
    """Service for authorization checks"""

    @staticmethod
    async def check_notebook_ownership(
        db: AsyncSession,
        notebook_id: str,
        user_id: str
    ) -> Notebook:
        """
        Verify that a notebook belongs to the specified user
        
        Args:
            db: Database session
            notebook_id: Notebook UUID
            user_id: User UUID
            
        Returns:
            Notebook object if ownership verified
            
        Raises:
            HTTPException: If notebook not found or user doesn't own it
        """
        result = await db.execute(
            select(Notebook).where(Notebook.id == notebook_id)
        )
        notebook = result.scalar_one_or_none()
        
        if not notebook:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notebook not found"
            )
        
        if str(notebook.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this notebook"
            )
        
        return notebook

    @staticmethod
    async def check_material_ownership(
        db: AsyncSession,
        material_id: str,
        user_id: str
    ) -> Material:
        """
        Verify that a material belongs to the specified user (via notebook)
        
        Args:
            db: Database session
            material_id: Material UUID
            user_id: User UUID
            
        Returns:
            Material object if ownership verified
            
        Raises:
            HTTPException: If material not found or user doesn't own it
        """
        result = await db.execute(
            select(Material)
            .join(Notebook, Material.notebook_id == Notebook.id)
            .where(Material.id == material_id)
        )
        material = result.scalar_one_or_none()
        
        if not material:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Material not found"
            )
        
        # Check notebook ownership
        notebook_result = await db.execute(
            select(Notebook).where(Notebook.id == material.notebook_id)
        )
        notebook = notebook_result.scalar_one_or_none()
        
        if not notebook or str(notebook.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this material"
            )
        
        return material

    @staticmethod
    async def check_conversation_ownership(
        db: AsyncSession,
        conversation_id: str,
        user_id: str
    ) -> bool:
        """
        Verify that a conversation belongs to the specified user (via notebook)
        
        Args:
            db: Database session
            conversation_id: Conversation UUID
            user_id: User UUID
            
        Returns:
            True if ownership verified
            
        Raises:
            HTTPException: If conversation not found or user doesn't own it
        """
        from app.models.conversation import Conversation
        
        result = await db.execute(
            select(Conversation)
            .join(Notebook, Conversation.notebook_id == Notebook.id)
            .where(Conversation.id == conversation_id)
        )
        conversation = result.scalar_one_or_none()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        # Check notebook ownership
        notebook_result = await db.execute(
            select(Notebook).where(Notebook.id == conversation.notebook_id)
        )
        notebook = notebook_result.scalar_one_or_none()
        
        if not notebook or str(notebook.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this conversation"
            )
        
        return True

    @staticmethod
    async def check_study_session_ownership(
        db: AsyncSession,
        session_id: str,
        user_id: str
    ) -> bool:
        """
        Verify that a study session belongs to the specified user (via notebook)
        
        Args:
            db: Database session
            session_id: Study session UUID
            user_id: User UUID
            
        Returns:
            True if ownership verified
            
        Raises:
            HTTPException: If session not found or user doesn't own it
        """
        from app.models.study_session import StudySession
        
        result = await db.execute(
            select(StudySession)
            .join(Notebook, StudySession.notebook_id == Notebook.id)
            .where(StudySession.id == session_id)
        )
        session = result.scalar_one_or_none()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Study session not found"
            )
        
        # Check notebook ownership
        notebook_result = await db.execute(
            select(Notebook).where(Notebook.id == session.notebook_id)
        )
        notebook = notebook_result.scalar_one_or_none()
        
        if not notebook or str(notebook.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this study session"
            )
        
        return True


# Singleton instance
authorization_service = AuthorizationService()
