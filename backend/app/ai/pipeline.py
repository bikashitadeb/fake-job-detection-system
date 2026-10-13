from app.ai.preprocessing import preprocess_text
from app.ai.vectorizer import transform
from app.ai.model import predict
from app.ai.rule_engine import analyze_job
from app.ai.trust_score import calculate_trust_score
from app.ai.explain import generate_explanation


def run_ai_pipeline(job_data: dict):
    """
    Complete Fake Job Detection Pipeline

    Flow:
    Text
      ↓
    Preprocessing
      ↓
    TF-IDF
      ↓
    Multinomial Naive Bayes
      ↓
    Rule Engine
      ↓
    Trust Score
      ↓
    Explainable AI
    """


    # -----------------------------
    # Combine Job Information
    # -----------------------------

    job_text = (
        job_data.get("title", "")
        + " "
        + job_data.get("description", "")
    )


    # -----------------------------
    # Text Preprocessing
    # -----------------------------

    cleaned_text = preprocess_text(
        job_text
    )


    # -----------------------------
    # TF-IDF Features
    # -----------------------------

    features = transform(
        cleaned_text
    )


    # -----------------------------
    # ML Prediction
    # -----------------------------

    ml_result = predict(
        features
    )


    ml_prediction = ml_result["prediction"]

    ml_confidence = ml_result["confidence"]



    # -----------------------------
    # Rule Based Detection
    # -----------------------------

    rule_result = analyze_job(
        job_data
    )


    rule_score = rule_result["rule_score"]

    rule_reasons = rule_result["reasons"]



    # -----------------------------
    # Verification Scores
    # -----------------------------

    company_score = (
        100
        if job_data.get("company_verified")
        else 40
    )


    email_score = (
        100
        if job_data.get("email_verified")
        else 50
    )


    linkedin_score = (
        100
        if job_data.get("linkedin_verified")
        else 50
    )



    # -----------------------------
    # Trust Score
    # -----------------------------

    trust_result = calculate_trust_score(
        ml_confidence,
        rule_score,
        company_score,
        email_score,
        linkedin_score
    )


    trust_score = trust_result["trust_score"]

    risk_level = trust_result["risk_level"]



    # -----------------------------
    # Explainable AI
    # -----------------------------

    explanation = generate_explanation(
        ml_prediction,
        ml_confidence,
        rule_reasons,
        trust_score,
        job_data.get("company_verified", False),
        job_data.get("email_verified", False),
        job_data.get("linkedin_verified", False)
    )



    # -----------------------------
    # Final Result
    # -----------------------------

    return {

        "ml_prediction":
            "fake"
            if ml_prediction == 1
            else "real",


        "ml_confidence":
            ml_confidence,


        "rule_score":
            rule_score,


        "trust_score":
            trust_score,


        "risk_level":
            risk_level,


        "status":
            explanation["status"],


        "explanation":
            explanation["explanation"]
    }