import os
from pathlib import Path


AI_DIR = Path(__file__).resolve().parent
BACKEND_DIR = AI_DIR.parents[1]


def artifact_path(environment_name: str, default_path: Path) -> Path:
    """Return an absolute, readable artifact path or fail during startup."""
    path = Path(os.getenv(environment_name, str(default_path))).expanduser().resolve()
    if not path.is_file():
        raise RuntimeError(f"Required AI artifact is missing: {environment_name}={path}")
    return path


PIPELINE_MODEL_PATH = artifact_path("PIPELINE_MODEL_PATH", AI_DIR / "saved_models" / "fake_job_model.pkl")
PIPELINE_VECTORIZER_PATH = artifact_path("PIPELINE_VECTORIZER_PATH", AI_DIR / "saved_models" / "tfidf_vectorizer.pkl")
AI_VERIFICATION_MODEL_PATH = artifact_path("AI_VERIFICATION_MODEL_PATH", BACKEND_DIR / "app" / "ai_model" / "fake_job_model.pkl")
AI_VERIFICATION_VECTORIZER_PATH = artifact_path("AI_VERIFICATION_VECTORIZER_PATH", BACKEND_DIR / "app" / "ai_model" / "tfidf_vectorizer.pkl")
