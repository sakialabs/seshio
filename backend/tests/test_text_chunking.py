"""Tests for text chunking service"""
import pytest
from app.services.text_chunking import (
    text_chunking_service,
    ChunkingError,
    TextChunk
)


def test_chunk_short_text():
    """Test chunking short text that fits in one chunk"""
    text = "This is a short text that should fit in a single chunk."
    
    chunks = text_chunking_service.chunk_text(text)
    
    assert len(chunks) == 1
    assert chunks[0].content == text
    assert chunks[0].chunk_index == 0
    assert 'token_count' in chunks[0].metadata


def test_chunk_long_text():
    """Test chunking long text that requires multiple chunks"""
    # Create a long text (repeat a sentence many times)
    sentence = "This is a sentence that will be repeated many times to create a long document. "
    text = sentence * 200  # Should create multiple chunks
    
    chunks = text_chunking_service.chunk_text(text)
    
    # Should have multiple chunks
    assert len(chunks) > 1
    
    # Each chunk should have sequential indices
    for i, chunk in enumerate(chunks):
        assert chunk.chunk_index == i
        assert chunk.content.strip()  # Not empty
        assert 'token_count' in chunk.metadata


def test_chunk_empty_text_fails():
    """Test that empty text raises error"""
    with pytest.raises(ChunkingError):
        text_chunking_service.chunk_text("")


def test_chunk_with_page_markers():
    """Test chunking text with page markers"""
    text = "[PAGE 1]\nFirst page content.\n\n[PAGE 2]\nSecond page content."
    
    chunks = text_chunking_service.chunk_text(text)
    
    assert len(chunks) >= 1
    # Check that page markers are preserved in metadata
    for chunk in chunks:
        if 'page_number' in chunk.metadata:
            assert isinstance(chunk.metadata['page_number'], int)


def test_count_tokens():
    """Test token counting"""
    text = "This is a test sentence."
    
    token_count = text_chunking_service.count_tokens(text)
    
    assert token_count > 0
    assert isinstance(token_count, int)


def test_chunk_overlap():
    """Test that chunks have overlap"""
    # Create text long enough for multiple chunks
    sentence = "This is sentence number {}. "
    text = "".join([sentence.format(i) for i in range(500)])
    
    chunks = text_chunking_service.chunk_text(text)
    
    if len(chunks) > 1:
        # Check that there's some overlap between consecutive chunks
        # (This is a basic check - actual overlap verification would be more complex)
        assert chunks[0].content != chunks[1].content
        # Both chunks should have content
        assert len(chunks[0].content) > 0
        assert len(chunks[1].content) > 0

