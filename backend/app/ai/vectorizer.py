import importlib
import os

joblib_spec = importlib.util.find_spec("joblib")
if joblib_spec is not None:
    joblib = importlib.import_module("joblib")
else:
    import pickle as joblib


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


VECTORIZER_PATH = os.path.join(
    BASE_DIR,
    "saved_models",
    "tfidf_vectorizer.pkl"
)


try:
    vectorizer = joblib.load(VECTORIZER_PATH)
except Exception:
    vectorizer = None


def transform(text):

    return vectorizer.transform([text])