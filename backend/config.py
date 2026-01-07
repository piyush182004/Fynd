import os
from dotenv import load_dotenv

load_dotenv()

# Get absolute path for database
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'reviews.db')}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    
    @staticmethod
    def validate():
        if not Config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set. Please add it to .env file")
