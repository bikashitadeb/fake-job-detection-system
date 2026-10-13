import os
import pickle
import importlib
import importlib.util

# Prefer joblib if available, fall back to pickle. Use importlib to avoid
# static import errors when joblib isn't installed.
_load = None
if importlib.util.find_spec("joblib") is not None:
    joblib = importlib.import_module("joblib")
    _load = joblib.load
else:
    def _load(path):
        with open(path, "rb") as f:
            return pickle.load(f)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


VECTORIZER_PATH = os.path.join(
    BASE_DIR,
    "saved_models",
    "tfidf_vectorizer.pkl"
)


if not os.path.exists(VECTORIZER_PATH):
    raise FileNotFoundError(f"Vectorizer file not found: {VECTORIZER_PATH}")

vectorizer = _load(VECTORIZER_PATH)



def transform(text):

    return vectorizer.transform([text])