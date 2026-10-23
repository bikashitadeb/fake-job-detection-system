import joblib

from app.ai.artifacts import PIPELINE_VECTORIZER_PATH


vectorizer = joblib.load(PIPELINE_VECTORIZER_PATH)


def transform(text):
    return vectorizer.transform([text])
