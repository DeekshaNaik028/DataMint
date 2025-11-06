"""
Machine Learning Routes
Sales forecasting, customer segmentation, anomaly detection, recommendations
"""
from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import (
    ForecastRequest, ForecastResult,
    SegmentationRequest, SegmentationResult,
    AnomalyResult, Recommendation
)
from services.ml_service import MLService
from services.data_loader import DataLoaderService
from routes.data import data_store

router = APIRouter()

@router.post("/forecast", response_model=ForecastResult)
async def forecast_sales(request: ForecastRequest):
    """Generate sales forecast"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    
    try:
        forecast = MLService.forecast_sales(df, request.periods)
        return ForecastResult(**forecast)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/segment", response_model=SegmentationResult)
async def segment_customers(request: SegmentationRequest):
    """Perform customer segmentation"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    
    try:
        segmentation = MLService.segment_customers(df, request.n_clusters)
        return SegmentationResult(**segmentation)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/anomalies", response_model=AnomalyResult)
async def detect_anomalies(threshold: float = 2.5):
    """Detect anomalies in data"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    
    try:
        anomalies = MLService.detect_anomalies(df, threshold)
        return AnomalyResult(**anomalies)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/recommendations", response_model=List[Recommendation])
async def generate_recommendations():
    """Generate ML-powered recommendations"""
    
    data = data_store["cleaned_data"] if data_store["cleaned_data"] else data_store["raw_data"]
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available")
    
    df = DataLoaderService.dict_to_dataframe(data)
    
    try:
        recommendations = MLService.generate_recommendations(df)
        return [Recommendation(**rec) for rec in recommendations]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))