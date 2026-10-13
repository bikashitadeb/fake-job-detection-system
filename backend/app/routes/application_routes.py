from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.extensions import db

from app.models.application_model import Application
from app.models.job_model import Job
from app.models.user_model import User





# =====================================================
# BLUEPRINT
# =====================================================


application_bp = Blueprint(

    "applications",

    __name__,

    url_prefix="/api/applications"

)









# =====================================================
# RESPONSE HANDLER
# =====================================================


def api_response(

    success=True,

    message="",

    data=None,

    status=200

):

    return jsonify({

        "success": success,

        "message": message,

        "data": data

    }), status











# =====================================================
# APPLY FOR JOB
# EMPLOYEE ONLY
# POST /api/applications/<job_id>/apply
# =====================================================


@application_bp.route(

    "/<int:job_id>/apply",

    methods=["POST"]

)

@jwt_required()

def apply_job(job_id):


    try:



        user_id = int(

            get_jwt_identity()

        )




        user = User.query.get(

            user_id

        )







        if not user:


            return api_response(

                False,

                "User not found",

                status=404

            )








        if user.role != "employee":


            return api_response(

                False,

                "Only employees can apply",

                status=403

            )









        job = Job.query.get(

            job_id

        )






        if not job:


            return api_response(

                False,

                "Job not found",

                status=404

            )









        if not job.is_active:


            return api_response(

                False,

                "Job is closed",

                status=400

            )









        existing = Application.query.filter_by(


            job_id=job.id,


            jobseeker_id=user.id


        ).first()







        if existing:


            return api_response(

                False,

                "Already applied for this job",

                status=409

            )









        data = request.get_json() or {}








        application = Application(



            job_id=job.id,



            jobseeker_id=user.id,



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







        db.session.add(application)



        # Analytics

        job.application_count += 1



        db.session.commit()








        return api_response(



            True,


            "Application submitted successfully",



            {


                "application":

                application.to_dict()


            },


            201


        )









    except Exception as e:


        db.session.rollback()



        print(

            "APPLY ERROR:",

            e

        )



        return api_response(

            False,

            str(e),

            status=500

        )














# =====================================================
# EMPLOYEE APPLICATION HISTORY
# GET /api/applications/my
# =====================================================



@application_bp.route(

    "/my",

    methods=["GET"]

)

@jwt_required()

def my_applications():


    try:



        user_id = int(

            get_jwt_identity()

        )




        applications = Application.query.filter_by(


            jobseeker_id=user_id


        ).order_by(


            Application.applied_at.desc()


        ).all()







        return api_response(



            True,


            "Applications fetched",



            {


                "applications":[


                    application.to_dict()


                    for application in applications


                ]


            }


        )








    except Exception as e:



        return api_response(

            False,

            str(e),

            status=500

        )














# =====================================================
# RECRUITER VIEW APPLICANTS
# GET /api/applications/job/<job_id>
# =====================================================


@application_bp.route(

    "/job/<int:job_id>",

    methods=["GET"]

)

@jwt_required()

def job_applicants(job_id):


    try:



        user_id = int(

            get_jwt_identity()

        )





        recruiter = User.query.get(

            user_id

        )







        if not recruiter or recruiter.role != "recruiter":


            return api_response(

                False,

                "Recruiter access required",

                status=403

            )









        job = Job.query.get(

            job_id

        )







        if not job:


            return api_response(

                False,

                "Job not found",

                status=404

            )








        if job.recruiter_id != recruiter.id:



            return api_response(

                False,

                "Unauthorized access",

                status=403

            )










        applications = Application.query.filter_by(


            job_id=job.id


        ).order_by(


            Application.applied_at.desc()


        ).all()








        return api_response(



            True,


            "Applicants fetched",



            {


                "applications":[


                    application.to_dict()


                    for application in applications


                ]


            }


        )










    except Exception as e:



        return api_response(

            False,

            str(e),

            status=500

        )













# =====================================================
# UPDATE APPLICATION STATUS
# RECRUITER ONLY
# =====================================================


@application_bp.route(

    "/<int:id>",

    methods=["PUT"]

)

@jwt_required()

def update_application(id):


    try:



        user_id = int(

            get_jwt_identity()

        )




        recruiter = User.query.get(

            user_id

        )






        if not recruiter or recruiter.role != "recruiter":


            return api_response(

                False,

                "Recruiter access required",

                status=403

            )








        application = Application.query.get(

            id

        )







        if not application:


            return api_response(

                False,

                "Application not found",

                status=404

            )









        if application.job.recruiter_id != recruiter.id:


            return api_response(

                False,

                "Unauthorized action",

                status=403

            )









        data = request.get_json() or {}







        allowed_status = [


            "pending",

            "shortlisted",

            "interview",

            "selected",

            "rejected",

            "offered"


        ]








        new_status = data.get(

            "status"

        )








        if new_status not in allowed_status:


            return api_response(

                False,

                "Invalid application status",

                status=400

            )









        application.status = new_status






        application.recruiter_notes = data.get(

            "recruiter_notes",

            application.recruiter_notes

        )





        application.rejection_reason = data.get(

            "rejection_reason",

            application.rejection_reason

        )






        db.session.commit()







        return api_response(



            True,


            "Application status updated",



            {


                "application":

                application.to_dict()


            }


        )









    except Exception as e:



        db.session.rollback()



        return api_response(

            False,

            str(e),

            status=500

        )