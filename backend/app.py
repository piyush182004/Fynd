from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Review
from llm import call_llm
from config import Config
import json

app = Flask(__name__)
app.config.from_object(Config)

# Validate configuration
Config.validate()

CORS(app, origins=Config.CORS_ORIGINS)

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint for deployment monitoring."""
    return jsonify({"status": "healthy", "service": "fynd-feedback-api"})

@app.route("/api/submit", methods=["POST"])
def submit_review():
    """Submit a new review and get AI-generated response."""
    data = request.json
    
    # Validate input
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    review_text = data.get("review", "").strip()
    rating = data.get("rating")
    
    if not review_text:
        return jsonify({"error": "Review text is required"}), 400
    
    if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify({"error": "Valid rating (1-5) is required"}), 400
    
    # Truncate long reviews
    if len(review_text) > 2000:
        review_text = review_text[:2000]
    
    # Call LLM with graceful fallback
    try:
        llm_output = call_llm(review_text, rating)
        parsed = json.loads(llm_output)
    except Exception as e:
        print(f"LLM Error: {e}")
        # Fallback response when LLM fails
        if rating >= 4:
            parsed = {
                "response": "Thank you for your positive feedback! We're glad you had a great experience with Fynd.",
                "summary": f"Positive {rating}-star review from customer",
                "action": "No immediate action required"
            }
        elif rating == 3:
            parsed = {
                "response": "Thank you for your feedback. We appreciate your honest review and will work to improve.",
                "summary": f"Neutral {rating}-star review from customer",
                "action": "Review feedback for improvements"
            }
        else:
            parsed = {
                "response": "We're sorry to hear about your experience. Your feedback is important and we'll work to address your concerns.",
                "summary": f"Negative {rating}-star review requiring attention",
                "action": "Follow up with customer within 24 hours"
            }
    
    # Save to database
    review = Review(
        rating=rating,
        review=review_text,
        ai_response=parsed["response"],
        ai_summary=parsed["summary"],
        ai_action=parsed["action"]
    )
    db.session.add(review)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": parsed["response"],
        "id": review.id
    }), 201

@app.route("/api/admin/reviews", methods=["GET"])
def admin_reviews():
    """Get all reviews for admin dashboard."""
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify({
        "success": True,
        "count": len(reviews),
        "reviews": [r.to_dict() for r in reviews]
    })

@app.route("/api/admin/analytics", methods=["GET"])
def admin_analytics():
    """Get analytics data for admin dashboard."""
    total_reviews = Review.query.count()
    
    # Count by rating
    rating_counts = {}
    for i in range(1, 6):
        rating_counts[str(i)] = Review.query.filter_by(rating=i).count()
    
    # Average rating
    reviews = Review.query.all()
    avg_rating = sum(r.rating for r in reviews) / total_reviews if total_reviews > 0 else 0
    
    return jsonify({
        "success": True,
        "analytics": {
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 2),
            "rating_distribution": rating_counts
        }
    })

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
