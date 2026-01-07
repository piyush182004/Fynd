from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.Text, nullable=False)
    ai_response = db.Column(db.Text, nullable=False)
    ai_summary = db.Column(db.Text, nullable=False)
    ai_action = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "review": self.review,
            "ai_response": self.ai_response,
            "ai_summary": self.ai_summary,
            "ai_action": self.ai_action,
            "created_at": self.created_at.isoformat()
        }
