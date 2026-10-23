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

    "guaranteed income",

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


def _normalize_risk_text(text):
    return str(text or "").lower().replace("\u2013", "-").replace("\u2014", "-")


FEE_TERM_PATTERN = re.compile(
    r"\b(?:registration|security|application|training)"
    r"(?:\s*/\s*(?:registration|security))?\s+"
    r"(?:fee|fees|deposit|payment|charge|charges)\b"
)
FEE_DENIAL_PATTERN = re.compile(
    r"\b(?:no|not|never|without|does not|doesn't|do not|don't)\b"
    r".{0,55}\b(?:fees?|deposits?|payments?|charges?)\b"
)
FEE_REQUEST_PATTERN = re.compile(
    r"\b(?:pay|send|transfer|submit|deposit|must pay|required to pay)\b"
    r".{0,55}\b(?:fees?|deposits?|payments?|charges?)\b"
)
FEE_MANDATORY_PATTERN = re.compile(
    FEE_TERM_PATTERN.pattern + r".{0,25}\b(?:required|mandatory|must)\b"
)
MONEY_PATTERN = re.compile(r"(?:\u20b9|\brs\.?\s*|\binr\s*)\s*\d[\d,]*(?:\.\d+)?", re.I)


def fee_request_detected(text):
    for clause in re.split(r"[.!?;\n]+", _normalize_risk_text(text)):
        if not FEE_TERM_PATTERN.search(clause):
            continue

        denied = FEE_DENIAL_PATTERN.search(clause)
        amount_near_fee = MONEY_PATTERN.search(clause) is not None
        explicit_request = (
            FEE_REQUEST_PATTERN.search(clause) is not None
            or FEE_MANDATORY_PATTERN.search(clause) is not None
        )
        if (amount_near_fee or explicit_request) and not denied:
            return True

    return False


def salary_check(text, salary=None):
    """Flag unusually high recurring pay, not ordinary annual LPA salaries."""
    combined = _normalize_risk_text(f"{text or ''} {salary or ''}")
    amount_pattern = re.compile(
        r"(?P<amount>one|two|three|\d[\d,]*(?:\.\d+)?)\s*"
        r"(?P<scale>lakhs?|lacs?)?\s*\+?\s*"
        r"(?P<period>per\s+week|weekly|every\s+week|a\s+week|/\s*week|"
        r"per\s+month|monthly|/\s*month|lpa|per\s+year|annually)",
        re.I,
    )

    for match in amount_pattern.finditer(combined):
        amount_text = match.group("amount")
        word_amounts = {"one": 1, "two": 2, "three": 3}
        amount = (
            word_amounts[amount_text]
            if amount_text in word_amounts
            else float(amount_text.replace(",", ""))
        )
        if match.group("scale"):
            amount *= 100_000

        period = re.sub(r"\s+", " ", match.group("period").lower())
        if period in {"per week", "weekly", "every week", "a week", "/ week", "/week"}:
            if amount >= 50_000:
                return True
        elif period in {"per month", "monthly", "/ month", "/month"}:
            if amount >= 500_000:
                return True
        elif period == "lpa":
            if amount >= 100:
                return True
        elif amount >= 10_000_000:
            return True

    return False


def detect_keywords(text, salary=None):
    normalized = _normalize_risk_text(f"{text or ''} {salary or ''}")
    found = [keyword for keyword in SUSPICIOUS_KEYWORDS if keyword in normalized]

    if fee_request_detected(normalized):
        found.append("upfront fee request")
    if re.search(r"\bguaranteed\s+(?:income|earnings?|salary|returns?)\b", normalized):
        found.append("guaranteed income")
    if re.search(
        r"\bearn\b.{0,35}(?:\u20b9\s*)?(?:\d[\d,]*|one|a)\s*(?:lakhs?|lacs?)\b",
        normalized,
    ):
        found.append("extreme earnings promise")
    if re.search(r"\b1\s*(?:-|to)\s*2\s*hours?\b", normalized):
        found.append("very short work hours")
    if re.search(
        r"\b(?:immediate hiring|hiring immediately|immediate joining|start immediately)\b",
        normalized,
    ):
        found.append("immediate hiring")
    if salary_check(text, salary):
        found.append("unusually high recurring salary")

    return list(dict.fromkeys(found))


