from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.extensions import db

from app.models.job_model import Job
from app.models.user_model import User

from app.services.linkedin_verification import verify_company
from app.services.ai_verification import predict_fake_job




job_bp = Blueprint(

    "jobs",

    __name__,

    url_prefix="/api/jobs"

)





# =====================================
# GET ALL JOBS
# EMPLOYEE DASHBOARD
# =====================================


@job_bp.route(
    "",
    methods=["GET"]
)

def get_jobs():


    try:


        jobs = Job.query.order_by(

            Job.created_at.desc()

        ).all()



        return jsonify({

            "jobs":[

                job.to_dict()

                for job in jobs

            ]

        }),200



    except Exception as e:


        print(
            "GET JOB ERROR:",
            e
        )


        return jsonify({

            "message":str(e)

        }),500







# =====================================
# GET SINGLE JOB
# =====================================


@job_bp.route(
    "/<int:id>",
    methods=["GET"]
)

def get_job(id):


    job = Job.query.get(id)



    if not job:


        return jsonify({

            "message":"Job not found"

        }),404





    return jsonify({

        "job":job.to_dict()

    }),200







# =====================================
# CREATE JOB
# RECRUITER
# AI + LINKEDIN VERIFICATION
# =====================================


@job_bp.route(
    "",
    methods=["POST"]
)

@jwt_required()

def create_job():


    try:


        user_id = int(

            get_jwt_identity()

        )


        user = User.query.get(user_id)



        if not user:


            return jsonify({

                "message":"User not found"

            }),404





        if user.role != "recruiter":


            return jsonify({

                "message":
                "Only recruiters can post jobs"

            }),403






        data = request.get_json()



        print(
            "JOB DATA:",
            data
        )







        company_name = (

            data.get("company")

            or

            "Unknown Company"

        )





        # =================================
        # LINKEDIN COMPANY VERIFICATION
        # =================================


        linkedin_result = verify_company(

            company_name

        )






        # =================================
        # AI FAKE JOB PREDICTION
        # =================================


        ai_result = predict_fake_job(

            {

            "title":
            data.get("title",""),


            "company":
            company_name,


            "description":
            data.get("description",""),


            "requirements":
            data.get("requirements","")

            }

        )







        # =================================
        # FINAL TRUST SCORE
        # =================================


        final_trust_score = (

            ai_result["trust_score"] * 0.7

            +

            linkedin_result["score"] * 0.3

        )









        job = Job(


            title=data.get(
                "title"
            ),



            description=data.get(
                "description"
            ),



            company=company_name,



            location=data.get(
                "location"
            ),



            salary=data.get(
                "salary"
            ),



            requirements=data.get(
                "requirements"
            ),





            recruiter_id=user.id,






            # AI RESULTS

            is_fake_predicted=

            ai_result["is_fake"],



            fake_probability=

            ai_result["fake_probability"],



            trust_score=

            round(
                final_trust_score,
                2
            ),






            # LINKEDIN RESULTS


            linkedin_verified=

            linkedin_result["verified"],



            linkedin_url=

            linkedin_result["linkedin_url"],



            company_verified=

            linkedin_result["verified"],







            status=

            "verified"

            if final_trust_score >= 70

            else

            "pending"




        )





        db.session.add(job)

        db.session.commit()





        return jsonify({


            "message":

            "Job posted successfully",




            "ai_result":

            ai_result,




            "linkedin_result":

            linkedin_result,




            "job":

            job.to_dict()



        }),201







    except Exception as e:



        db.session.rollback()



        print(

            "CREATE JOB ERROR:",

            e

        )



        return jsonify({

            "message":str(e)

        }),500











# =====================================
# RECRUITER OWN JOBS
# =====================================


@job_bp.route(
    "/my-jobs",
    methods=["GET"]
)

@jwt_required()

def my_jobs():


    try:


        user_id = int(

            get_jwt_identity()

        )



        jobs = Job.query.filter_by(

            recruiter_id=user_id

        ).all()





        return jsonify({

            "jobs":[

                job.to_dict()

                for job in jobs

            ]

        }),200




    except Exception as e:


        print(
            "MY JOB ERROR:",
            e
        )


        return jsonify({

            "message":str(e)

        }),500