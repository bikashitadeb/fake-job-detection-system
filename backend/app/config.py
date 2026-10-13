# backend/app/config.py

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv


# =====================================================
# ENVIRONMENT CONFIGURATION
# =====================================================

# Locate backend/.env regardless of the current working directory.
BACKEND_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = BACKEND_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE, override=False)


# =====================================================
# CONFIGURATION CLASS
# =====================================================

class Config:

    # ==========================
    # APPLICATION SECURITY
    # ==========================

    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    if not SECRET_KEY:
        raise RuntimeError(
            "SECRET_KEY is missing. Add it to backend/.env."
        )

    if not JWT_SECRET_KEY:
        raise RuntimeError(
            "JWT_SECRET_KEY is missing. Add it to backend/.env."
        )

    # ==========================
    # DATABASE
    # ==========================

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError(
            "DATABASE_URL is missing. Add it to backend/.env."
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
    }

    # ==========================
    # JWT CONFIGURATION
    # ==========================

    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    # Preserve your existing identity compatibility setting.
    JWT_VERIFY_SUB = False

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_DECODE_LEEWAY = 10
    JWT_ERROR_MESSAGE_KEY = "msg"

    # ==========================
    # SECURITY / COOKIES
    # ==========================

    SESSION_COOKIE_SECURE = (
        os.getenv("SESSION_COOKIE_SECURE", "False").lower() == "true"
    )

    REMEMBER_COOKIE_SECURE = (
        os.getenv("REMEMBER_COOKIE_SECURE", "False").lower() == "true"
    )

    # ==========================
    # SERVER
    # ==========================

    FLASK_HOST = os.getenv("FLASK_HOST", "127.0.0.1")
    PORT = int(os.getenv("PORT", "5000"))
    FLASK_DEBUG = (
        os.getenv("FLASK_DEBUG", "False").lower() == "true"
    )

    # ==========================
    # PAGINATION
    # ==========================

    DEFAULT_PAGE_SIZE = 10
    MAX_PAGE_SIZE = 100

    # ==========================
    # LOGGING
    # ==========================

    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE = os.getenv("LOG_FILE", "logs/app.log")


# =====================================================
# CONFIGURATION FACTORY
# =====================================================

def get_config():
    return Config