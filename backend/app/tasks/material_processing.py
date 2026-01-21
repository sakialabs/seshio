"""Material processing Celery tasks"""
import logging
from typing import Dict, Any
from celery import Task
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from supabase import Client, create_client

from app.core.celery_app import celery_app
from app.core.config import settings
from app.services.text_extraction import text_extraction_service, TextExtractionError
from app.services.text_chunking import text_chunking_service, ChunkingError
from app.services.embedding import embedding_service, EmbeddingError
from app.models.material import ProcessingStatus


logger = logging.getLogger(__name__)


# Database session for Celery tasks
engine = create_engine(settings.DATABASE_URL_SYNC)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Supabase client for Celery tasks
supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


class MaterialProcessingTask(Task):
    """Base task for material processing with error handling"""
    
    autoretry_for = (Exception,)
    retry_kwargs = {'max_retries': 3}
    retry_backoff = True
    retry_backoff_max = 600  # 10 minutes
    retry_jitter = True


@celery_app.task(
    base=MaterialProcessingTask,
    bind=True,
    name="app.tasks.process_material"
)
def process_material(self, material_id: str) -> Dict[str, Any]:
    """
    Process uploaded material: extract text, chunk, generate embeddings
    
    Args:
        material_id: UUID of the material to process
        
    Returns:
        Processing result dictionary
        
    Requirements: 4.4, 4.5, 4.6, 4.7, 4.8
    """
    logger.info(f"Starting material processing for material_id={material_id}")
    
    db = SessionLocal()
    
    try:
        # Update status to processing
        _update_material_status(material_id, ProcessingStatus.PROCESSING)
        
        # Step 1: Get material info from database
        material_info = _get_material_info(material_id)
        if not material_info:
            raise ValueError(f"Material not found: {material_id}")
        
        logger.info(
            f"Processing material: {material_info['filename']} "
            f"({material_info['mime_type']}, {material_info['file_size']} bytes)"
        )
        
        # Step 2: Download file from Supabase Storage
        file_content = _download_file_from_storage(material_info['file_path'])
        
        # Step 3: Extract text from file
        logger.info("Extracting text from file...")
        extracted_text, extraction_metadata = text_extraction_service.extract_text(
            file_content=file_content,
            mime_type=material_info['mime_type'],
            filename=material_info['filename']
        )
        
        logger.info(
            f"Text extraction complete: {len(extracted_text)} characters, "
            f"metadata: {extraction_metadata}"
        )
        
        # Step 4: Chunk text
        logger.info("Chunking text...")
        chunks = text_chunking_service.chunk_text(
            text=extracted_text,
            material_metadata=extraction_metadata
        )
        
        logger.info(f"Created {len(chunks)} chunks")
        
        # Step 5: Generate embeddings for all chunks
        logger.info("Generating embeddings...")
        chunk_texts = [chunk.content for chunk in chunks]
        embeddings = embedding_service.generate_embeddings_batch(
            texts=chunk_texts,
            retry_on_failure=True
        )
        
        # Count successful embeddings
        successful_embeddings = sum(1 for e in embeddings if e is not None)
        logger.info(
            f"Generated {successful_embeddings}/{len(chunks)} embeddings"
        )
        
        # Step 6: Store chunks and embeddings in database
        logger.info("Storing chunks in database...")
        stored_count = _store_chunks(
            material_id=material_id,
            chunks=chunks,
            embeddings=embeddings
        )
        
        logger.info(f"Stored {stored_count} chunks in database")
        
        # Step 7: Update material status to completed
        _update_material_status(material_id, ProcessingStatus.COMPLETED)
        
        result = {
            "material_id": material_id,
            "status": "completed",
            "chunks_created": stored_count,
            "embeddings_generated": successful_embeddings,
            "extraction_metadata": extraction_metadata
        }
        
        logger.info(f"Material processing complete: {result}")
        return result
        
    except TextExtractionError as e:
        logger.error(f"Text extraction failed for material {material_id}: {e}")
        _update_material_status(material_id, ProcessingStatus.FAILED)
        raise
        
    except ChunkingError as e:
        logger.error(f"Text chunking failed for material {material_id}: {e}")
        _update_material_status(material_id, ProcessingStatus.FAILED)
        raise
        
    except EmbeddingError as e:
        logger.error(f"Embedding generation failed for material {material_id}: {e}")
        _update_material_status(material_id, ProcessingStatus.FAILED)
        raise
        
    except Exception as e:
        logger.error(f"Material processing failed for material {material_id}: {e}")
        _update_material_status(material_id, ProcessingStatus.FAILED)
        raise
        
    finally:
        db.close()


def _get_material_info(material_id: str) -> Dict[str, Any]:
    """Get material information from database"""
    try:
        response = supabase_client.table("materials").select(
            "id, filename, file_path, file_size, mime_type"
        ).eq("id", material_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return None
        
    except Exception as e:
        logger.error(f"Failed to get material info: {e}")
        raise


def _download_file_from_storage(file_path: str) -> bytes:
    """Download file from Supabase Storage"""
    try:
        # Extract bucket and path
        # file_path format: "materials/user_id/material_id/filename"
        response = supabase_client.storage.from_("materials").download(file_path)
        return response
        
    except Exception as e:
        logger.error(f"Failed to download file from storage: {e}")
        raise ValueError(f"Failed to download file: {str(e)}")


def _update_material_status(material_id: str, status: ProcessingStatus) -> None:
    """Update material processing status"""
    try:
        supabase_client.table("materials").update({
            "processing_status": status.value
        }).eq("id", material_id).execute()
        
        logger.info(f"Updated material {material_id} status to {status.value}")
        
    except Exception as e:
        logger.error(f"Failed to update material status: {e}")
        # Don't raise - status update failure shouldn't stop processing


def _store_chunks(
    material_id: str,
    chunks: list,
    embeddings: list
) -> int:
    """Store chunks and embeddings in database"""
    stored_count = 0
    
    try:
        # Prepare chunk data for batch insert
        chunk_data = []
        
        for i, chunk in enumerate(chunks):
            embedding = embeddings[i] if i < len(embeddings) else None
            
            # Only store chunks with successful embeddings
            if embedding is not None:
                chunk_dict = {
                    "material_id": material_id,
                    "content": chunk.content,
                    "embedding": embedding,
                    "chunk_index": chunk.chunk_index,
                    "metadata": chunk.metadata
                }
                chunk_data.append(chunk_dict)
        
        if not chunk_data:
            raise ValueError("No chunks with embeddings to store")
        
        # Batch insert chunks
        response = supabase_client.table("chunks").insert(chunk_data).execute()
        
        if response.data:
            stored_count = len(response.data)
        
        logger.info(f"Stored {stored_count} chunks for material {material_id}")
        return stored_count
        
    except Exception as e:
        logger.error(f"Failed to store chunks: {e}")
        raise ValueError(f"Failed to store chunks in database: {str(e)}")


# Export task for easy import
__all__ = ["process_material"]

