from app.ml.model_loader import load_model
from app.ml.preprocessor import clean_text



def predict_job(description):

    model = load_model()


    cleaned_text = clean_text(
        description
    )


    prediction = model.predict(
        [cleaned_text]
    )[0]


    probability = model.predict_proba(
        [cleaned_text]
    )[0][1]



    return {

        "is_fake_predicted": bool(
            prediction
        ),

        "fake_probability": float(
            round(
                probability * 100,
                2
            )
        )

    }