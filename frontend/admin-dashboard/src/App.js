import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const API_URL = 'https://fynd-be5l.onrender.com';

function App() {
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
    try {
      const [reviewsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/reviews`),
        axios.get(`${API_URL}/api/admin/analytics`)
      ]);

      if (reviewsRes.data.success) {
        setReviews(reviewsRes.data.reviews);
      }
      
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
      
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Unable to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getFilteredReviews = () => {
    if (filter === 'all') return reviews;
    return reviews.filter(r => r.rating === parseInt(filter));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#000';
    if (rating === 3) return '#666';
    return '#999';
  };

  const getChartData = () => {
    if (!analytics) return [];
    return Object.entries(analytics.rating_distribution).map(([rating, count]) => ({
      rating: `${rating} Star`,
      count
    }));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>{error}</h2>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <div className="brand">
            <h1>FYND</h1>
            <span className="badge">ADMIN</span>
          </div>
          <div className="controls">
            <label className="toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Auto-refresh (5s)</span>
            </label>
            <button className="btn-refresh" onClick={fetchData}>Refresh</button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-label">Total Reviews</span>
              <span className="stat-number">{analytics?.total_reviews || 0}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Average Rating</span>
              <span className="stat-number">{analytics?.average_rating?.toFixed(1) || '0.0'}</span>
            </div>
            <div className="stat-box chart-box">
              <span className="stat-label">Distribution</span>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="rating" tick={{fontSize: 11}} />
                  <YAxis tick={{fontSize: 11}} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map(r => (
              <button
                key={r}
                className={`filter-btn ${filter === String(r) ? 'active' : ''}`}
                onClick={() => setFilter(String(r))}
              >
                {r} Star ({reviews.filter(rev => rev.rating === r).length})
              </button>
            ))}
          </div>

          <section className="reviews">
            <h2>Reviews ({getFilteredReviews().length})</h2>
            {getFilteredReviews().length === 0 ? (
              <div className="empty">No reviews yet</div>
            ) : (
              <div className="review-list">
                {getFilteredReviews().map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-top">
                      <span className="rating" style={{borderColor: getRatingColor(review.rating)}}>
                        {review.rating} Star
                      </span>
                      <span className="date">{new Date(review.created_at).toLocaleString()}</span>
                    </div>
                    <p className="review-text">{review.review}</p>
                    <div className="ai-grid">
                      <div className="ai-box">
                        <h4>Summary</h4>
                        <p>{review.ai_summary}</p>
                      </div>
                      <div className="ai-box">
                        <h4>Response</h4>
                        <p>{review.ai_response}</p>
                      </div>
                      <div className="ai-box action">
                        <h4>Action</h4>
                        <p>{review.ai_action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
