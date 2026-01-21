"""Tests for text extraction service"""
import pytest
from app.services.text_extraction import (
    text_extraction_service,
    TextExtractionError,
    UnsupportedFormatError,
    ExtractionFailedError
)


def test_extract_plain_text():
    """Test extracting text from plain text file"""
    text_content = "This is a test document.\nIt has multiple lines.\n"
    file_bytes = text_content.encode('utf-8')
    
    extracted_text, metadata = text_extraction_service.extract_text(
        file_content=file_bytes,
        mime_type='text/plain',
        filename='test.txt'
    )
    
    assert extracted_text == text_content
    assert metadata['format'] == 'text'
    assert metadata['encoding'] == 'utf-8'


def test_extract_empty_text_fails():
    """Test that empty text file raises error"""
    file_bytes = b''
    
    with pytest.raises(ExtractionFailedError):
        text_extraction_service.extract_text(
            file_content=file_bytes,
            mime_type='text/plain',
            filename='empty.txt'
        )


def test_unsupported_format_fails():
    """Test that unsupported format raises error"""
    file_bytes = b'some content'
    
    with pytest.raises(UnsupportedFormatError):
        text_extraction_service.extract_text(
            file_content=file_bytes,
            mime_type='application/zip',
            filename='test.zip'
        )


def test_extract_markdown():
    """Test extracting text from markdown file"""
    markdown_content = "# Heading\n\nThis is **bold** text.\n"
    file_bytes = markdown_content.encode('utf-8')
    
    extracted_text, metadata = text_extraction_service.extract_text(
        file_content=file_bytes,
        mime_type='text/markdown',
        filename='test.md'
    )
    
    assert extracted_text == markdown_content
    assert metadata['format'] == 'text'

