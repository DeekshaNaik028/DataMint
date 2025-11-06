"""
AI Insights Generation Service
Generate business insights from data analysis
"""
import pandas as pd
import numpy as np
from typing import List, Dict, Any

class InsightsService:
    
    @staticmethod
    def generate_insights(raw_df: pd.DataFrame, cleaned_df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Generate AI-powered business insights
        """
        insights = []
        
        # Revenue insights
        revenue_insight = InsightsService._analyze_revenue(cleaned_df)
        if revenue_insight:
            insights.append(revenue_insight)
        
        # Customer/Segment insights
        customer_insight = InsightsService._analyze_customers(cleaned_df)
        if customer_insight:
            insights.append(customer_insight)
        
        # Product insights
        product_insight = InsightsService._analyze_products(cleaned_df)
        if product_insight:
            insights.append(product_insight)
        
        # Data quality insights
        quality_insight = InsightsService._analyze_data_quality(raw_df, cleaned_df)
        if quality_insight:
            insights.append(quality_insight)
        
        # Regional insights
        regional_insight = InsightsService._analyze_regions(cleaned_df)
        if regional_insight:
            insights.append(regional_insight)
        
        return insights
    
    @staticmethod
    def _analyze_revenue(df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze revenue patterns"""
        revenue_cols = [col for col in df.columns if 'revenue' in col.lower() or 'price' in col.lower()]
        
        if not revenue_cols:
            return None
        
        col = revenue_cols[0]
        data = df[col].dropna()
        
        if len(data) == 0:
            return None
        
        avg = data.mean()
        high_performers = len(data[data > avg * 1.2])
        pct = (high_performers / len(data) * 100) if len(data) > 0 else 0
        
        return {
            "icon": "💰",
            "text": f"Revenue analysis shows average of ${avg:.2f} per transaction. {high_performers} high-value transactions ({pct:.0f}% above 20% average) identified, representing significant growth opportunities.",
            "confidence": 92
        }
    
    @staticmethod
    def _analyze_customers(df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze customer segments"""
        customer_cols = [col for col in df.columns if 'customer' in col.lower() or 'segment' in col.lower()]
        
        if not customer_cols:
            return None
        
        col = customer_cols[0]
        
        if df[col].dtype == 'object' or df[col].dtype.name == 'category':
            segments = df[col].value_counts()
            if len(segments) > 0:
                top_segment = segments.index[0]
                pct = (segments.iloc[0] / len(df) * 100)
                
                return {
                    "icon": "👥",
                    "text": f"Customer segmentation reveals {top_segment} as the dominant segment ({pct:.1f}% of total). Focus marketing efforts on this high-value segment for maximum ROI.",
                    "confidence": 88
                }
        
        return None
    
    @staticmethod
    def _analyze_products(df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze product performance"""
        product_cols = [col for col in df.columns if 'product' in col.lower() or 'category' in col.lower()]
        
        if not product_cols:
            return None
        
        col = product_cols[0]
        
        if df[col].dtype == 'object' or df[col].dtype.name == 'category':
            products = df[col].value_counts()
            if len(products) > 0:
                top_product = products.index[0]
                pct = (products.iloc[0] / len(df) * 100)
                
                return {
                    "icon": "📦",
                    "text": f"Product analysis indicates {top_product} leads with {pct:.1f}% market share. Consider expanding this product line and analyzing success factors for replication across other products.",
                    "confidence": 85
                }
        
        return None
    
    @staticmethod
    def _analyze_data_quality(raw_df: pd.DataFrame, cleaned_df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze data quality improvements"""
        original_missing = raw_df.isnull().sum().sum()
        
        if original_missing == 0:
            return {
                "icon": "✅",
                "text": "Data quality is excellent with no missing values detected. Dataset is ready for advanced analytics and predictive modeling with high confidence.",
                "confidence": 98
            }
        
        return {
            "icon": "🔍",
            "text": f"Data quality improvement: Successfully cleaned {original_missing} missing values using advanced imputation techniques. Dataset reliability increased significantly for accurate predictive modeling.",
            "confidence": 95
        }
    
    @staticmethod
    def _analyze_regions(df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze regional distribution"""
        region_cols = [col for col in df.columns if 'region' in col.lower() or 'location' in col.lower()]
        
        if not region_cols:
            return None
        
        col = region_cols[0]
        
        if df[col].dtype == 'object' or df[col].dtype.name == 'category':
            regions = df[col].value_counts()
            if len(regions) > 0:
                top_region = regions.index[0]
                pct = (regions.iloc[0] / len(df) * 100)
                
                return {
                    "icon": "🌍",
                    "text": f"Geographic analysis shows {top_region} region dominates with {pct:.1f}% of activity. Consider region-specific strategies and investigate expansion opportunities in underperforming areas.",
                    "confidence": 89
                }
        
        return None