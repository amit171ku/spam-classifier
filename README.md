# Spam Classifier 🛡️

AI-powered email spam detection system with ML + rule-based hybrid approach.

## Live Demo
- Backend API: https://spam-classifier-jvch.onrender.com/docs

## Features
- Spam / Ham / Phishing / Promotional detection
- Confidence score with ML + rule-based hybrid scoring
- Suspicious keyword highlighting
- Email history with search and filter
- Dashboard with classification breakdown
- Feedback system for model improvement

## Tech Stack

### Backend
- FastAPI (Python)
- Scikit-learn (Naive Bayes + TF-IDF)
- SQLAlchemy + SQLite
- NLTK for text preprocessing

### Frontend
- React + Vite
- Axios
- CSS3

## Project Structure
```
spam-classifier/
├── backend/
│   ├── main.py          # FastAPI app
│   ├── database.py      # SQLite models
│   ├── model/
│   │   ├── train.py     # Model training
│   │   └── predict.py   # Hybrid prediction
│   └── utils/
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       └── index.css
├── data/
│   └── spam.csv         # UCI SMS dataset
└── requirements.txt
```

## Model Performance
- Algorithm: Naive Bayes + TF-IDF (ngram 1-2)
- Accuracy: ~98%
- Precision: 0.98
- Recall: 0.94
- F1 Score: 0.96

## Setup & Installation

### Backend
```bash
# Clone repo
git clone https://github.com/amit171ku/spam-classifier.git
cd spam-classifier

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt')"

# Train model
python backend/model/train.py

# Start backend
python -m uvicorn backend.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /predict | Classify email |
| GET | /history | Get past results |
| POST | /feedback/{id} | Save feedback |
| GET | /stats | Dashboard stats |

## Dataset
UCI SMS Spam Collection Dataset
- 5,572 SMS messages
- 4,825 Ham + 747 Spam

## Developer
**Amit Sharma**  
GitHub: [@amit171ku](https://github.com/amit171ku)