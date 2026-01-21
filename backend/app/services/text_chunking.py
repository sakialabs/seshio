"""Text chunking service for creating retrievable segments"""
import re
import logging
from typing import List, Dict, Any, Optional
import tiktoken


logger = logging.getLogger(__name__)


class ChunkingError(Exception):
    """Base exception for chunking errors"""
    pass


class TextChunk:
    """Represents a text chunk with metadata"""
    
    def __init__(
        self,
        content: str,
        chunk_index: int,
        metadata: Optional[Dict[str, Any]] = None
    ):
        self.content = content
        self.chunk_index = chunk_index
        self.metadata = metadata or {}
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert chunk to dictionary"""
        return {
            "content": self.content,
            "chunk_index": self.chunk_index,
            "metadata": self.metadata
        }


class TextChunkingService:
    """Service for chunking text into retrievable segments"""
    
    def __init__(
        self,
        min_chunk_tokens: int = 500,
        max_chunk_tokens: int = 1000,
        overlap_tokens: int = 100,
        encoding_name: str = "cl100k_base"  # GPT-4 encoding
    ):
        """
        Initialize chunking service
        
        Args:
            min_chunk_tokens: Minimum tokens per chunk
            max_chunk_tokens: Maximum tokens per chunk
            overlap_tokens: Token overlap between chunks
            encoding_name: Tiktoken encoding name
            
        Requirements: 4.5
        """
        self.min_chunk_tokens = min_chunk_tokens
        self.max_chunk_tokens = max_chunk_tokens
        self.overlap_tokens = overlap_tokens
        
        try:
            self.encoding = tiktoken.get_encoding(encoding_name)
        except Exception as e:
            logger.error(f"Failed to load tiktoken encoding: {e}")
            raise ChunkingError(f"Failed to initialize tokenizer: {str(e)}")
    
    def chunk_text(
        self,
        text: str,
        material_metadata: Optional[Dict[str, Any]] = None
    ) -> List[TextChunk]:
        """
        Chunk text into retrievable segments with overlap
        
        Args:
            text: Text to chunk
            material_metadata: Metadata from material (format, page_count, etc.)
            
        Returns:
            List of TextChunk objects
            
        Raises:
            ChunkingError: If chunking fails
            
        Requirements: 4.5
        """
        if not text or not text.strip():
            raise ChunkingError("Cannot chunk empty text")
        
        try:
            # Extract page markers if present (from PDF extraction)
            page_markers = self._extract_page_markers(text)
            
            # Tokenize the entire text
            tokens = self.encoding.encode(text)
            total_tokens = len(tokens)
            
            if total_tokens == 0:
                raise ChunkingError("Text produced no tokens")
            
            chunks = []
            chunk_index = 0
            start_pos = 0
            
            while start_pos < total_tokens:
                # Determine chunk end position
                end_pos = min(start_pos + self.max_chunk_tokens, total_tokens)
                
                # Extract chunk tokens
                chunk_tokens = tokens[start_pos:end_pos]
                
                # Decode back to text
                chunk_text = self.encoding.decode(chunk_tokens)
                
                # Clean up chunk text
                chunk_text = chunk_text.strip()
                
                if chunk_text:
                    # Determine which page this chunk belongs to
                    chunk_metadata = self._create_chunk_metadata(
                        chunk_text,
                        chunk_index,
                        page_markers,
                        material_metadata
                    )
                    
                    chunk = TextChunk(
                        content=chunk_text,
                        chunk_index=chunk_index,
                        metadata=chunk_metadata
                    )
                    chunks.append(chunk)
                    chunk_index += 1
                
                # Move to next chunk with overlap
                # If this is the last chunk, break
                if end_pos >= total_tokens:
                    break
                
                # Move start position forward, accounting for overlap
                start_pos = end_pos - self.overlap_tokens
                
                # Ensure we make progress
                if start_pos <= chunks[-1].chunk_index if chunks else 0:
                    start_pos = end_pos
            
            if not chunks:
                raise ChunkingError("No chunks were created from text")
            
            logger.info(
                f"Created {len(chunks)} chunks from {total_tokens} tokens "
                f"(avg {total_tokens // len(chunks)} tokens per chunk)"
            )
            
            return chunks
            
        except ChunkingError:
            raise
        except Exception as e:
            logger.error(f"Chunking failed: {str(e)}")
            raise ChunkingError(f"Failed to chunk text: {str(e)}")
    
    def _extract_page_markers(self, text: str) -> Dict[int, int]:
        """
        Extract page markers from text (e.g., [PAGE 1])
        
        Args:
            text: Text with potential page markers
            
        Returns:
            Dictionary mapping page number to character position
        """
        page_markers = {}
        pattern = r'\[PAGE (\d+)\]'
        
        for match in re.finditer(pattern, text):
            page_num = int(match.group(1))
            position = match.start()
            page_markers[page_num] = position
        
        return page_markers
    
    def _create_chunk_metadata(
        self,
        chunk_text: str,
        chunk_index: int,
        page_markers: Dict[int, int],
        material_metadata: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Create metadata for a chunk
        
        Args:
            chunk_text: The chunk text
            chunk_index: Index of this chunk
            page_markers: Page marker positions
            material_metadata: Material-level metadata
            
        Returns:
            Chunk metadata dictionary
        """
        metadata: Dict[str, Any] = {
            "chunk_index": chunk_index,
            "token_count": len(self.encoding.encode(chunk_text))
        }
        
        # Add material metadata if available
        if material_metadata:
            metadata["material_format"] = material_metadata.get("format")
        
        # Determine page number if page markers exist
        if page_markers:
            # Find the page this chunk belongs to
            # Look for page markers in the chunk text
            page_match = re.search(r'\[PAGE (\d+)\]', chunk_text)
            if page_match:
                metadata["page_number"] = int(page_match.group(1))
        
        # Extract potential section headers (lines that are short and capitalized)
        lines = chunk_text.split('\n')
        for line in lines[:3]:  # Check first 3 lines
            line = line.strip()
            if line and len(line) < 100 and line.isupper():
                metadata["section_header"] = line
                break
        
        return metadata
    
    def count_tokens(self, text: str) -> int:
        """
        Count tokens in text
        
        Args:
            text: Text to count tokens for
            
        Returns:
            Number of tokens
        """
        try:
            return len(self.encoding.encode(text))
        except Exception as e:
            logger.error(f"Token counting failed: {e}")
            return 0


# Singleton instance
text_chunking_service = TextChunkingService()

