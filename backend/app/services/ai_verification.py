import os
import joblib
import re
from scipy.sparse import hstack

from app.ai.artifacts import (
    AI_VERIFICATION_MODEL_PATH,
    AI_VERIFICATION_VECTORIZER_PATH,
)


# =====================================================
# PATH CONFIGURATION
# =====================================================


MODEL_PATH = AI_VERIFICATION_MODEL_PATH
VECTORIZER_PATH = AI_VERIFICATION_VECTORIZER_PATH





# =====================================================
# LOAD AI MODEL SAFELY
# =====================================================


model = None
vectorizer = None


# These features match backend/app/ai_model/train_model.py. The XGBoost model
# was trained on TF-IDF features plus these three numeric columns.
MODEL_SUSPICIOUS_WORDS = [
    "urgent",
    "guaranteed",
    "money",
    "pay",
    "fee",
    "deposit",
    "whatsapp",
    "telegram",
    "easy money",
    "work from home",
    "no experience",
    "limited seats",
]



try:


    model = joblib.load(MODEL_PATH)

    vectorizer = joblib.load(VECTORIZER_PATH)

    expected_features = getattr(model, "n_features_in_", None)
    actual_features = len(vectorizer.vocabulary_) + 3
    if expected_features is not None and expected_features != actual_features:
        raise RuntimeError(
            "AI model/vectorizer feature mismatch: "
            f"model expects {expected_features}, vectorizer pipeline produces {actual_features}."
        )



    print(
        "AI MODEL LOADED SUCCESSFULLY"
    )


except Exception as e:


    print(

        "AI MODEL LOAD ERROR:",

        e

    )









# =====================================================
# SUSPICIOUS JOB KEYWORDS
# =====================================================


SUSPICIOUS_KEYWORDS = [


    "pay registration fee",

    "urgent hiring",

    "no experience required",

    "earn money fast",

    "guaranteed job",

    "send otp",

    "bank details",

    "pay security deposit",

    "telegram interview",

    "whatsapp only",

    "crypto payment",

    "easy money",

    "work from home fee",

    "training fee"


]









# =====================================================
# KEYWORD ANALYSIS
# =====================================================


def detect_keywords(text):


    text = text.lower()



    found = []



    for keyword in SUSPICIOUS_KEYWORDS:


        if keyword in text:


            found.append(keyword)





    return found


def model_suspicious_count(text):
    normalized_text = text.lower()
    return sum(word in normalized_text for word in MODEL_SUSPICIOUS_WORDS)










# =====================================================
# SALARY ANOMALY DETECTION
# =====================================================


def salary_check(text):


    suspicious = False



    patterns = [

        r"\$\d{5,}",

        r"₹\d{6,}",

        r"\d+\s*lpa"

    ]



    for pattern in patterns:


        if re.search(

            pattern,

            text.lower()

        ):


            suspicious = True




    return suspicious










# =====================================================
# RISK CALCULATOR
# =====================================================


def calculate_risk(

    fake_probability,

    keyword_count

):


    risk = fake_probability



    risk += keyword_count * 5



    risk = min(

        risk,

        100

    )



    return round(

        risk,

        2

    )









def risk_level(score):


    if score >= 75:

        return "HIGH"



    elif score >=40:

        return "MEDIUM"



    return "LOW"









# =====================================================
# MAIN AI PREDICTION
# =====================================================


def predict_fake_job(data):


    try:



        text = (

            data.get(

                "title",

                ""

            )

            +

            " "

            +

            data.get(

                "company",

                ""

            )

            +

            " "

            +

            data.get(

                "description",

                ""

            )

            +

            " "

            +

            data.get(

                "requirements",

                ""

            )

        )





        keywords = detect_keywords(

            text

        )





        # DEFAULT VALUES

        probability = 0

        prediction = False

        confidence = 0







        # =================================================
        # MACHINE LEARNING PREDICTION
        # =================================================


        if model and vectorizer:



            tfidf_features = vectorizer.transform([text])
            numerical_features = [[
                model_suspicious_count(text),
                len(data.get("description", "")),
                1 if len(data.get("company", "")) > 10 else 0,
            ]]
            vector = hstack([tfidf_features, numerical_features])



            prediction = bool(

                model.predict(

                    vector

                )[0]

            )



            probability = (

                model.predict_proba(

                    vector

                )[0][1]

                *

                100

            )



            confidence = max(

                model.predict_proba(

                    vector

                )[0]

            ) * 100







        # =================================================
        # ADD NLP RISK
        # =================================================


        risk_score = calculate_risk(

            probability,

            len(keywords)

        )




        fake = (

            prediction

            or

            risk_score >=70

        )






        trust_score = round(

            100-risk_score,

            2

        )






        explanation = (

            "Job appears suspicious due to "

            +

            ", ".join(keywords)

            if keywords

            else

            "Job passed AI verification checks"

        )







        return {



            "is_fake":

            fake,




            "fake_probability":

            round(

                probability,

                2

            ),





            "trust_score":

            trust_score,





            "ai_confidence":

            round(

                confidence,

                2

            ),





            "risk_score":

            risk_score,





            "risk_level":

            risk_level(

                risk_score

            ),





            "suspicious_keywords":

            keywords,





            "keyword_count":

            len(keywords),





            "salary_anomaly":

            salary_check(text),





            "ai_explanation":

            explanation,





            "model":

            "TFIDF + ML"



        }






    except Exception as e:



        print(

            "AI PREDICTION ERROR:",

            e

        )




        return {



            "is_fake":

            False,



            "fake_probability":

            0,



            "trust_score":

            50,



            "ai_confidence":

            0,



            "risk_score":

            50,



            "risk_level":

            "MEDIUM",



            "suspicious_keywords":

            [],



            "keyword_count":

            0,



            "salary_anomaly":

            False,



            "ai_explanation":

            "AI verification unavailable"



        }
