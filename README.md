# 📊 Data Analytics Platform

A comprehensive full-stack data analytics platform with AI-powered insights, ML predictions, and interactive visualizations.

## ✨ Features

### 🔄 Complete Data Pipeline
- **Data Input**: CSV upload, database connections, sample data generation
- **Data Cleaning**: Missing value handling, duplicate removal, outlier detection
- **Analytics**: Statistical summaries, distributions, correlations, time series
- **AI Insights**: Automated business insights generation
- **ML Predictions**: Sales forecasting, customer segmentation, anomaly detection

### 🎯 Key Capabilities
- 📈 Real-time data visualization with Chart.js
- 🤖 Machine Learning predictions (Linear Regression, K-Means)
- 🔍 Automated anomaly detection
- 💡 AI-powered business recommendations
- 📊 Interactive dashboards
- 🧹 Advanced data cleaning strategies

## 🏗️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Data Processing**: Pandas, NumPy
- **ML/Analytics**: Scikit-learn, SciPy
- **Database**: SQLAlchemy (MySQL, PostgreSQL, MongoDB, SQLite)

### Frontend
- **Framework**: React 18
- **Visualization**: Chart.js, React-ChartJS-2
- **HTTP Client**: Axios
- **Styling**: Custom CSS

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configurations
```

5. **Run the server**
```bash
cd app
python main.py
```

Backend will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# .env is already configured with:
REACT_APP_API_URL=http://localhost:8000
```

4. **Run the development server**
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## 📖 API Documentation

### Data Management
- `POST /api/data/upload` - Upload CSV file
- `POST /api/data/connect` - Connect to database
- `GET /api/data/generate/{type}` - Generate sample data
- `GET /api/data/preview` - Preview loaded data

### Data Cleaning
- `GET /api/cleaning/quality` - Assess data quality
- `POST /api/cleaning/clean` - Clean data with strategy
- `GET /api/cleaning/outliers` - Detect outliers

### Analytics
- `GET /api/analytics/summary` - Statistical summary
- `GET /api/analytics/distribution` - Column distribution
- `GET /api/analytics/correlation` - Correlation matrix
- `GET /api/analytics/trend` - Time series trends
- `GET /api/analytics/insights` - AI-generated insights

### Machine Learning
- `POST /api/ml/forecast` - Sales forecasting
- `POST /api/ml/segment` - Customer segmentation
- `GET /api/ml/anomalies` - Anomaly detection
- `GET /api/ml/recommendations` - ML recommendations

## 🎨 Features in Detail

### 1. Data Input
- **CSV Upload**: Drag-and-drop or browse files
- **Database Connection**: Support for MySQL, PostgreSQL, MongoDB, SQLite
- **Sample Data**: Generate test datasets (Sales, Customers, Inventory)

### 2. Data Cleaning
- **Quality Assessment**: Completeness, missing values, duplicates
- **Cleaning Strategies**:
  - Mean/Median/Mode imputation
  - Linear interpolation
  - ML-based prediction
  - Row removal
- **Standardization**: Automatic data type correction

### 3. Analytics & Visualization
- **Statistical Summary**: Mean, median, std, min, max
- **Distribution Charts**: Histogram visualization
- **Correlation Heatmap**: Identify relationships
- **Time Series**: Trend analysis
- **Categorical Analysis**: Category distributions

### 4. AI Insights
Automated analysis provides:
- Revenue patterns and opportunities
- Customer segment analysis
- Product performance insights
- Data quality improvements
- Regional distribution analysis

### 5. ML Predictions
- **Sales Forecast**: Linear regression with trend analysis
- **Customer Segmentation**: K-Means clustering (2-10 segments)
- **Anomaly Detection**: Z-score based outlier detection
- **Recommendations**: Data-driven business suggestions

## 📁 Project Structure

```
data-analytics-platform/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Configuration
│   │   ├── models/schemas.py    # Pydantic models
│   │   ├── routes/              # API endpoints
│   │   └── services/            # Business logic
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── services/api.js      # API client
│   │   ├── context/             # State management
│   │   └── App.jsx              # Main component
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Backend (.env)
```env
DATABASE_URL=sqlite:///./analytics.db
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=10485760
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

## 🧪 Sample Data

Generate sample datasets for testing:
```bash
# Sales data (500 records)
GET /api/data/generate/sales?size=500

# Customer data
GET /api/data/generate/customers?size=300

# Inventory data
GET /api/data/generate/inventory?size=200
```

## 📊 Data Cleaning Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| Mean | Fill with column average | Numerical data without outliers |
| Median | Fill with middle value | Data with outliers |
| Mode | Fill with most frequent | Categorical data |
| Interpolation | Linear estimation | Time series data |
| ML | Predictive imputation | Complex patterns |
| Remove | Delete rows | Small missing % |

## 🎯 Use Cases

1. **Sales Analysis**: Forecast future sales, identify trends
2. **Customer Analytics**: Segment customers, predict churn
3. **Quality Control**: Detect anomalies, ensure data quality
4. **Business Intelligence**: Generate insights, optimize operations
5. **Predictive Maintenance**: Identify potential issues early

## 🛠️ Development

### Run Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend (with gunicorn)
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Large CSV files (>50MB) may require streaming implementation
- Real-time database connections are simulated for demonstration
- TensorFlow is included but not actively used (future ML models)

## 🚀 Future Enhancements

- [ ] Real-time data streaming
- [ ] Advanced ML models (LSTM, Prophet)
- [ ] User authentication and authorization
- [ ] Multi-tenancy support
- [ ] Export reports (PDF, Excel)
- [ ] Scheduled jobs and automation
- [ ] Real-time collaboration
- [ ] Advanced visualization (D3.js)

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check API documentation at `/docs`
- Review example datasets in `/api/data/generate`

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Pandas Documentation](https://pandas.pydata.org/)
- [Scikit-learn Documentation](https://scikit-learn.org/)
- [Chart.js Documentation](https://www.chartjs.org/)

---

**Built with ❤️ for data scientists, analysts, and business professionals**