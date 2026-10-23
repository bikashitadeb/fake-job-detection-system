import joblib

from app.ai.artifacts import PIPELINE_MODEL_PATH


model = joblib.load(PIPELINE_MODEL_PATH)


def predict(features):
    prediction = model.predict(features)[0]
    confidence = max(model.predict_proba(features)[0])
    return {"prediction": int(prediction), "confidence": round(float(confidence), 4)}
