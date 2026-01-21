"""Text extraction service for various document formats"""
import io
import logging
from typing import Optional, Dict, Any
from pathlib import Path

try:
    from PyPDF2 import PdfReader
except ImportError:
    PdfReader = None

try:
    from docx import Document
except ImportError:
    Document = None


logger = logging.getLogger(__name__)


class TextExtractionError(Exception):
    """Base exception for text extraction errors"""
    pass


class UnsupportedFormatError(TextExtractionError):
    """Raised when file format is not supported"""
    pass


class ExtractionFailedError(TextExtractionError):
    """Raised when extraction fails"""
    pass


class TextExtractionService:
    """Service for extracting text from various document formats"""

    def extract_text(
        self,
        file_content: bytes,
        mime_type: str,
        filename: str
    ) -> tuple[str, Dict[str, Any]]:
        """
        Extract text from file content based on MIME type
        
        Args:
            file_content: Raw file bytes
            mime_type: MIME type of the file
            filename: Original filename (used for extension fallback)
            
        Returns:
            Tuple of (extracted_text, metadata)
            metadata includes: page_count, format, etc.
            
        Raises:
            UnsupportedFormatError: If file format is not supported
            ExtractionFailedError: If extraction fails
            
        Requirements: 4.4
        """
        try:
            # Determine extraction method based on MIME type
            if mime_type == 'application/pdf' or filename.lower().endswith('.pdf'):
                return self._extract_pdf(file_content)
            elif mime_type in ['text/plain', 'text/markdown'] or filename.lower().endswith(('.txt', '.md')):
                return self._extract_text(file_content)
            elif mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or filename.lower().endswith('.docx'):
                return self._extract_docx(file_content)
            else:
                raise UnsupportedFormatError(
                    f"Unsupported file format: {mime_type} ({filename})"
                )
        except UnsupportedFormatError:
            raise
        except Exception as e:
            logger.error(f"Text extraction failed for {filename}: {str(e)}")
            raise ExtractionFailedError(
                f"Failed to extract text from {filename}: {str(e)}"
            )

    def _extract_pdf(self, file_content: bytes) -> tuple[str, Dict[str, Any]]:
        """
        Extract text from PDF file
        
        Args:
            file_content: PDF file bytes
            
        Returns:
            Tuple of (extracted_text, metadata)
            
        Raises:
            ExtractionFailedError: If PDF extraction fails
        """
        if PdfReader is None:
            raise ExtractionFailedError(
                "PyPDF2 is not installed. Cannot extract PDF text."
            )
        
        try:
            pdf_file = io.BytesIO(file_content)
            reader = PdfReader(pdf_file)
            
            # Extract text from all pages
            text_parts = []
            page_count = len(reader.pages)
            
            for page_num, page in enumerate(reader.pages, start=1):
                try:
                    page_text = page.extract_text()
                    if page_text and page_text.strip():
                        # Add page marker for metadata preservation
                        text_parts.append(f"[PAGE {page_num}]\n{page_text}")
                except Exception as page_error:
                    logger.warning(f"Failed to extract text from page {page_num}: {page_error}")
                    continue
            
            if not text_parts:
                raise ExtractionFailedError("No text could be extracted from PDF")
            
            full_text = "\n\n".join(text_parts)
            
            metadata = {
                "format": "pdf",
                "page_count": page_count,
                "extracted_pages": len(text_parts)
            }
            
            return full_text, metadata
            
        except ExtractionFailedError:
            raise
        except Exception as e:
            raise ExtractionFailedError(f"PDF extraction failed: {str(e)}")

    def _extract_text(self, file_content: bytes) -> tuple[str, Dict[str, Any]]:
        """
        Extract text from plain text file
        
        Args:
            file_content: Text file bytes
            
        Returns:
            Tuple of (extracted_text, metadata)
            
        Raises:
            ExtractionFailedError: If text extraction fails
        """
        try:
            # Try UTF-8 first, then fall back to other encodings
            encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    text = file_content.decode(encoding)
                    
                    if not text.strip():
                        raise ExtractionFailedError("File is empty or contains no text")
                    
                    metadata = {
                        "format": "text",
                        "encoding": encoding,
                        "char_count": len(text)
                    }
                    
                    return text, metadata
                    
                except UnicodeDecodeError:
                    continue
            
            raise ExtractionFailedError(
                "Could not decode text file with any supported encoding"
            )
            
        except ExtractionFailedError:
            raise
        except Exception as e:
            raise ExtractionFailedError(f"Text extraction failed: {str(e)}")

    def _extract_docx(self, file_content: bytes) -> tuple[str, Dict[str, Any]]:
        """
        Extract text from DOCX file
        
        Args:
            file_content: DOCX file bytes
            
        Returns:
            Tuple of (extracted_text, metadata)
            
        Raises:
            ExtractionFailedError: If DOCX extraction fails
        """
        if Document is None:
            raise ExtractionFailedError(
                "python-docx is not installed. Cannot extract DOCX text."
            )
        
        try:
            docx_file = io.BytesIO(file_content)
            doc = Document(docx_file)
            
            # Extract text from all paragraphs
            text_parts = []
            paragraph_count = 0
            
            for para in doc.paragraphs:
                para_text = para.text.strip()
                if para_text:
                    text_parts.append(para_text)
                    paragraph_count += 1
            
            if not text_parts:
                raise ExtractionFailedError("No text could be extracted from DOCX")
            
            full_text = "\n\n".join(text_parts)
            
            metadata = {
                "format": "docx",
                "paragraph_count": paragraph_count
            }
            
            return full_text, metadata
            
        except ExtractionFailedError:
            raise
        except Exception as e:
            raise ExtractionFailedError(f"DOCX extraction failed: {str(e)}")


# Singleton instance
text_extraction_service = TextExtractionService()

