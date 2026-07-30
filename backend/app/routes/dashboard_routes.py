from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from sqlalchemy import func

from app.extensions import db

from app.models.user_model import User
from app.models.job_model import Job
from app.models.application_model import Application





# =====================================================
# BLUEPRINT
# =====================================================


dashboard_bp = Blueprint(

    "dashboard",

    __name__,

    url_prefix="/api/dashboard"

)







# =====================================================
# COMMON RESPONSE
# =====================================================


def response(

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
# PROFILE
# GET /api/dashboard/profile
# =====================================================


@dashboard_bp.route(

    "/profile",

    methods=["GET"]

)

@jwt_required()

def profile():


    try:


        user_id = int(

            get_jwt_identity()

        )


        user = User.query.get(

            user_id

        )



        if not user:


            return response(

                False,

                "User not found",

                status=404

            )





        return response(

            True,

            "Profile loaded",

            {

                "user":

                user.to_dict()

            }

        )




    except Exception as e:


        return response(

            False,

            str(e),

            status=500

        )









# =====================================================
# EMPLOYEE DASHBOARD
# GET /api/dashboard/employee
# =====================================================


@dashboard_bp.route(

    "/employee",

    methods=["GET"]

)

@jwt_required()

def employee_dashboard():


    try:


        user_id = int(

            get_jwt_identity()

        )




        user = User.query.get(

            user_id

        )






        if not user:


            return response(

                False,

                "User not found",

                status=404

            )







        if user.role != "employee":


            return response(

                False,

                "Employee access required",

                status=403

            )









        # Available jobs


        jobs = Job.query.filter(

            Job.is_active == True

        ).order_by(

            Job.created_at.desc()

        ).all()







        applications = Application.query.filter_by(

            jobseeker_id=user.id

        ).order_by(

            Application.applied_at.desc()

        ).all()







        suspicious_jobs = Job.query.filter(

            Job.is_fake_predicted == True

        ).all()







        verified_jobs = [

            job

            for job in jobs

            if job.linkedin_verified

        ]









        return response(


            True,


            "Employee dashboard loaded",



            {



                "user":

                user.to_dict(),






                "jobs":[


                    job.to_dict()

                    for job in jobs


                ],






                "applications":[


                    app.to_dict()

                    for app in applications


                ],







                "suspicious_jobs":[


                    job.to_dict()

                    for job in suspicious_jobs


                ],







                "analytics":{


                    "total_jobs":

                    len(jobs),




                    "verified_jobs":

                    len(verified_jobs),




                    "suspicious_jobs":

                    len(suspicious_jobs),




                    "applications_sent":

                    len(applications),





                    "application_status":{


                        "pending":

                        len(

                            [

                            a for a in applications

                            if a.status=="pending"

                            ]

                        ),



                        "selected":

                        len(

                            [

                            a for a in applications

                            if a.status=="selected"

                            ]

                        ),



                        "rejected":

                        len(

                            [

                            a for a in applications

                            if a.status=="rejected"

                            ]

                        )


                    }


                }



            }

        )







    except Exception as e:


        return response(

            False,

            str(e),

            status=500

        )









# =====================================================
# RECRUITER DASHBOARD
# GET /api/dashboard/recruiter
# =====================================================


@dashboard_bp.route(

    "/recruiter",

    methods=["GET"]

)

@jwt_required()

def recruiter_dashboard():


    try:


        user_id = int(

            get_jwt_identity()

        )





        user = User.query.get(

            user_id

        )






        if not user:


            return response(

                False,

                "User not found",

                status=404

            )






        if user.role != "recruiter":


            return response(

                False,

                "Recruiter access required",

                status=403

            )









        jobs = Job.query.filter_by(

            recruiter_id=user.id

        ).order_by(

            Job.created_at.desc()

        ).all()








        applications = Application.query.join(

            Job

        ).filter(

            Job.recruiter_id == user.id

        ).order_by(

            Application.applied_at.desc()

        ).all()







        total_trust = sum(

            job.trust_score or 0

            for job in jobs

        )






        average_trust = (

            total_trust / len(jobs)

        ) if jobs else 0







        shortlisted = len(

            [

                app

                for app in applications

                if app.status=="shortlisted"

            ]

        )







        selected = len(

            [

                app

                for app in applications

                if app.status=="selected"

            ]

        )










        return response(



            True,


            "Recruiter dashboard loaded",



            {



                "user":

                user.to_dict(),





                "jobs":[


                    job.to_dict()

                    for job in jobs


                ],





                "applications":[


                    app.to_dict()

                    for app in applications


                ],







                "analytics":{



                    "total_jobs":

                    len(jobs),





                    "active_jobs":

                    len(

                        [

                        j for j in jobs

                        if j.is_active

                        ]

                    ),






                    "fake_jobs_detected":

                    len(

                        [

                        j for j in jobs

                        if j.is_fake_predicted

                        ]

                    ),







                    "average_trust_score":

                    round(

                        average_trust,

                        2

                    ),







                    "total_applicants":

                    len(applications),







                    "shortlisted_candidates":

                    shortlisted,






                    "selected_candidates":

                    selected




                }



            }


        )






    except Exception as e:


        return response(

            False,

            str(e),

            status=500

        )