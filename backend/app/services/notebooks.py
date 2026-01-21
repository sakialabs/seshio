"""Notebook service for CRUD operations"""
from typing import Optional
from datetime import datetime
from fastapi import HTTPException, status
from supabase import Client
from app.core.config import settings
from app.services.auth import auth_service


class NotebookService:
    """Service for handling notebook operations"""

    def __init__(self):
        """Initialize with Supabase client"""
        self.supabase: Client = auth_service.supabase

    async def create_notebook(self, user_id: str, name: str) -> dict:
        """
        Create a new notebook for a user
        
        Args:
            user_id: User UUID
            name: Notebook name
            
        Returns:
            Created notebook data
            
        Raises:
            HTTPException: If creation fails
            
        Requirements: 3.1
        """
        # Validate name is not empty
        if not name or not name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Notebook name cannot be empty"
            )
        
        try:
            now = datetime.utcnow().isoformat()
            response = self.supabase.table("notebooks").insert({
                "user_id": user_id,
                "name": name.strip(),
                "created_at": now,
                "updated_at": now
            }).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create notebook"
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create notebook: {str(e)}"
            )

    async def get_notebook(self, notebook_id: str, user_id: str) -> Optional[dict]:
        """
        Get a notebook by ID, ensuring user ownership
        
        Args:
            notebook_id: Notebook UUID
            user_id: User UUID (for ownership verification)
            
        Returns:
            Notebook data or None if not found
            
        Raises:
            HTTPException: If notebook not found or access denied
            
        Requirements: 3.3, 13.4
        """
        try:
            response = self.supabase.table("notebooks").select(
                "*"
            ).eq("id", notebook_id).eq("user_id", user_id).execute()
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Notebook not found"
                )
            
            return response.data[0]
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch notebook: {str(e)}"
            )

    async def list_notebooks(self, user_id: str) -> list[dict]:
        """
        List all notebooks for a user
        
        Args:
            user_id: User UUID
            
        Returns:
            List of notebook data dictionaries
            
        Requirements: 3.3
        """
        try:
            response = self.supabase.table("notebooks").select(
                "*"
            ).eq("user_id", user_id).order("created_at", desc=True).execute()
            
            return response.data if response.data else []
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to list notebooks: {str(e)}"
            )

    async def update_notebook(self, notebook_id: str, user_id: str, name: str) -> dict:
        """
        Update a notebook's name
        
        Args:
            notebook_id: Notebook UUID
            user_id: User UUID (for ownership verification)
            name: New notebook name
            
        Returns:
            Updated notebook data
            
        Raises:
            HTTPException: If notebook not found or access denied
        """
        # Validate name is not empty
        if not name or not name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Notebook name cannot be empty"
            )
        
        # Verify ownership first
        await self.get_notebook(notebook_id, user_id)
        
        try:
            response = self.supabase.table("notebooks").update({
                "name": name.strip(),
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", notebook_id).eq("user_id", user_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notebook not found"
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update notebook: {str(e)}"
            )

    async def delete_notebook(self, notebook_id: str, user_id: str) -> None:
        """
        Delete a notebook and all associated data
        
        Args:
            notebook_id: Notebook UUID
            user_id: User UUID (for ownership verification)
            
        Raises:
            HTTPException: If notebook not found or access denied
            
        Requirements: 3.5
        """
        # Verify ownership first
        await self.get_notebook(notebook_id, user_id)
        
        try:
            # Delete notebook (cascade will handle materials, chunks, conversations, etc.)
            response = self.supabase.table("notebooks").delete().eq(
                "id", notebook_id
            ).eq("user_id", user_id).execute()
            
            # Supabase doesn't return error for successful delete
            # If we got here, deletion was successful
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete notebook: {str(e)}"
            )

    async def get_notebook_with_counts(self, notebook_id: str, user_id: str) -> dict:
        """
        Get a notebook with material and message counts
        
        Args:
            notebook_id: Notebook UUID
            user_id: User UUID (for ownership verification)
            
        Returns:
            Notebook data with counts
        """
        notebook = await self.get_notebook(notebook_id, user_id)
        
        try:
            # Get material count
            materials_response = self.supabase.table("materials").select(
                "id", count="exact"
            ).eq("notebook_id", notebook_id).execute()
            material_count = materials_response.count if materials_response.count is not None else 0
            
            # Get message count
            messages_response = self.supabase.table("messages").select(
                "id", count="exact"
            ).eq("notebook_id", notebook_id).execute()
            message_count = messages_response.count if messages_response.count is not None else 0
            
            notebook["material_count"] = material_count
            notebook["message_count"] = message_count
            
            return notebook
            
        except Exception as e:
            # Return notebook without counts if counting fails
            notebook["material_count"] = 0
            notebook["message_count"] = 0
            return notebook

    async def get_materials(self, notebook_id: str) -> list[dict]:
        """
        Get all materials in a notebook
        
        Args:
            notebook_id: Notebook UUID
            
        Returns:
            List of material data dictionaries
            
        Requirements: 11.1
        """
        try:
            response = self.supabase.table("materials").select(
                "*"
            ).eq("notebook_id", notebook_id).order("created_at", desc=True).execute()
            
            return response.data if response.data else []
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch materials: {str(e)}"
            )

    async def get_conversations(self, notebook_id: str) -> list[dict]:
        """
        Get all conversations in a notebook with messages
        
        Args:
            notebook_id: Notebook UUID
            
        Returns:
            List of conversation data dictionaries with messages
            
        Requirements: 11.2
        """
        try:
            # Get conversations
            conversations_response = self.supabase.table("conversations").select(
                "*"
            ).eq("notebook_id", notebook_id).order("created_at", desc=True).execute()
            
            conversations = conversations_response.data if conversations_response.data else []
            
            # Get messages for each conversation
            for conversation in conversations:
                messages_response = self.supabase.table("messages").select(
                    "*"
                ).eq("conversation_id", conversation["id"]).order("created_at", desc=False).execute()
                
                conversation["messages"] = messages_response.data if messages_response.data else []
            
            return conversations
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch conversations: {str(e)}"
            )

    async def search_notebook(self, notebook_id: str, query: str) -> list[dict]:
        """
        Search within notebook materials and conversations
        
        Args:
            notebook_id: Notebook UUID
            query: Search query string
            
        Returns:
            List of search result dictionaries
            
        Requirements: 11.3
        """
        try:
            results = []
            query_lower = query.lower()
            
            # Search in materials (chunks)
            chunks_response = self.supabase.table("chunks").select(
                "id, content, created_at, material_id, materials(filename)"
            ).eq("materials.notebook_id", notebook_id).ilike("content", f"%{query}%").limit(20).execute()
            
            if chunks_response.data:
                for chunk in chunks_response.data:
                    # Create highlight with query context
                    content = chunk["content"]
                    content_lower = content.lower()
                    query_pos = content_lower.find(query_lower)
                    
                    if query_pos >= 0:
                        # Extract context around the query (50 chars before and after)
                        start = max(0, query_pos - 50)
                        end = min(len(content), query_pos + len(query) + 50)
                        highlight = content[start:end]
                        
                        # Add ellipsis if truncated
                        if start > 0:
                            highlight = "..." + highlight
                        if end < len(content):
                            highlight = highlight + "..."
                        
                        # Highlight the query term
                        highlight = highlight.replace(
                            query,
                            f"<mark>{query}</mark>",
                            1  # Only highlight first occurrence in excerpt
                        )
                        
                        material_filename = chunk.get("materials", {}).get("filename", "Unknown")
                        
                        results.append({
                            "id": chunk["id"],
                            "type": "material",
                            "title": material_filename,
                            "content": content[:200],  # First 200 chars
                            "highlight": highlight,
                            "created_at": chunk["created_at"]
                        })
            
            # Search in messages
            messages_response = self.supabase.table("messages").select(
                "id, content, created_at, conversation_id, conversations(notebook_id)"
            ).eq("conversations.notebook_id", notebook_id).ilike("content", f"%{query}%").limit(20).execute()
            
            if messages_response.data:
                for message in messages_response.data:
                    # Create highlight with query context
                    content = message["content"]
                    content_lower = content.lower()
                    query_pos = content_lower.find(query_lower)
                    
                    if query_pos >= 0:
                        # Extract context around the query
                        start = max(0, query_pos - 50)
                        end = min(len(content), query_pos + len(query) + 50)
                        highlight = content[start:end]
                        
                        # Add ellipsis if truncated
                        if start > 0:
                            highlight = "..." + highlight
                        if end < len(content):
                            highlight = highlight + "..."
                        
                        # Highlight the query term
                        highlight = highlight.replace(
                            query,
                            f"<mark>{query}</mark>",
                            1
                        )
                        
                        results.append({
                            "id": message["id"],
                            "type": "message",
                            "title": "Conversation message",
                            "content": content[:200],
                            "highlight": highlight,
                            "created_at": message["created_at"]
                        })
            
            # Sort by relevance (for now, just by date)
            results.sort(key=lambda x: x["created_at"], reverse=True)
            
            return results
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to search notebook: {str(e)}"
            )


# Singleton instance
notebook_service = NotebookService()
