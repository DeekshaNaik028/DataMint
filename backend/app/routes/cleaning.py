"""
Data Cleaning Routes
Quality assessment and data cleaning operations
"""
from fastapi import APIRouter, HTTPException
from models.schemas import CleaningConfigRequest, QualityMetrics, CleaningResults
from services.data_cleaner import DataCleanerService
from services.data_loader import DataLoaderService
from routes.data import data_store

router = APIRouter()

@router.get("/quality", response_model=QualityMetrics)
async def assess_quality():
    """Assess data quality"""
    
    if not data_store["raw_data"]:
        raise HTTPException(status_code=404, detail="No data loaded")
    
    df = DataLoaderService.dict_to_dataframe(data_store["raw_data"])
    quality = DataCleanerService.assess_quality(df)
    
    return QualityMetrics(**quality)

@router.post("/clean", response_model=CleaningResults)
async def clean_data(config: CleaningConfigRequest):
    """Clean data based on configuration"""
    
    if not data_store["raw_data"]:
        raise HTTPException(status_code=404, detail="No data loaded")
    
    try:
        df = DataLoaderService.dict_to_dataframe(data_store["raw_data"])
        
        cleaned_df, stats = DataCleanerService.clean_data(
            df,
            strategy=config.strategy.value,
            remove_duplicates=config.remove_duplicates,
            standardize=config.standardize_data
        )
        
        data_store["cleaned_data"] = DataLoaderService.dataframe_to_dict(cleaned_df)
        
        return CleaningResults(
            success=True,
            missing_found=stats["missing_found"],
            missing_filled=stats["missing_filled"],
            duplicates_removed=stats["duplicates_removed"],
            strategy_used=config.strategy.value,
            final_rows=len(cleaned_df),
            final_columns=len(cleaned_df.columns)
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/outliers")
async def detect_outliers(threshold: float = 3.0):
    """Detect outliers in data"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    outliers = DataCleanerService.detect_outliers(df, threshold)
    
    return outliers