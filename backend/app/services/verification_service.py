# app/services/verification_service.py


from datetime import datetime, timezone


from app.extensions import db


from app.models.verification_model import Verification

from app.models.job_model import Job

from app.models.flag_log_model import FlagLog





# =====================================================
# VERIFY JOB DETAILS
# =====================================================


def verify_job_details(job):


    if not job:


        raise Exception(

            "Job not found"

        )





    try:



        # -----------------------------
        # COMPANY CHECK
        # -----------------------------


        linkedin_verified = (

            job.linkedin_verified

            if hasattr(job, "linkedin_verified")

            else False

        )



        company_verified = (

            job.company_verified

            if hasattr(job, "company_verified")

            else False

        )





        website_score = 80 if company_verified else 30



        linkedin_score = 90 if linkedin_verified else 20





        # -----------------------------
        # AI TRUST SCORE
        # -----------------------------


        ai_score = (

            job.trust_score

            if job.trust_score

            else 0

        )







        overall_score = round(

            (

                website_score * 0.25

                +

                linkedin_score * 0.35

                +

                ai_score * 0.40

            ),

            2

        )








        # -----------------------------
        # RISK LEVEL
        # -----------------------------


        if overall_score >= 80:


            risk_level = "LOW"

            status = "verified"



        elif overall_score >=50:


            risk_level = "MEDIUM"

            status = "needs_review"



        else:


            risk_level = "HIGH"

            status = "rejected"









        issues=[]



        if not linkedin_verified:


            issues.append(

                "LinkedIn verification failed"

            )



        if not company_verified:


            issues.append(

                "Company verification incomplete"

            )








        # -----------------------------
        # SAVE VERIFICATION
        # -----------------------------


        verification = Verification(


            job_id=job.id,


            website_verified=company_verified,


            website_score=website_score,



            linkedin_verified=linkedin_verified,


            linkedin_score=linkedin_score,



            company_score=overall_score,



            recruiter_score=70,



            overall_score=overall_score,



            risk_level=risk_level,



            status=status,



            detected_issues=issues,



            verification_notes=(

                "AI verification completed"

            )



        )




        db.session.add(

            verification

        )



        db.session.commit()





        return verification.to_dict()





    except Exception as e:


        db.session.rollback()


        raise e











# =====================================================
# GET VERIFICATION HISTORY
# =====================================================


def get_verification_history(job_id):


    records = Verification.query.filter_by(

        job_id=job_id

    ).order_by(

        Verification.created_at.desc()

    ).all()





    return [


        record.to_dict()

        for record in records


    ]









# =====================================================
# FLAG SUSPICIOUS JOB
# =====================================================


def flag_job(job_id, reason, user_id=None):


    try:



        job = Job.query.get(

            job_id

        )





        if not job:


            raise Exception(

                "Job not found"

            )








        # -----------------------------
        # Update Job Risk
        # -----------------------------


        if hasattr(job, "risk_level"):


            job.risk_level = "HIGH"




        if hasattr(job, "status"):


            job.status = "pending"








        # -----------------------------
        # Create Fraud Log
        # -----------------------------


        flag = FlagLog(


            job_id=job.id,


            reported_by_user_id=user_id,


            source="employee",



            detection_type="fake_job_detection",



            severity="high",



            reason=reason,



            status="pending"



        )





        db.session.add(flag)








        db.session.commit()






        return {



            "job_id":job.id,


            "flagged":True,


            "risk_level":"HIGH",


            "reason":reason



        }






    except Exception as e:


        db.session.rollback()


        raise e