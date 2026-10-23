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


        linkedin_result = verify_company(company_name)





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

            ),

            "salary": data.get("salary", ""),

            "company_verified": linkedin_result.get("verified", False),

            "company_score": linkedin_result.get("score", 0),

            "website": data.get("website"),

            "official_email": data.get("official_email"),

            "linkedin_url": data.get("linkedin_url") or linkedin_result.get("linkedin_url"),


        })








        # ===============================
        # COMPANY VERIFICATION
        # ===============================


        final_trust = float(ai_result.get("trust_score", 50))
        is_fake = bool(ai_result.get("is_fake", False))
        risk_level_value = ai_result.get("risk_level", "LOW")









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

            is_fake,




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

            risk_level_value,






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

            verification_status="pending",

            is_flagged=is_fake,

            flag_reason=ai_result.get("ai_explanation") if is_fake else None,






            status=(
                "flagged"
                if is_fake
                else (
                    "verified"
                    if risk_level_value == "LOW" and linkedin_result.get("verified", False)
                    else "pending"
                )
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