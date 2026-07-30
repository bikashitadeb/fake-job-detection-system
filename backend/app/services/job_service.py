from app.extensions import db

from app.models.job_model import Job

from app.services.ai_verification import predict_fake_job

from app.services.linkedin_verification import verify_company






# =====================================================
# CREATE JOB
# RECRUITER
# =====================================================


def create_job(

        data,

        recruiter_id

):


    try:



        company_name = data.get(

            "company",

            "Unknown Company"

        )





        # ===============================
        # AI VERIFICATION
        # ===============================


        ai_result = predict_fake_job({


            "title":

            data.get(

                "title",

                ""

            ),



            "company":

            company_name,



            "description":

            data.get(

                "description",

                ""

            ),



            "requirements":

            data.get(

                "requirements",

                ""

            )


        })








        # ===============================
        # COMPANY VERIFICATION
        # ===============================


        linkedin_result = verify_company(

            company_name

        )







        final_trust = (


            ai_result.get(

                "trust_score",

                50

            )

            *

            0.7



            +

            linkedin_result.get(

                "score",

                0

            )

            *

            0.3



        )









        job = Job(



            title=data.get(

                "title"

            ),



            description=data.get(

                "description"

            ),



            location=data.get(

                "location"

            ),



            salary=data.get(

                "salary"

            ),



            requirements=data.get(

                "requirements"

            ),




            recruiter_id=recruiter_id,






            # AI RESULTS


            is_fake_predicted=

            ai_result.get(

                "is_fake",

                False

            ),




            fake_probability=

            ai_result.get(

                "fake_probability",

                0

            ),






            trust_score=

            round(

                final_trust,

                2

            ),





            risk_score=

            ai_result.get(

                "risk_score",

                0

            ),






            risk_level=

            ai_result.get(

                "risk_level",

                "LOW"

            ),






            ai_warnings=

            str(

                ai_result.get(

                    "suspicious_keywords",

                    []

                )

            ),





            ai_explanation=

            ai_result.get(

                "ai_explanation"

            ),






            # COMPANY VERIFICATION


            linkedin_verified=

            linkedin_result.get(

                "verified",

                False

            ),



            linkedin_url=

            linkedin_result.get(

                "linkedin_url"

            ),




            company_verified=

            linkedin_result.get(

                "verified",

                False

            ),






            status=(

                "verified"

                if final_trust >=70

                else

                "pending"

            )



        )






        db.session.add(

            job

        )


        db.session.commit()



        return job







    except Exception as e:


        db.session.rollback()


        raise e












# =====================================================
# GET ALL JOBS
# =====================================================


def get_all_jobs():


    return Job.query.order_by(

        Job.created_at.desc()

    ).all()











# =====================================================
# GET ACTIVE JOBS
# =====================================================


def get_active_jobs():


    return Job.query.filter_by(

        is_active=True

    ).order_by(

        Job.created_at.desc()

    ).all()











# =====================================================
# GET SINGLE JOB
# =====================================================


def get_job(job_id):


    return Job.query.get(

        job_id

    )









# =====================================================
# UPDATE JOB
# =====================================================


def update_job(

        job_id,

        data

):


    try:



        job = Job.query.get(

            job_id

        )




        if not job:


            raise Exception(

                "Job not found"

            )







        allowed_fields = [



            "title",



            "description",



            "location",



            "salary",



            "requirements",



            "status",



            "is_active"



        ]








        for key,value in data.items():



            if key in allowed_fields:



                setattr(

                    job,

                    key,

                    value

                )







        db.session.commit()



        return job





    except Exception as e:


        db.session.rollback()


        raise e











# =====================================================
# DELETE JOB
# =====================================================


def delete_job(job_id):


    try:



        job = Job.query.get(

            job_id

        )





        if not job:


            raise Exception(

                "Job not found"

            )







        db.session.delete(

            job

        )


        db.session.commit()



        return True






    except Exception as e:



        db.session.rollback()



        raise e