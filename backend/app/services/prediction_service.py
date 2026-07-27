from app.extensions import db

from app.ai.pipeline import run_ai_pipeline

from app.models.prediction_model import Prediction



def analyze_and_save_job(job):

    job_data = {

        "title": job.title,

        "description": job.description,

        "salary": job.salary,

        "company_verified": False,

        "email_verified": False,

        "linkedin_verified": False
    }


    result = run_ai_pipeline(
        job_data
    )


    prediction = Prediction(

        job_id=job.id,

        ml_label=result["ml_prediction"],

        ml_confidence=result["ml_confidence"],

        rule_score=result["rule_score"],

        trust_score=result["trust_score"],

        risk_level=result["risk_level"],

        final_verdict=result["status"],

        explanation=result["explanation"]

    )


    db.session.add(prediction)

    db.session.commit()


    return prediction.to_dict()