"""
Pydantic Schemas for Request/Response Models
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

# Enums
class DatabaseType(str, Enum):
    MYSQL = "mysql"
    POSTGRESQL = "postgresql"
    MONGODB = "mongodb"
    SQLITE = "sqlite"

class CleaningStrategy(str, Enum):
    MEAN = "mean"
    MEDIAN = "median"
    MODE = "mode"
    INTERPOLATION = "interpolation"
    ML = "ml"
    REMOVE = "remove"

class SampleDataType(str, Enum):
    SALES = "sales"
    CUSTOMERS = "customers"
    INVENTORY = "inventory"

# Request Models
class DatabaseConnectionRequest(BaseModel):
    db_type: DatabaseType
    connection_string: str
    table_name: str

class CleaningConfigRequest(BaseModel):
    strategy: CleaningStrategy = CleaningStrategy.MEAN
    remove_duplicates: bool = True
    standardize_data: bool = True

class ForecastRequest(BaseModel):
    periods: int = Field(default=6, ge=1, le=12)

class SegmentationRequest(BaseModel):
    n_clusters: int = Field(default=4, ge=2, le=10)

# Response Models
class DataUploadResponse(BaseModel):
    success: bool
    message: str
    rows: int
    columns: int
    headers: List[str]

class QualityMetrics(BaseModel):
    completeness: float
    missing_count: int
    total_cells: int
    duplicate_count: int
    quality_score: str

class CleaningResults(BaseModel):
    success: bool
    missing_found: int
    missing_filled: int
    duplicates_removed: int
    strategy_used: str
    final_rows: int
    final_columns: int

class StatisticalSummary(BaseModel):
    field: str
    mean: float
    median: float
    std: float
    min: float
    max: float
    count: int

class Insight(BaseModel):
    icon: str
    text: str
    confidence: int

class ForecastResult(BaseModel):
    success: bool
    historical: List[float]
    forecast: List[float]
    labels: List[str]
    metrics: Dict[str, Any]

class SegmentationResult(BaseModel):
    success: bool
    segments: List[int]
    labels: List[str]
    percentages: List[float]
    algorithm: str

class AnomalyResult(BaseModel):
    success: bool
    anomaly_count: int
    anomalies: List[Dict[str, Any]]
    threshold: float

class Recommendation(BaseModel):
    icon: str
    title: str
    detail: str
    confidence: int

# Data Store (in-memory for simplicity)
class DataStore(BaseModel):
    raw_data: List[Dict[str, Any]] = []
    cleaned_data: List[Dict[str, Any]] = []
    
    class Config:
        arbitrary_types_allowed = True