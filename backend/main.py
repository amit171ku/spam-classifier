from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import nltk
import os

# Download NLTK data at startup
nltk.data.path.append('/opt/render/nltk_data')
nltk.download('stopwords', download_dir='/opt/render/nltk_data', quiet=True)

from database import SessionLocal, EmailLog
from model.predict import predict
import json

app = FastAPI(title="Spam Classifier API")
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"])

class EmailIn(BaseModel):
    sender: str = ""
    subject: str = ""
    body: str = ""

@app.post("/predict")
def classify_email(email: EmailIn):
    text = f"{email.subject} {email.body}"
    result = predict(text)
    db = SessionLocal()
    log = EmailLog(
        sender=email.sender, subject=email.subject,
        body=email.body, verdict=result["verdict"],
        confidence=result["confidence"],
        reasons=json.dumps(result["reasons"])
    )
    db.add(log); db.commit(); db.refresh(log)
    db.close()
    return {**result, "id": log.id}

@app.get("/history")
def get_history(limit: int = 50, verdict: str = None):
    db = SessionLocal()
    q = db.query(EmailLog).order_by(EmailLog.created_at.desc())
    if verdict:
        q = q.filter(EmailLog.verdict == verdict)
    logs = q.limit(limit).all()
    db.close()
    return [{"id": l.id, "sender": l.sender, "subject": l.subject,
             "verdict": l.verdict, "confidence": l.confidence,
             "reasons": json.loads(l.reasons), "feedback": l.feedback,
             "created_at": str(l.created_at)} for l in logs]

@app.post("/feedback/{log_id}")
def save_feedback(log_id: int, is_correct: bool):
    db = SessionLocal()
    log = db.query(EmailLog).filter(EmailLog.id == log_id).first()
    if log:
        log.feedback = "correct" if is_correct else "wrong"
    db.commit(); db.close()
    return {"status": "saved"}

@app.get("/stats")
def get_stats():
    db = SessionLocal()
    logs = db.query(EmailLog).all()
    db.close()
    from collections import Counter
    counts = Counter(l.verdict for l in logs)
    with_fb = [l for l in logs if l.feedback]
    acc = round(sum(1 for l in with_fb if l.feedback == "correct") / max(len(with_fb), 1) * 100)
    return {"total": len(logs), **dict(counts), "accuracy": acc}