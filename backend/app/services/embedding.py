"""Embedding generation service using Gemini API"""
import logging
import time
from typing import List, Optional
import google.generativeai as genai
from app.core.config import settings


logger = logging.getLogger(__name__)


class EmbeddingError(Exception):
    """Base exception for embedding errors"""
    pass


class EmbeddingService:
    """Service for generating embeddings using Gemini API"""
    
    def __init__(self):
        """
        Initialize Gemini embedding service
        
        Requirements: 4.6, 4.7
        """
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not set. Embedding service will not work.")
        else:
            genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Gemini embedding model
        self.model_name = "models/embedding-001"
        self.embedding_dimension = 768
        
        # Rate limiting configuration
        self.max_retries = 3
        self.base_retry_delay = 1.0  # seconds
        self.batch_size = 100  # Max texts per batch
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text
        
        Args:
            text: Text to embed
            
        Returns:
            Embedding vector (768 dimensions)
            
        Raises:
            EmbeddingError: If embedding generation fails
            
        Requirements: 4.6
        """
        if not text or not text.strip():
            raise EmbeddingError("Cannot generate embedding for empty text")
        
        try:
            result = genai.embed_content(
                model=self.model_name,
                content=text,
                task_type="retrieval_document"
            )
            
            embedding = result['embedding']
            
            if len(embedding) != self.embedding_dimension:
                raise EmbeddingError(
                    f"Unexpected embedding dimension: {len(embedding)} "
                    f"(expected {self.embedding_dimension})"
                )
            
            return embedding
            
        except Exception as e:
            logger.error(f"Embedding generation failed: {str(e)}")
            raise EmbeddingError(f"Failed to generate embedding: {str(e)}")
    
    def generate_embeddings_batch(
        self,
        texts: List[str],
        retry_on_failure: bool = True
    ) -> List[Optional[List[float]]]:
        """
        Generate embeddings for multiple texts with batching and retry logic
        
        Args:
            texts: List of texts to embed
            retry_on_failure: Whether to retry on rate limit or transient errors
            
        Returns:
            List of embedding vectors (same length as input)
            None for texts that failed after retries
            
        Raises:
            EmbeddingError: If batch processing fails completely
            
        Requirements: 4.6, 4.7
        """
        if not texts:
            return []
        
        # Filter out empty texts
        valid_indices = [i for i, text in enumerate(texts) if text and text.strip()]
        valid_texts = [texts[i] for i in valid_indices]
        
        if not valid_texts:
            raise EmbeddingError("No valid texts to embed")
        
        embeddings: List[Optional[List[float]]] = [None] * len(texts)
        
        # Process in batches
        for batch_start in range(0, len(valid_texts), self.batch_size):
            batch_end = min(batch_start + self.batch_size, len(valid_texts))
            batch_texts = valid_texts[batch_start:batch_end]
            batch_indices = valid_indices[batch_start:batch_end]
            
            logger.info(
                f"Processing embedding batch {batch_start // self.batch_size + 1}: "
                f"{len(batch_texts)} texts"
            )
            
            batch_embeddings = self._generate_batch_with_retry(
                batch_texts,
                retry_on_failure
            )
            
            # Map results back to original indices
            for i, embedding in enumerate(batch_embeddings):
                original_index = batch_indices[i]
                embeddings[original_index] = embedding
        
        # Count successes and failures
        success_count = sum(1 for e in embeddings if e is not None)
        failure_count = len(embeddings) - success_count
        
        logger.info(
            f"Embedding generation complete: {success_count} succeeded, "
            f"{failure_count} failed"
        )
        
        if success_count == 0:
            raise EmbeddingError("All embedding generations failed")
        
        return embeddings
    
    def _generate_batch_with_retry(
        self,
        texts: List[str],
        retry_on_failure: bool
    ) -> List[Optional[List[float]]]:
        """
        Generate embeddings for a batch with retry logic
        
        Args:
            texts: Batch of texts to embed
            retry_on_failure: Whether to retry on errors
            
        Returns:
            List of embeddings (None for failures)
        """
        embeddings: List[Optional[List[float]]] = []
        
        for text in texts:
            embedding = None
            last_error = None
            
            for attempt in range(self.max_retries if retry_on_failure else 1):
                try:
                    embedding = self.generate_embedding(text)
                    break  # Success
                    
                except EmbeddingError as e:
                    last_error = e
                    
                    if not retry_on_failure or attempt == self.max_retries - 1:
                        # Don't retry or max retries reached
                        logger.error(
                            f"Embedding generation failed after {attempt + 1} attempts: {e}"
                        )
                        break
                    
                    # Exponential backoff
                    delay = self.base_retry_delay * (2 ** attempt)
                    logger.warning(
                        f"Embedding generation failed (attempt {attempt + 1}), "
                        f"retrying in {delay}s: {e}"
                    )
                    time.sleep(delay)
            
            embeddings.append(embedding)
        
        return embeddings
    
    def generate_query_embedding(self, query: str) -> List[float]:
        """
        Generate embedding for a search query
        
        Args:
            query: Search query text
            
        Returns:
            Query embedding vector
            
        Raises:
            EmbeddingError: If embedding generation fails
            
        Note: Uses different task_type for queries vs documents
        """
        if not query or not query.strip():
            raise EmbeddingError("Cannot generate embedding for empty query")
        
        try:
            result = genai.embed_content(
                model=self.model_name,
                content=query,
                task_type="retrieval_query"
            )
            
            embedding = result['embedding']
            
            if len(embedding) != self.embedding_dimension:
                raise EmbeddingError(
                    f"Unexpected embedding dimension: {len(embedding)} "
                    f"(expected {self.embedding_dimension})"
                )
            
            return embedding
            
        except Exception as e:
            logger.error(f"Query embedding generation failed: {str(e)}")
            raise EmbeddingError(f"Failed to generate query embedding: {str(e)}")


# Singleton instance
embedding_service = EmbeddingService()

