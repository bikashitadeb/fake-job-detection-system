from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.models.user_model import User
from app.models.job_model import Job
from app.models.application_model import Application



dashboard_bp = Blueprint(

    "dashboard",

    __name__,

    url_prefix="/api/dashboard"

)





# =====================================
# COMMON PROFILE
# =====================================

@dashboard_bp.route(
    "/profile",
    methods=["GET"]
)

@jwt_required()

def profile():


    user_id = int(
        get_jwt_identity()
    )


    user = User.query.get(user_id)



    if not user:

        return jsonify({

            "message":"User not found"

        }),404




    return jsonify({

        "user": user.to_dict()

    }),200







# =====================================
# EMPLOYEE DASHBOARD
# =====================================


@dashboard_bp.route(
    "/employee",
    methods=["GET"]
)

@jwt_required()

def employee_dashboard():


    user_id = int(
        get_jwt_identity()
    )


    user = User.query.get(user_id)



    if not user:

        return jsonify({

            "message":"User not found"

        }),404




    if user.role != "employee":

        return jsonify({

            "message":"Access denied"

        }),403






    # Show all approved jobs
    jobs = Job.query.filter(

        Job.status.in_(
            [
                "verified",
                "pending"
            ]
        )

    ).all()





    applications = Application.query.filter_by(

        jobseeker_id=user.id

    ).all()





    suspicious_jobs = Job.query.filter_by(

        is_fake_predicted=True

    ).all()






    return jsonify({


        "user":

        user.to_dict(),




        "jobs":

        [

            job.to_dict()

            for job in jobs

        ],




        "applications":

        [

            app.to_dict()

            for app in applications

        ],





        "suspicious_jobs":

        [

            job.to_dict()

            for job in suspicious_jobs

        ],




        "analytics":

        {

            "total_jobs":

            len(jobs),



            "verified_jobs":

            len(

                [
                    j for j in jobs

                    if j.linkedin_verified
                ]

            ),



            "suspicious_jobs":

            len(suspicious_jobs)

        }


    }),200











# =====================================
# RECRUITER DASHBOARD
# =====================================


@dashboard_bp.route(
    "/recruiter",
    methods=["GET"]
)

@jwt_required()

def recruiter_dashboard():


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

            "message":"Access denied"

        }),403







    jobs = Job.query.filter_by(

        recruiter_id=user.id

    ).all()







    applications = Application.query.join(

        Job

    ).filter(

        Job.recruiter_id == user.id

    ).all()






    return jsonify({


        "user":

        user.to_dict(),





        "jobs":

        [

            job.to_dict()

            for job in jobs

        ],






        "applications":

        [

            app.to_dict()

            for app in applications

        ],




        "analytics":

        {


            "total_jobs":

            len(jobs),



            "fake_jobs":

            len(

                [

                j for j in jobs

                if j.is_fake_predicted

                ]

            ),



            "average_trust_score":

            (

                sum(

                    j.trust_score or 0

                    for j in jobs

                )

                /

                len(jobs)

            )

            if jobs else 0


        }



    }),200