import os
import ssl
from datetime import timedelta
from pathlib import Path

from sqlalchemy.engine import make_url
from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = BACKEND_DIR / ".env"
load_dotenv(dotenv_path=ENV_FILE, override=False)


def _as_bool(value: str | None, default: bool = False) -> bool:
    return default if value is None else value.strip().lower() in {"1", "true", "yes", "on"}


def _as_origins(value: str | None) -> list[str]:
    return [origin.strip().rstrip("/") for origin in (value or "").split(",") if origin.strip()]


class Config:
    APP_ENV = os.getenv("APP_ENV", "development").strip().lower()
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    DATABASE_URL = os.getenv("DATABASE_URL")
    if DATABASE_URL:
        database_url = make_url(DATABASE_URL)
        if database_url.drivername == "mysql+pymysql":
            # PyMySQL does not accept MySQL's `ssl-mode` URL option. TLS is
            # configured below through SQLAlchemy's PyMySQL connect_args.
            query = {
                key: value
                for key, value in database_url.query.items()
                if key.lower() != "ssl-mode"
            }
            database_url = database_url.set(query=query)
        SQLALCHEMY_DATABASE_URI = database_url
    else:
        SQLALCHEMY_DATABASE_URI = None

    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY is required. Set it through the environment or backend/.env.")
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is required. Set it through the environment or backend/.env.")
    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError("DATABASE_URL is required. Set it through the environment or backend/.env.")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        # Keep bound values such as emails and password hashes out of SQLAlchemy
        # exception messages and logs.
        "hide_parameters": True,
        "pool_pre_ping": True,
        "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", "1800")),
        "pool_size": int(os.getenv("DB_POOL_SIZE", "5")),
        "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "10")),
        # Aiven requires encrypted connections. PyMySQL otherwise permits
        # falling back to an unencrypted connection when TLS is unavailable.
        "connect_args": {
            "ssl": {
                "check_hostname": False,
                "verify_mode": ssl.CERT_NONE,
            }
        },
    }

    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
    JWT_VERIFY_SUB = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv("JWT_ACCESS_TOKEN_HOURS", "1")))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_REFRESH_TOKEN_DAYS", "30")))
    JWT_DECODE_LEEWAY = int(os.getenv("JWT_DECODE_LEEWAY_SECONDS", "10"))
    JWT_ERROR_MESSAGE_KEY = "msg"

    CORS_ORIGINS = _as_origins(os.getenv("CORS_ORIGINS"))
    if not CORS_ORIGINS and APP_ENV != "production":
        CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
    CORS_SUPPORTS_CREDENTIALS = _as_bool(os.getenv("CORS_SUPPORTS_CREDENTIALS"), True)
    if not CORS_ORIGINS:
        raise RuntimeError("CORS_ORIGINS must contain at least one allowed frontend origin.")
    if CORS_SUPPORTS_CREDENTIALS and "*" in CORS_ORIGINS:
        raise RuntimeError("CORS_ORIGINS cannot contain '*' when credentials are enabled.")

    SESSION_COOKIE_SECURE = _as_bool(os.getenv("SESSION_COOKIE_SECURE"), APP_ENV == "production")
    REMEMBER_COOKIE_SECURE = _as_bool(os.getenv("REMEMBER_COOKIE_SECURE"), APP_ENV == "production")
    PREFERRED_URL_SCHEME = os.getenv("PREFERRED_URL_SCHEME", "https" if APP_ENV == "production" else "http")

    FLASK_HOST = os.getenv("FLASK_HOST", "127.0.0.1")
    PORT = int(os.getenv("PORT", "5000"))
    FLASK_DEBUG = _as_bool(os.getenv("FLASK_DEBUG"), False)
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE = os.getenv("LOG_FILE", "logs/app.log")

    PIPELINE_MODEL_PATH = os.getenv("PIPELINE_MODEL_PATH", str(BACKEND_DIR / "app" / "ai" / "saved_models" / "fake_job_model.pkl"))
    PIPELINE_VECTORIZER_PATH = os.getenv("PIPELINE_VECTORIZER_PATH", str(BACKEND_DIR / "app" / "ai" / "saved_models" / "tfidf_vectorizer.pkl"))
    AI_VERIFICATION_MODEL_PATH = os.getenv("AI_VERIFICATION_MODEL_PATH", str(BACKEND_DIR / "app" / "ai_model" / "fake_job_model.pkl"))
    AI_VERIFICATION_VECTORIZER_PATH = os.getenv("AI_VERIFICATION_VECTORIZER_PATH", str(BACKEND_DIR / "app" / "ai_model" / "tfidf_vectorizer.pkl"))

    DEFAULT_PAGE_SIZE = 10
    MAX_PAGE_SIZE = 100


def get_config():
    return Config
