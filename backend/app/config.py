"""
Configuration Settings
"""
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Settings
    API_TITLE: str = "Data Analytics Platform API"
    API_VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: str = "sqlite:///./analytics.db"
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB
    ALLOWED_EXTENSIONS: list = [".csv", ".xlsx", ".xls"]
    
    # ML Settings
    ML_MODEL_DIR: str = "models"
    RANDOM_SEED: int = 42
    
    # Analytics
    MAX_ROWS_PREVIEW: int = 100
    DEFAULT_CHART_BINS: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()