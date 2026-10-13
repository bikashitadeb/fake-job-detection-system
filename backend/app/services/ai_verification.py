import os
import joblib
import re


# =====================================================
# PATH CONFIGURATION
# =====================================================


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





# =====================================================
# LOAD AI MODEL SAFELY
# =====================================================


model = None
vectorizer = None



try:


    if os.path.exists(MODEL_PATH):

        model = joblib.load(
            MODEL_PATH
        )



    if os.path.exists(VECTORIZER_PATH):

        vectorizer = joblib.load(
            VECTORIZER_PATH
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



            vector = vectorizer.transform(

                [text]

            )



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