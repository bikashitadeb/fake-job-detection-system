from app.ai.model import model


def predict(features):

    prediction = model.predict(features)[0]

    probability = max(model.predict_proba(features)[0])

    return prediction, float(probability)