"""Application configuration"""
from typing import Any
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/seshio"
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@localhost:5432/seshio"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Gemini AI
    GEMINI_API_KEY: str = ""

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Application
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # File Upload
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_FILE_TYPES: str = "pdf,txt,md,docx"

    # Rate Limiting
    RATE_LIMIT_QUESTIONS_PER_MINUTE: int = 10
    RATE_LIMIT_UPLOADS_PER_HOUR: int = 5

    @property
    def cors_origins_list(self) -> list[str]:
        """Get CORS origins as a list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def allowed_file_types_list(self) -> list[str]:
        """Get allowed file types as a list"""
        return [ft.strip() for ft in self.ALLOWED_FILE_TYPES.split(",") if ft.strip()]


settings = Settings()
