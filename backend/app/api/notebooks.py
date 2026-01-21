"""Notebook API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schemas.notebook import (
    NotebookCreateRequest,
    NotebookUpdateRequest,
    NotebookResponse,
    NotebookListResponse
)
from app.schemas.material import (
    MaterialListResponse,
    MaterialResponse,
    MaterialUploadRequest,
    MaterialUploadResponse,
    ConversationListResponse,
    ConversationResponse,
    MessageResponse,
    SearchResponse,
    SearchResultResponse
)
from app.services.notebooks import notebook_service
from app.services.materials import material_service
from app.core.dependencies import get_current_user_id


router = APIRouter(prefix="/notebooks", tags=["notebooks"])


@router.post("", response_model=NotebookResponse, status_code=status.HTTP_201_CREATED)
async def create_notebook(
    request: NotebookCreateRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a new notebook
    
    Creates a notebook with the specified name for the authenticated user.
    
    **Requirements**: 3.1
    """
    notebook = await notebook_service.create_notebook(user_id, request.name)
    
    return NotebookResponse(
        id=str(notebook["id"]),
        user_id=str(notebook["user_id"]),
        name=notebook["name"],
        created_at=notebook["created_at"],
        updated_at=notebook["updated_at"]
    )


@router.get("", response_model=NotebookListResponse)
async def list_notebooks(
    user_id: str = Depends(get_current_user_id)
):
    """
    List all notebooks for the authenticated user
    
    Returns all notebooks owned by the current user, ordered by creation date (newest first).
    
    **Requirements**: 3.3
    """
    notebooks = await notebook_service.list_notebooks(user_id)
    
    notebook_responses = [
        NotebookResponse(
            id=str(nb["id"]),
            user_id=str(nb["user_id"]),
            name=nb["name"],
            created_at=nb["created_at"],
            updated_at=nb["updated_at"]
        )
        for nb in notebooks
    ]
    
    return NotebookListResponse(
        notebooks=notebook_responses,
        total=len(notebook_responses)
    )


@router.get("/{notebook_id}", response_model=NotebookResponse)
async def get_notebook(
    notebook_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get a specific notebook by ID
    
    Returns notebook details if the authenticated user owns the notebook.
    
    **Requirements**: 3.3, 13.4
    """
    notebook = await notebook_service.get_notebook_with_counts(notebook_id, user_id)
    
    return NotebookResponse(
        id=str(notebook["id"]),
        user_id=str(notebook["user_id"]),
        name=notebook["name"],
        created_at=notebook["created_at"],
        updated_at=notebook["updated_at"],
        material_count=notebook.get("material_count"),
        message_count=notebook.get("message_count")
    )


@router.patch("/{notebook_id}", response_model=NotebookResponse)
async def update_notebook(
    notebook_id: str,
    request: NotebookUpdateRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Update a notebook's name
    
    Updates the notebook name if the authenticated user owns the notebook.
    """
    notebook = await notebook_service.update_notebook(notebook_id, user_id, request.name)
    
    return NotebookResponse(
        id=str(notebook["id"]),
        user_id=str(notebook["user_id"]),
        name=notebook["name"],
        created_at=notebook["created_at"],
        updated_at=notebook["updated_at"]
    )


@router.delete("/{notebook_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notebook(
    notebook_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Delete a notebook and all associated data
    
    Deletes the notebook and all associated materials, chunks, conversations, and messages.
    This operation cannot be undone.
    
    **Requirements**: 3.5
    """
    await notebook_service.delete_notebook(notebook_id, user_id)
    return None


@router.get("/{notebook_id}/materials", response_model=MaterialListResponse)
async def get_notebook_materials(
    notebook_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get all materials in a notebook
    
    Returns all materials uploaded to the notebook with their processing status.
    
    **Requirements**: 11.1
    """
    # Verify notebook ownership
    await notebook_service.get_notebook(notebook_id, user_id)
    
    materials = await notebook_service.get_materials(notebook_id)
    
    material_responses = [
        MaterialResponse(
            id=str(m["id"]),
            notebook_id=str(m["notebook_id"]),
            filename=m["filename"],
            file_path=m["file_path"],
            file_size=m["file_size"],
            mime_type=m["mime_type"],
            processing_status=m["processing_status"],
            created_at=m["created_at"]
        )
        for m in materials
    ]
    
    return MaterialListResponse(
        materials=material_responses,
        total=len(material_responses)
    )


@router.post("/{notebook_id}/materials", response_model=MaterialUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_material(
    notebook_id: str,
    request: MaterialUploadRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a material record after file upload
    
    This endpoint is called after the file has been uploaded to Supabase Storage.
    It creates a material record with status 'pending' and returns the material ID.
    
    **Requirements**: 4.1, 4.2, 4.3
    """
    # Verify notebook ownership
    await notebook_service.get_notebook(notebook_id, user_id)
    
    # Create material record
    material = await material_service.create_material(
        notebook_id=notebook_id,
        material_id=request.material_id,
        filename=request.filename,
        file_path=request.file_path,
        file_size=request.file_size,
        mime_type=request.mime_type
    )
    
    return MaterialUploadResponse(
        materialId=str(material["id"]),
        filename=material["filename"],
        processingStatus=material["processing_status"]
    )


@router.get("/{notebook_id}/conversations", response_model=ConversationListResponse)
async def get_notebook_conversations(
    notebook_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get all conversations in a notebook
    
    Returns all conversations with their messages in chronological order.
    
    **Requirements**: 11.2
    """
    # Verify notebook ownership
    await notebook_service.get_notebook(notebook_id, user_id)
    
    conversations = await notebook_service.get_conversations(notebook_id)
    
    conversation_responses = [
        ConversationResponse(
            id=str(c["id"]),
            notebook_id=str(c["notebook_id"]),
            created_at=c["created_at"],
            messages=[
                MessageResponse(
                    id=str(m["id"]),
                    conversation_id=str(m["conversation_id"]),
                    role=m["role"],
                    content=m["content"],
                    citations=m.get("citations"),
                    grounding_score=m.get("grounding_score"),
                    created_at=m["created_at"]
                )
                for m in c.get("messages", [])
            ]
        )
        for c in conversations
    ]
    
    return ConversationListResponse(
        conversations=conversation_responses,
        total=len(conversation_responses)
    )


@router.get("/{notebook_id}/search", response_model=SearchResponse)
async def search_notebook(
    notebook_id: str,
    q: str = Query(..., min_length=1, description="Search query"),
    user_id: str = Depends(get_current_user_id)
):
    """
    Search within notebook materials and conversations
    
    Searches through material content and conversation messages for the query string.
    Returns matching results with highlighted excerpts.
    
    **Requirements**: 11.3
    """
    # Verify notebook ownership
    await notebook_service.get_notebook(notebook_id, user_id)
    
    results = await notebook_service.search_notebook(notebook_id, q)
    
    search_results = [
        SearchResultResponse(
            id=str(r["id"]),
            type=r["type"],
            title=r["title"],
            content=r["content"],
            highlight=r["highlight"],
            created_at=r["created_at"]
        )
        for r in results
    ]
    
    return SearchResponse(
        results=search_results,
        total=len(search_results),
        query=q
    )
