"""Celery application configuration"""
from celery import Celery
from app.core.config import settings


# Create Celery app
celery_app = Celery(
    "seshio",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.material_processing"]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes max per task
    task_soft_time_limit=25 * 60,  # 25 minutes soft limit
    worker_prefetch_multiplier=1,  # Process one task at a time
    worker_max_tasks_per_child=50,  # Restart worker after 50 tasks
)

