# app/services/ai_prediction_service.py


from app.extensions import db


from app.ai.pipeline import run_ai_pipeline


from app.models.prediction_model import Prediction


from app.services.job_risk_analysis import analyze_job


from app.services.linkedin_verification import verify_company


from app.services.notification_service import notify_job_flagged





# =====================================================
# AI JOB ANALYSIS + SAVE PREDICTION
# =====================================================


def analyze_and_save_job(job):


    try:



        # =====================================
        # COMPANY VERIFICATION
        # =====================================


        company_name = (

            job.company.company_name

            if job.company

            else

            "Unknown"

        )



        linkedin_result = verify_company(

            company_name

        )







        # =====================================
        # RULE BASED FRAUD ANALYSIS
        # =====================================


        risk_result = analyze_job(

            job.description

        )









        # =====================================
        # AI PIPELINE INPUT
        # =====================================


        job_data = {


            "title":

            job.title,



            "description":

            job.description,



            "salary":

            job.salary,



            "company_verified":

            linkedin_result.get(

                "verified",

                False

            ),



            "email_verified":

            False,



            "linkedin_verified":

            linkedin_result.get(

                "verified",

                False

            ),



            "risk_score":

            risk_result.get(

                "risk_score",

                0

            )

        }








        # =====================================
        # MACHINE LEARNING PREDICTION
        # =====================================


        result = run_ai_pipeline(

            job_data

        )








        # =====================================
        # FINAL TRUST SCORE
        # =====================================


        trust_score = (

            result.get(

                "trust_score",

                0

            )

            +

            linkedin_result.get(

                "score",

                0

            )

        ) / 2








        # =====================================
        # SAVE PREDICTION
        # =====================================


        prediction = Prediction(



            job_id=job.id,



            ml_label=result.get(

                "ml_prediction",

                "unknown"

            ),



            ml_confidence=result.get(

                "ml_confidence",

                0

            ),



            rule_score=risk_result.get(

                "risk_score",

                0

            ),



            trust_score=round(

                trust_score,

                2

            ),



            risk_level=risk_result.get(

                "risk_level",

                "LOW"

            ),



            final_verdict=result.get(

                "status",

                "pending"

            ),



            explanation=result.get(

                "explanation",

                "AI analysis completed"

            )



        )







        db.session.add(

            prediction

        )








        # =====================================
        # UPDATE JOB MODEL
        # =====================================


        job.is_fake_predicted = (

            result.get(

                "ml_prediction"

            )

            ==

            "fake"

        )



        job.fake_probability = result.get(

            "ml_confidence",

            0

        )



        job.trust_score = round(

            trust_score,

            2

        )



        job.risk_score = risk_result.get(

            "risk_score",

            0

        )



        job.risk_level = risk_result.get(

            "risk_level",

            "LOW"

        )



        job.ai_warnings = str(

            risk_result.get(

                "warnings",

                []

            )

        )



        job.ai_explanation = result.get(

            "explanation"

        )









        db.session.commit()








        # =====================================
        # NOTIFY IF FAKE
        # =====================================


        if job.is_fake_predicted:


            notify_job_flagged(

                job

            )







        return prediction.to_dict()







    except Exception as e:



        db.session.rollback()



        print(

            "AI ANALYSIS ERROR:",

            e

        )



        raise e