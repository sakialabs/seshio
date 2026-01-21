"""Celery tasks"""
from app.tasks.material_processing import process_material

__all__ = ["process_material"]
