"""
Data Loading Service
Handles CSV uploads, database connections, and sample data generation
"""
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

class DataLoaderService:
    
    @staticmethod
    def load_csv(file_path: str) -> pd.DataFrame:
        """Load CSV file into DataFrame"""
        try:
            df = pd.read_csv(file_path)
            return df
        except Exception as e:
            raise ValueError(f"Error loading CSV: {str(e)}")
    
    @staticmethod
    def connect_database(db_type: str, connection_string: str, table_name: str) -> pd.DataFrame:
        """Connect to database and fetch data"""
        # Simulated database connection
        # In production, use actual database connectors
        print(f"Connecting to {db_type} database...")
        print(f"Connection: {connection_string}")
        print(f"Table: {table_name}")
        
        # Return sample data for demonstration
        return DataLoaderService.generate_sample_data("sales", 500)
    
    @staticmethod
    def generate_sample_data(data_type: str, size: int = 500) -> pd.DataFrame:
        """Generate sample data for testing"""
        np.random.seed(42)
        
        if data_type == "sales":
            products = ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Tablet', 'Phone', 'Headphones']
            regions = ['North', 'South', 'East', 'West']
            
            data = []
            base_date = datetime(2025, 1, 1)
            
            for i in range(size):
                price = round(random.uniform(100, 1100), 2)
                quantity = random.randint(1, 50)
                revenue = price * quantity if random.random() > 0.15 else None  # 15% missing
                
                data.append({
                    'id': i + 1,
                    'product': random.choice(products),
                    'quantity': quantity,
                    'price': price,
                    'region': random.choice(regions),
                    'date': (base_date + timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d'),
                    'revenue': revenue,
                    'customer_id': '' if random.random() < 0.1 else random.randint(1, 1000)
                })
            
            return pd.DataFrame(data)
        
        elif data_type == "customers":
            segments = ['Enterprise', 'SMB', 'Startup']
            
            data = []
            for i in range(size):
                data.append({
                    'customer_id': i + 1,
                    'name': f'Customer {i + 1}',
                    'segment': random.choice(segments),
                    'ltv': round(random.uniform(5000, 55000), 2),
                    'acquisition_cost': None if random.random() < 0.15 else round(random.uniform(100, 2100), 2),
                    'churn_risk': '' if random.random() < 0.2 else round(random.uniform(0, 0.3), 2)
                })
            
            return pd.DataFrame(data)
        
        elif data_type == "inventory":
            categories = ['Electronics', 'Office', 'Accessories']
            
            data = []
            for i in range(size):
                data.append({
                    'sku': f'SKU{i + 1}',
                    'product_name': f'Product {i + 1}',
                    'category': random.choice(categories),
                    'stock_level': random.randint(0, 200),
                    'reorder_point': None if random.random() < 0.1 else random.randint(10, 60),
                    'unit_cost': round(random.uniform(1, 100), 2)
                })
            
            return pd.DataFrame(data)
        
        else:
            raise ValueError(f"Unknown sample data type: {data_type}")
    
    @staticmethod
    def dataframe_to_dict(df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Convert DataFrame to list of dictionaries"""
        # Replace NaN with None for JSON serialization
        df_clean = df.where(pd.notnull(df), None)
        return df_clean.to_dict('records')
    
    @staticmethod
    def dict_to_dataframe(data: List[Dict[str, Any]]) -> pd.DataFrame:
        """Convert list of dictionaries to DataFrame"""
        return pd.DataFrame(data)