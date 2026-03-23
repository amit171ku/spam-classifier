from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

engine = create_engine("sqlite:///spam_classifier.db", echo=False)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class EmailLog(Base):
    __tablename__ = "email_logs"
    id         = Column(Integer, primary_key=True, index=True)
    sender     = Column(String)
    subject    = Column(String)
    body       = Column(String)
    verdict    = Column(String)
    confidence = Column(Float)
    reasons    = Column(String)
    feedback   = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(engine)