"""Tests for notebook API endpoints"""
import pytest


def test_notebook_service_imports():
    """Test that notebook service can be imported"""
    from app.services.notebooks import notebook_service
    assert notebook_service is not None


def test_notebook_schemas():
    """Test that notebook schemas are properly defined"""
    from app.schemas.notebook import (
        NotebookCreateRequest,
        NotebookUpdateRequest,
        NotebookResponse,
        NotebookListResponse
    )
    
    # Test create request validation
    create_req = NotebookCreateRequest(name="Test Notebook")
    assert create_req.name == "Test Notebook"
    
    # Test that empty name is rejected
    with pytest.raises(Exception):
        NotebookCreateRequest(name="")


def test_notebook_api_imports():
    """Test that notebook API router can be imported"""
    from app.api.notebooks import router
    assert router is not None
    assert router.prefix == "/notebooks"
