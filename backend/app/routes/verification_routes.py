# app/routes/verification_routes.py


from flask import Blueprint, request, jsonify


from flask_jwt_extended import (

    jwt_required,

    get_jwt_identity

)



import logging



from app.services import (

    verification_service,

    job_service

)



from app.models.user_model import User

from app.models.job_model import Job



from app.extensions import db



from app.utils.responses import success_response







logger = logging.getLogger(__name__)







verification_bp = Blueprint(

    "verification",

    __name__,

    url_prefix="/api/verification"

)









# =====================================================
# VERIFY JOB
# POST /api/verification/verify/<job_id>
# =====================================================


@verification_bp.post(

    "/verify/<int:job_id>"

)

@jwt_required()

def verify_job(job_id):


    try:



        user_id = int(

            get_jwt_identity()

        )



        user = User.query.get(

            user_id

        )





        if not user:


            return jsonify({

                "success":False,

                "message":

                "User not found"

            }),404






        if user.role not in [

            "recruiter",

            "admin"

        ]:


            return jsonify({

                "success":False,

                "message":

                "Access denied"

            }),403







        job = job_service.get_job(

            job_id

        )





        if not job:


            return jsonify({

                "success":False,

                "message":

                "Job not found"

            }),404







        result = verification_service.verify_job_details(

            job

        )






        return success_response(

            "Job verification completed.",

            data=result

        )






    except Exception as e:


        logger.error(

            "JOB VERIFICATION ERROR: %s",

            e

        )



        return jsonify({


            "success":False,


            "message":str(e)



        }),500













# =====================================================
# VERIFICATION HISTORY
# GET /api/verification/history/<job_id>
# =====================================================


@verification_bp.get(

    "/history/<int:job_id>"

)

@jwt_required()

def verification_history(job_id):


    try:



        job = Job.query.get(

            job_id

        )



        if not job:


            return jsonify({

                "success":False,

                "message":

                "Job not found"

            }),404






        history = verification_service.get_verification_history(

            job_id

        )






        return success_response(

            "Verification history fetched.",

            data=history

        )






    except Exception as e:



        return jsonify({

            "success":False,

            "message":str(e)

        }),500











# =====================================================
# FLAG SUSPICIOUS JOB
# POST /api/verification/flag/<job_id>
# =====================================================


@verification_bp.post(

    "/flag/<int:job_id>"

)

@jwt_required()

def flag_job(job_id):


    try:



        user_id = int(

            get_jwt_identity()

        )





        data = request.get_json(

            silent=True

        ) or {}




        reason = data.get(

            "reason",

            "Suspicious job reported"

        )






        result = verification_service.flag_job(

            job_id,

            reason,

            user_id

        )






        return success_response(

            "Job flagged successfully.",

            data=result

        )







    except Exception as e:



        db.session.rollback()



        return jsonify({


            "success":False,


            "message":str(e)



        }),500












# =====================================================
# QUICK VERIFICATION STATUS
# GET /api/verification/status/<job_id>
# =====================================================


@verification_bp.get(

    "/status/<int:job_id>"

)

@jwt_required()

def verification_status(job_id):


    try:



        job = Job.query.get(

            job_id

        )



        if not job:


            return jsonify({

                "success":False,

                "message":

                "Job not found"

            }),404






        return jsonify({



            "success":True,



            "verification":{


                "linkedin_verified":

                job.linkedin_verified,



                "company_verified":

                job.company_verified,



                "trust_score":

                job.trust_score,



                "fake_probability":

                job.fake_probability,



                "status":

                job.status



            }



        }),200







    except Exception as e:



        return jsonify({

            "success":False,

            "message":str(e)

        }),500