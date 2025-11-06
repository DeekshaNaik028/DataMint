"""
Data Management Routes
Upload files, connect to databases, generate sample data
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
import os
import shutil

from models.schemas import DatabaseConnectionRequest, DataUploadResponse, SampleDataType
from services.data_loader import DataLoaderService

router = APIRouter()

# In-memory data store (use Redis/DB in production)
data_store = {
    "raw_data": [],
    "cleaned_data": []
}

@router.post("/upload", response_model=DataUploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """Upload CSV file"""
    
    # Validate file extension
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    # Save file
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Load data
        df = DataLoaderService.load_csv(file_path)
        data_store["raw_data"] = DataLoaderService.dataframe_to_dict(df)
        data_store["cleaned_data"] = []
        
        return DataUploadResponse(
            success=True,
            message=f"Successfully loaded {len(df)} rows",
            rows=len(df),
            columns=len(df.columns),
            headers=df.columns.tolist()
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        # Clean up
        if os.path.exists(file_path):
            os.remove(file_path)

@router.post("/connect")
async def connect_database(request: DatabaseConnectionRequest):
    """Connect to database and fetch data"""
    
    try:
        df = DataLoaderService.connect_database(
            request.db_type,
            request.connection_string,
            request.table_name
        )
        
        data_store["raw_data"] = DataLoaderService.dataframe_to_dict(df)
        data_store["cleaned_data"] = []
        
        return {
            "success": True,
            "message": f"Connected to {request.db_type} database successfully",
            "rows": len(df),
            "columns": len(df.columns),
            "headers": df.columns.tolist(),
            "tables": ["sales", "customers", "products"]  # Simulated
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/generate/{data_type}")
async def generate_sample_data(data_type: SampleDataType, size: int = 500):
    """Generate sample data for testing"""
    
    try:
        df = DataLoaderService.generate_sample_data(data_type.value, size)
        data_store["raw_data"] = DataLoaderService.dataframe_to_dict(df)
        data_store["cleaned_data"] = []
        
        return {
            "success": True,
            "message": f"Generated {len(df)} {data_type.value} records",
            "rows": len(df),
            "columns": len(df.columns),
            "headers": df.columns.tolist()
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/preview")
async def get_data_preview(limit: int = 5):
    """Get data preview"""
    
    if not data_store["raw_data"]:
        raise HTTPException(status_code=404, detail="No data loaded")
    
    return {
        "data": data_store["raw_data"][:limit],
        "total_rows": len(data_store["raw_data"]),
        "has_cleaned": len(data_store["cleaned_data"]) > 0
    }

@router.get("/raw")
async def get_raw_data():
    """Get all raw data"""
    
    if not data_store["raw_data"]:
        raise HTTPException(status_code=404, detail="No data loaded")
    
    return {
        "data": data_store["raw_data"],
        "count": len(data_store["raw_data"])
    }

@router.get("/cleaned")
async def get_cleaned_data():
    """Get all cleaned data"""
    
    if not data_store["cleaned_data"]:
        raise HTTPException(status_code=404, detail="No cleaned data available. Run cleaning first.")
    
    return {
        "data": data_store["cleaned_data"],
        "count": len(data_store["cleaned_data"])
    }