"""
Analytics Routes
Statistical analysis and data visualization
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.schemas import StatisticalSummary, Insight
from services.analytics import AnalyticsService
from services.insights import InsightsService
from services.data_loader import DataLoaderService
from routes.data import data_store

router = APIRouter()

@router.get("/summary", response_model=List[StatisticalSummary])
async def get_statistical_summary():
    """Get statistical summary for all numeric columns"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    summary = AnalyticsService.get_statistical_summary(df)
    
    return [StatisticalSummary(**s) for s in summary]

@router.get("/distribution")
async def get_distribution(column: str = Query(...), bins: int = 10):
    """Get data distribution for a column"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    
    try:
        distribution = AnalyticsService.get_distribution(df, column, bins)
        return distribution
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/correlation")
async def get_correlation():
    """Get correlation matrix"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    correlation = AnalyticsService.get_correlation_matrix(df)
    
    return correlation

@router.get("/trend")
async def get_trend(date_col: str = Query(...), value_col: str = Query(...)):
    """Get time series trend"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    
    try:
        trend = AnalyticsService.get_time_series_trend(df, date_col, value_col)
        return trend
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/categorical")
async def get_categorical_distribution(column: str = Query(...)):
    """Get categorical distribution"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    
    try:
        distribution = AnalyticsService.get_categorical_distribution(df, column)
        return distribution
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/insights", response_model=List[Insight])
async def generate_insights():
    """Generate AI-powered insights"""
    
    if not data_store["raw_data"]:
        raise HTTPException(status_code=404, detail="No data loaded")
    
    raw_df = DataLoaderService.dict_to_dataframe(data_store["raw_data"])
    cleaned_df = DataLoaderService.dict_to_dataframe(
        data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    )
    
    insights = InsightsService.generate_insights(raw_df, cleaned_df)
    
    return [Insight(**insight) for insight in insights]