def model_suspicious_count(text):
    normalized_text = text.lower()
    return sum(word in normalized_text for word in MODEL_SUSPICIOUS_WORDS)










# =====================================================
# RISK CALCULATOR
# =====================================================


def calculate_risk(

    fake_probability,

    keyword_count,

    risk_signals=None,

):


    risk = float(fake_probability) + min(keyword_count * 5, 25)
    risk += sum(signal["points"] for signal in (risk_signals or []))
    return round(min(risk, 100), 2)


def collect_risk_signals(data, text, salary_anomaly):
    normalized = _normalize_risk_text(text)
    signals = []

    def add(code, reason, points):
        signals.append({"code": code, "reason": reason, "points": points})

    if fee_request_detected(normalized):
        add("upfront_fee_request", "The posting requests a registration or security payment.", 45)

    if re.search(r"\bguaranteed\s+(?:income|earnings?|salary|returns?)\b", normalized):
        add("guaranteed_income", "The posting promises guaranteed income.", 15)

    if salary_anomaly:
        add("extreme_recurring_salary", "The advertised recurring salary is unusually high.", 20)

    short_hours = re.search(r"\b1\s*(?:-|to)\s*2\s*hours?\b", normalized)
    high_return_claim = salary_anomaly or re.search(
        r"\b(?:lakh|lakhs|lac|lacs)\b.{0,25}\b(?:weekly|week)\b|"
        r"\b(?:weekly|week)\b.{0,25}\b(?:lakh|lakhs|lac|lacs)\b",
        normalized,
    )
    if short_hours and high_return_claim:
        add("low_effort_high_return", "High earnings are promised for very short work hours.", 15)

    if re.search(
        r"\b(?:immediate hiring|hiring immediately|immediate joining|start immediately)\b",
        normalized,
    ):
        add("immediate_hiring", "The posting pressures applicants with immediate hiring language.", 5)

    if data.get("company_verified") is False:
        try:
            company_score = float(data.get("company_score", 40))
        except (TypeError, ValueError):
            company_score = 40
        points = min(15, max(5, round((100 - company_score) * 0.15)))
        add("unverified_company", "The company could not be verified.", points)

    if "website" in data and not str(data.get("website") or "").strip():
        add("missing_company_website", "No company website was provided.", 4)

    if "linkedin_url" in data and not str(data.get("linkedin_url") or "").strip():
        add("missing_linkedin", "No company LinkedIn profile was provided or verified.", 4)

    email = str(data.get("official_email") or "").strip().lower()
    if "official_email" in data and not email:
        add("missing_official_email", "No contact email was provided.", 3)

    email_domain = email.rsplit("@", 1)[-1] if "@" in email else ""
    personal_email_domains = {
        "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
        "rediffmail.com", "icloud.com", "proton.me", "protonmail.com",
    }
    if email_domain in personal_email_domains:
        add("personal_email_provider", "The contact email uses a public email provider.", 8)

    return signals









def risk_level(score):


    if score >= 70:

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





        salary = data.get("salary") or ""
        risk_text = f"{text} {salary}"
        keywords = detect_keywords(text, salary)





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


        salary_anomaly = salary_check(text, salary)
        risk_signals = collect_risk_signals(data, risk_text, salary_anomaly)
        risk_score = calculate_risk(probability, len(keywords), risk_signals)

        # Keep the XGBoost class decision and the published risk fields aligned.
        if prediction:
            risk_score = max(risk_score, 75)




        fake = (

            prediction

            or

            risk_score >=70

        )






        trust_score = round(

            100-risk_score,

            2

        )






        explanation = "; ".join(signal["reason"] for signal in risk_signals)
        if not explanation and keywords:
            explanation = "Suspicious language detected: " + ", ".join(keywords)
        if not explanation and prediction:
            explanation = "The XGBoost model classified this posting as suspicious."
        if not explanation:
            explanation = "No strong fraud indicators detected."







        return {



            "is_fake":

            fake,


            "xgboost_prediction":

            prediction,




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


            "risk_signals":

            risk_signals,





            "salary_anomaly":

            salary_anomaly,





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


            "xgboost_prediction":

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


            "risk_signals":

            [],



            "keyword_count":

            0,



            "salary_anomaly":

            False,



            "ai_explanation":

            "AI verification unavailable"



        }
