# Fynd AI Feedback System

Professional two-dashboard AI feedback system built with React and Flask.

## 🏗️ Architecture

- **Backend**: Flask REST API with SQLAlchemy + Gemini AI
- **Frontend**: Two React apps (User Dashboard + Admin Dashboard)
- **Database**: SQLite (production-ready for PostgreSQL)
- **AI**: Google Gemini 2.0 Flash Exp

## 📁 Project Structure

```
task2/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── llm.py              # Gemini AI integration
│   ├── config.py           # Configuration
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── user-dashboard/     # Public-facing review submission
│   └── admin-dashboard/    # Internal analytics & review management
└── README.md
```

## 🚀 Local Development Setup

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

Backend runs on: `http://localhost:5000`

### User Dashboard Setup

```bash
cd frontend/user-dashboard

# Install dependencies
npm install

# Start development server
npm start
```

User Dashboard runs on: `http://localhost:3000`

### Admin Dashboard Setup

```bash
cd frontend/admin-dashboard

# Install dependencies
npm install

# Start development server
npm start
```

Admin Dashboard runs on: `http://localhost:3001`

## 🌐 Deployment Guide

### Backend Deployment (Render/Railway)

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app`
5. Add environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `DATABASE_URL`: PostgreSQL URL (optional)
   - `CORS_ORIGINS`: Frontend URLs

### Frontend Deployment (Vercel/Netlify)

**User Dashboard:**
1. Create new project
2. Set root directory: `frontend/user-dashboard`
3. Build command: `npm run build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Backend URL

**Admin Dashboard:**
1. Create new project
2. Set root directory: `frontend/admin-dashboard`
3. Build command: `npm run build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Backend URL

## 📊 Features

### User Dashboard
- ⭐ Star rating selector (1-5)
- 📝 Review text input
- 🤖 AI-generated personalized response
- ✅ Success/error state handling
- 📱 Fully responsive design

### Admin Dashboard
- 📊 Real-time analytics dashboard
- 📈 Rating distribution charts
- 🔄 Auto-refresh (10 seconds)
- 🎯 Filter by rating
- 📋 Complete review management
- 🤖 AI summaries and recommended actions
- 📅 Timestamp tracking

## 🔑 Environment Variables

**Backend (.env):**
```
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///db.sqlite3
CORS_ORIGINS=*
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000
```

## 🎨 Design Philosophy

- **Clean Code**: No unnecessary try-except blocks, clear error handling
- **Scalable**: Modular architecture ready for microservices
- **Professional**: Production-grade code quality
- **Fynd-Inspired**: Purple gradient theme matching Fynd brand

## 📝 API Endpoints

```
GET  /api/health              - Health check
POST /api/submit              - Submit review
GET  /api/admin/reviews       - Get all reviews
GET  /api/admin/analytics     - Get analytics data
```

## 🔒 Security Notes

- CORS configured for production origins
- Input validation on all endpoints
- SQL injection protection via SQLAlchemy ORM
- Environment variable management

## 📦 Production Considerations

- Replace SQLite with PostgreSQL for production
- Add rate limiting middleware
- Implement authentication for admin dashboard
- Add logging and monitoring
- Set up CI/CD pipeline
- Configure CDN for frontend assets

## 🛠️ Tech Stack

- **Backend**: Flask 3.0, SQLAlchemy, Google Gemini AI
- **Frontend**: React 18, Axios, Recharts
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Deployment**: Vercel (frontend) + Render (backend)

---

**Built for Fynd Task Submission**
