import os
import joblib



BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)


MODEL_PATH = os.path.join(
    BASE_DIR,
    "ai_model",
    "fake_job_model.pkl"
)


VECTORIZER_PATH = os.path.join(
    BASE_DIR,
    "ai_model",
    "tfidf_vectorizer.pkl"
)



model = joblib.load(
    MODEL_PATH
)


vectorizer = joblib.load(
    VECTORIZER_PATH
)




def predict_fake_job(data):


    text = (

        data.get("title","")

        + " "

        + data.get("company","")

        + " "

        + data.get("description","")

        + " "

        + data.get("requirements","")

    )



    vector = vectorizer.transform(
        [text]
    )



    prediction = model.predict(
        vector
    )[0]


    probability = model.predict_proba(
        vector
    )[0][1]



    return {


        "is_fake": bool(prediction),


        "fake_probability": round(
            probability * 100,
            2
        ),


        "trust_score": round(
            (1 - probability) * 100,
            2
        )

    }