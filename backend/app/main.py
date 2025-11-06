"""
FastAPI Main Application
Entry point for the Data Analytics Platform API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routes import data, cleaning, analytics, ml

# Create FastAPI app
app = FastAPI(
    title="Data Analytics Platform API",
    description="Complete data pipeline: Database → Cleaning → Analytics → AI Insights → ML Predictions",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(data.router, prefix="/api/data", tags=["Data Management"])
app.include_router(cleaning.router, prefix="/api/cleaning", tags=["Data Cleaning"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(ml.router, prefix="/api/ml", tags=["Machine Learning"])

@app.get("/")
async def root():
    return {
        "message": "Data Analytics Platform API",
        "version": "1.0.0",
        "endpoints": {
            "data": "/api/data",
            "cleaning": "/api/cleaning",
            "analytics": "/api/analytics",
            "ml": "/api/ml",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Data Analytics Platform"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)