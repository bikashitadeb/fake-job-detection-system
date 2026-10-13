import importlib.util
import os
import pickle


def _load_joblib():
    if importlib.util.find_spec("joblib") is not None:
        return importlib.import_module("joblib")
    if importlib.util.find_spec("sklearn.externals.joblib") is not None:
        return importlib.import_module("sklearn.externals.joblib")

    class PickleJoblib:
        @staticmethod
        def load(path):
            with open(path, "rb") as f:
                return pickle.load(f)

    return PickleJoblib


joblib = _load_joblib()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "saved_models",
    "fake_job_model.pkl"
)


model = joblib.load(MODEL_PATH)


def predict(features):

    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(features)[0]

    confidence = max(probabilities)

    return {
        "prediction": int(prediction),
        "confidence": round(float(confidence), 4)
    }