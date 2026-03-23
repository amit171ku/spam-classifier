# 🛡️ Spam Classifier — AI-Powered Email Threat Detection

A full-stack web application that uses Machine Learning to detect spam, ham, and phishing emails in real time.

![Spam Classifier](https://img.shields.io/badge/AI-Powered-blueviolet) ![Python](https://img.shields.io/badge/Python-3.x-blue) ![React](https://img.shields.io/badge/React-Vite-61DAFB) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

- 📧 **Email Classification** — Detects Spam, Ham, and Phishing emails instantly
- 📊 **Dashboard** — Visual analytics of classification history
- 🕒 **History** — Tracks all previously classified emails
- 🧪 **Sample Emails** — Built-in Spam, Ham, and Phishing samples for testing
- ⚡ **Fast & Accurate** — Powered by a trained ML model

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Python (FastAPI / Flask) |
| ML Model | Scikit-learn |
| Database | SQLite (spam_classifier.db) |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 📁 Project Structure

```
spam-classifier/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
├── backend/           # Python backend + ML model
│   ├── main.py
│   └── requirements.txt
├── spam_classifier.db # SQLite database
└── README.md
```

---

## ⚙️ Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/amit171ku/spam-classifier.git
cd spam-classifier
```

### 2. Run Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`  
Backend will run at: `http://localhost:8000`

---

## 🌐 Live Demo

- **Frontend:** [spam-classifier.vercel.app](https://spam-classifier.vercel.app)
- **Backend API:** [spam-classifier.onrender.com](https://spam-classifier.onrender.com)

---

## 📸 Screenshots

### Classify Tab
> Enter sender, subject, and email body to instantly classify the email.

### Dashboard
> View visual stats and trends of your classified emails.

### History
> Browse all previously classified emails.

---

## 🤖 How It Works

1. User inputs email details (sender, subject, body)
2. Frontend sends request to Backend API
3. ML model processes the text
4. Result returned: **Spam / Ham / Phishing**
5. Result saved to database and shown in History & Dashboard

---

## 👤 Author

**Amit Sharma**  
GitHub: [@amit171ku](https://github.com/amit171ku)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).