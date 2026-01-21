"""Celery worker entry point"""
from app.core.celery_app import celery_app
from app.tasks import process_material  # noqa: F401


if __name__ == "__main__":
    celery_app.start()

