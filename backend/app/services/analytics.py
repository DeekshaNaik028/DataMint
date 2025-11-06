"""
Analytics Service
Statistical analysis and data visualization preparation
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Any
from scipy import stats

class AnalyticsService:
    
    @staticmethod
    def get_distribution(df: pd.DataFrame, column: str, bins: int = 10) -> Dict[str, Any]:
        """Calculate distribution for a numeric column"""
        if column not in df.columns:
            raise ValueError(f"Column {column} not found")
        
        data = df[column].dropna()
        
        if not pd.api.types.is_numeric_dtype(data):
            raise ValueError(f"Column {column} is not numeric")
        
        hist, bin_edges = np.histogram(data, bins=bins)
        
        return {
            "labels": [f"{bin_edges[i]:.0f}-{bin_edges[i+1]:.0f}" for i in range(len(bin_edges)-1)],
            "values": hist.tolist(),
            "column": column
        }
    
    @staticmethod
    def get_statistical_summary(df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Get statistical summary for all numeric columns"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        summaries = []
        
        for col in numeric_cols:
            data = df[col].dropna()
            if len(data) > 0:
                summaries.append({
                    "field": col,
                    "mean": float(data.mean()),
                    "median": float(data.median()),
                    "std": float(data.std()),
                    "min": float(data.min()),
                    "max": float(data.max()),
                    "count": int(len(data))
                })
        
        return summaries
    
    @staticmethod
    def get_correlation_matrix(df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate correlation matrix for numeric columns"""
        numeric_df = df.select_dtypes(include=[np.number])
        
        if numeric_df.shape[1] < 2:
            return {"error": "Need at least 2 numeric columns for correlation"}
        
        corr_matrix = numeric_df.corr()
        
        return {
            "columns": corr_matrix.columns.tolist(),
            "values": corr_matrix.values.tolist()
        }
    
    @staticmethod
    def get_time_series_trend(df: pd.DataFrame, date_col: str, value_col: str) -> Dict[str, Any]:
        """Analyze time series trends"""
        if date_col not in df.columns or value_col not in df.columns:
            raise ValueError("Specified columns not found")
        
        df_sorted = df[[date_col, value_col]].copy()
        df_sorted[date_col] = pd.to_datetime(df_sorted[date_col], errors='coerce')
        df_sorted = df_sorted.dropna().sort_values(date_col)
        
        # Group by month
        df_sorted['period'] = df_sorted[date_col].dt.to_period('M')
        grouped = df_sorted.groupby('period')[value_col].sum()
        
        return {
            "labels": [str(period) for period in grouped.index],
            "values": grouped.values.tolist()
        }
    
    @staticmethod
    def get_categorical_distribution(df: pd.DataFrame, column: str) -> Dict[str, Any]:
        """Get distribution for categorical column"""
        if column not in df.columns:
            raise ValueError(f"Column {column} not found")
        
        value_counts = df[column].value_counts()
        
        return {
            "labels": value_counts.index.tolist(),
            "values": value_counts.values.tolist(),
            "column": column
        }
    
    @staticmethod
    def perform_hypothesis_test(df: pd.DataFrame, col1: str, col2: str) -> Dict[str, Any]:
        """Perform t-test between two columns"""
        if col1 not in df.columns or col2 not in df.columns:
            raise ValueError("Specified columns not found")
        
        data1 = df[col1].dropna()
        data2 = df[col2].dropna()
        
        if not (pd.api.types.is_numeric_dtype(data1) and pd.api.types.is_numeric_dtype(data2)):
            raise ValueError("Both columns must be numeric")
        
        t_stat, p_value = stats.ttest_ind(data1, data2)
        
        return {
            "t_statistic": float(t_stat),
            "p_value": float(p_value),
            "significant": p_value < 0.05,
            "interpretation": "Significant difference" if p_value < 0.05 else "No significant difference"
        }
    
    @staticmethod
    def get_percentiles(df: pd.DataFrame, column: str) -> Dict[str, Any]:
        """Calculate percentiles for a column"""
        if column not in df.columns:
            raise ValueError(f"Column {column} not found")
        
        data = df[column].dropna()
        
        if not pd.api.types.is_numeric_dtype(data):
            raise ValueError(f"Column {column} is not numeric")
        
        percentiles = [10, 25, 50, 75, 90, 95, 99]
        
        return {
            "column": column,
            "percentiles": {
                f"p{p}": float(np.percentile(data, p))
                for p in percentiles
            }
        }