import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://fynd-be5l.onrender.com';

function App() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await axios.post(`${API_URL}/api/submit`, {
        rating,
        review: review.trim()
      });

      if (result.data.success) {
        setResponse(result.data.message);
        setRating(0);
        setReview('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">FYND</h1>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="form-card">
            <h2>Share Your Feedback</h2>
            <p className="subtitle">Help us improve your shopping experience</p>
            
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Your Rating</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${rating >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      disabled={loading}
                    >
                      {rating >= star ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                {rating > 0 && <span className="rating-text">{rating} of 5 stars</span>}
              </div>

              <div className="field">
                <label htmlFor="review">Your Review</label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows="5"
                  disabled={loading}
                  maxLength="2000"
                />
                <span className="count">{review.length}/2000</span>
              </div>

              <button type="submit" className="submit-btn" disabled={loading || rating === 0 || !review.trim()}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

            {error && (
              <div className="message error">
                <strong>Error:</strong> {error}
              </div>
            )}

            {response && (
              <div className="message success">
                <strong>Thank you!</strong>
                <p>{response}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Fynd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
