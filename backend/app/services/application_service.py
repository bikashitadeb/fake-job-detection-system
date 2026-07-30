from app.extensions import db

from app.models.application_model import Application
from app.models.job_model import Job






# =====================================================
# APPLICATION STATUS PIPELINE
# =====================================================


ALLOWED_STATUS = [

    "pending",

    "shortlisted",

    "interview",

    "selected",

    "rejected",

    "offered"

]









# =====================================================
# APPLY FOR JOB
# EMPLOYEE
# =====================================================


def apply_job(

        data,

        jobseeker_id

):


    try:



        job_id = data.get(

            "job_id"

        )




        if not job_id:


            raise Exception(

                "Job id required"

            )






        job = Job.query.get(

            job_id

        )





        if not job:


            raise Exception(

                "Job not found"

            )







        if not job.is_active:


            raise Exception(

                "Job is closed"

            )







        existing = Application.query.filter_by(


            job_id=job_id,


            jobseeker_id=jobseeker_id


        ).first()







        if existing:


            raise Exception(

                "Already applied for this job"

            )








        application = Application(




            job_id=job.id,



            jobseeker_id=jobseeker_id,



            cover_letter=data.get(

                "cover_letter",

                ""

            ),



            resume_url=data.get(

                "resume_url"

            ),



            portfolio_url=data.get(

                "portfolio_url"

            ),



            github_url=data.get(

                "github_url"

            ),



            linkedin_url=data.get(

                "linkedin_url"

            ),




            status="pending"



        )








        db.session.add(

            application

        )






        # Update analytics


        job.application_count = (

            job.application_count or 0

        ) + 1






        db.session.commit()






        return application






    except Exception as e:



        db.session.rollback()



        raise e










# =====================================================
# GET EMPLOYEE APPLICATIONS
# =====================================================


def get_my_applications(

        user_id

):


    return Application.query.filter_by(


        jobseeker_id=user_id


    ).order_by(


        Application.applied_at.desc()


    ).all()










# =====================================================
# RECRUITER VIEW APPLICATIONS
# =====================================================


def get_job_applications(

        job_id

):


    return Application.query.filter_by(


        job_id=job_id


    ).order_by(


        Application.applied_at.desc()


    ).all()










# =====================================================
# UPDATE APPLICATION STATUS
# =====================================================


def update_status(

        application_id,

        status,

        notes=None

):



    try:



        application = Application.query.get(

            application_id

        )





        if not application:


            raise Exception(

                "Application not found"

            )







        if status not in ALLOWED_STATUS:


            raise Exception(

                "Invalid application status"

            )







        application.status = status






        if notes:


            application.recruiter_notes = notes







        db.session.commit()





        return application





    except Exception as e:



        db.session.rollback()



        raise e










# =====================================================
# WITHDRAW APPLICATION
# EMPLOYEE
# =====================================================


def withdraw_application(

        application_id

):



    try:



        application = Application.query.get(

            application_id

        )





        if not application:


            raise Exception(

                "Application not found"

            )







        # Reduce job count


        if application.job:


            application.job.application_count = max(


                0,


                (

                    application.job.application_count or 1

                )

                - 1


            )







        db.session.delete(

            application

        )



        db.session.commit()





        return True





    except Exception as e:



        db.session.rollback()



        raise e










# =====================================================
# AI RESUME ANALYSIS UPDATE
# FUTURE READY
# =====================================================


def update_ai_scores(

        application_id,

        scores

):


    application = Application.query.get(

        application_id

    )




    if not application:


        raise Exception(

            "Application not found"

        )





    application.resume_score = scores.get(

        "resume_score",

        0

    )



    application.skill_match_score = scores.get(

        "skill_match_score",

        0

    )



    application.ai_match_score = scores.get(

        "ai_match_score",

        0

    )



    application.ai_recommendation = scores.get(

        "recommendation"

    )





    db.session.commit()





    return application