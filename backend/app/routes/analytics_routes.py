# app/routes/analytics_routes.py


from flask import Blueprint, jsonify


from flask_jwt_extended import (

    jwt_required,

    get_jwt_identity

)



from sqlalchemy import func


from datetime import datetime, timedelta



from app.extensions import db


from app.models.job_model import Job

from app.models.application_model import Application

from app.models.user_model import User







analytics_bp = Blueprint(

    "analytics",

    __name__,

    url_prefix="/api/analytics"

)









# =====================================================
# RECRUITER ANALYTICS
# =====================================================


@analytics_bp.get("/recruiter")

@jwt_required()

def recruiter_analytics():


    try:



        recruiter_id = int(

            get_jwt_identity()

        )





        user = User.query.get(

            recruiter_id

        )



        if not user or user.role != "recruiter":


            return jsonify({

                "message":

                "Only recruiters allowed"

            }),403







        jobs = Job.query.filter_by(

            recruiter_id=recruiter_id

        ).all()








        applications = Application.query.join(

            Job

        ).filter(

            Job.recruiter_id == recruiter_id

        ).count()







        fake_jobs = [

            job for job in jobs

            if job.is_fake_predicted

        ]





        genuine_jobs = [

            job for job in jobs

            if not job.is_fake_predicted

        ]








        trust_scores = [

            job.trust_score or 0

            for job in jobs

        ]







        average_trust = (

            sum(trust_scores)

            /

            len(trust_scores)

        ) if trust_scores else 0







        return jsonify({



            "success":True,



            "analytics":{



                "total_jobs":

                len(jobs),




                "total_applications":

                applications,





                "fake_vs_genuine":{


                    "fake":

                    len(fake_jobs),



                    "genuine":

                    len(genuine_jobs)

                },







                "trust_distribution":{



                    "high":

                    len([

                        x for x in trust_scores

                        if x >=80

                    ]),




                    "medium":

                    len([

                        x for x in trust_scores

                        if 50 <= x <80

                    ]),




                    "low":

                    len([

                        x for x in trust_scores

                        if x <50

                    ])

                },







                "average_trust_score":

                round(

                    average_trust,

                    2

                )



            }



        }),200







    except Exception as e:



        return jsonify({


            "success":False,


            "message":str(e)


        }),500













# =====================================================
# ADMIN PLATFORM ANALYTICS
# =====================================================


@analytics_bp.get("/admin")

@jwt_required()

def admin_analytics():


    try:



        total_jobs = Job.query.count()



        fake_jobs = Job.query.filter_by(

            is_fake_predicted=True

        ).count()





        verified_jobs = Job.query.filter(

            Job.trust_score >=80

        ).count()





        total_users = User.query.count()



        total_applications = Application.query.count()







        average_trust = db.session.query(

            func.avg(

                Job.trust_score

            )

        ).scalar() or 0







        return jsonify({



            "success":True,



            "analytics":{



                "users":

                total_users,



                "jobs":

                total_jobs,



                "applications":

                total_applications,



                "fake_jobs_detected":

                fake_jobs,



                "verified_jobs":

                verified_jobs,



                "platform_trust_score":

                round(

                    average_trust,

                    2

                )

            }



        }),200








    except Exception as e:



        return jsonify({


            "success":False,


            "message":str(e)


        }),500













# =====================================================
# JOB RISK ANALYTICS
# =====================================================


@analytics_bp.get("/risk")

@jwt_required()

def risk_analytics():


    try:



        high = Job.query.filter(

            Job.risk_score >=75

        ).count()





        medium = Job.query.filter(

            Job.risk_score.between(

                40,

                74

            )

        ).count()





        low = Job.query.filter(

            Job.risk_score <40

        ).count()







        return jsonify({



            "success":True,



            "risk_analysis":{


                "high":

                high,



                "medium":

                medium,



                "low":

                low


            }



        }),200







    except Exception as e:



        return jsonify({

            "message":str(e)

        }),500