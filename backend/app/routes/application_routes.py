from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.extensions import db

from app.models.application_model import Application
from app.models.job_model import Job
from app.models.user_model import User



application_bp = Blueprint(
    "applications",
    __name__,
    url_prefix="/api/applications"
)





# =====================================
# APPLY FOR JOB
# EMPLOYEE
# =====================================


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


        user = User.query.get(user_id)



        if not user or user.role != "employee":

            return jsonify({

                "message":
                "Only employees can apply"

            }),403





        job = Job.query.get(job_id)



        if not job:

            return jsonify({

                "message":
                "Job not found"

            }),404





        existing = Application.query.filter_by(

            jobseeker_id=user.id,

            job_id=job.id

        ).first()





        if existing:

            return jsonify({

                "message":
                "Already applied"

            }),400






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


            status="pending"

        )





        db.session.add(application)

        db.session.commit()





        return jsonify({


            "message":
            "Application submitted",


            "application":
            application.to_dict()


        }),201






    except Exception as e:


        db.session.rollback()


        print(

            "APPLY ERROR:",

            e

        )


        return jsonify({

            "message":str(e)

        }),500












# =====================================
# GET EMPLOYEE APPLICATIONS
# GET /api/applications
# =====================================


@application_bp.route(
    "",
    methods=["GET"]
)
@jwt_required()
def get_my_applications():


    try:


        user_id = int(

            get_jwt_identity()

        )



        applications = Application.query.filter_by(

            jobseeker_id=user_id

        ).all()





        return jsonify({

            "applications":[

                application.to_dict()

                for application in applications

            ]

        }),200





    except Exception as e:


        print(

            "APPLICATION FETCH ERROR:",

            e

        )


        return jsonify({

            "message":str(e)

        }),500










# =====================================
# OLD ROUTE
# =====================================


@application_bp.route(
    "/my",
    methods=["GET"]
)
@jwt_required()
def my_applications():

    return get_my_applications()












# =====================================
# RECRUITER VIEW APPLICANTS
# =====================================


@application_bp.route(

    "/job/<int:job_id>",

    methods=["GET"]

)
@jwt_required()
def job_applicants(job_id):


    user_id = int(

        get_jwt_identity()

    )



    user = User.query.get(user_id)



    if not user or user.role != "recruiter":


        return jsonify({

            "message":
            "Only recruiters allowed"

        }),403





    applications = Application.query.filter_by(

        job_id=job_id

    ).all()





    return jsonify({

        "applications":[

            application.to_dict()

            for application in applications

        ]

    }),200











# =====================================
# UPDATE APPLICATION STATUS
# =====================================


@application_bp.route(

    "/<int:id>",

    methods=["PUT"]

)
@jwt_required()
def update_application(id):


    application = Application.query.get(id)



    if not application:


        return jsonify({

            "message":
            "Application not found"

        }),404





    data = request.get_json()



    application.status = data.get(

        "status",

        application.status

    )



    db.session.commit()



    return jsonify({

        "message":
        "Application updated",


        "application":
        application.to_dict()

    }),200