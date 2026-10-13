import os
import joblib


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "fake_job_model.pkl"
)


model = None



def load_model():

    global model


    if model is None:

        model = joblib.load(
            MODEL_PATH
        )


    return model