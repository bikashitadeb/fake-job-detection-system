from app.extensions import db

from app.models.user_model import User
from app.models.job_model import Job
from app.models.flag_model import Flag
from app.models.application_model import Application
from app.models.company_model import Company






# =====================================================
# ADMIN DASHBOARD ANALYTICS
# =====================================================


def get_dashboard_stats():


    try:


        total_users = User.query.count()


        total_jobs = Job.query.count()


        total_applications = Application.query.count()



        fake_jobs = Job.query.filter_by(

            is_fake_predicted=True

        ).count()





        verified_jobs = Job.query.filter_by(

            verification_status="verified"

        ).count()





        pending_jobs = Job.query.filter_by(

            verification_status="pending"

        ).count()





        suspicious_jobs = Job.query.filter(

            Job.risk_score >= 70

        ).count()





        recruiters = User.query.filter_by(

            role="recruiter"

        ).count()





        employees = User.query.filter_by(

            role="employee"

        ).count()





        companies = Company.query.count()





        return {


            "users":{


                "total":

                total_users,


                "employees":

                employees,


                "recruiters":

                recruiters


            },



            "jobs":{


                "total":

                total_jobs,


                "fake_detected":

                fake_jobs,


                "verified":

                verified_jobs,


                "pending":

                pending_jobs,


                "high_risk":

                suspicious_jobs


            },



            "applications":{


                "total":

                total_applications


            },



            "companies":{


                "total":

                companies


            }


        }



    except Exception as e:


        print(

            "ADMIN STATS ERROR:",

            e

        )


        raise e











# =====================================================
# GET ALL USERS
# =====================================================


def get_all_users():


    try:


        return User.query.order_by(

            User.created_at.desc()

        ).all()



    except Exception as e:


        print(

            "USER FETCH ERROR:",

            e

        )


        raise e











# =====================================================
# UPDATE USER STATUS
# =====================================================


def update_user_status(

        user_id,

        status

):


    try:


        user = User.query.get(

            user_id

        )



        if not user:


            raise Exception(

                "User not found"

            )





        user.is_active = bool(

            status

        )



        db.session.commit()



        return user





    except Exception as e:



        db.session.rollback()



        raise e











# =====================================================
# FLAG / FRAUD LOGS
# =====================================================


def get_flag_logs():


    try:


        return Flag.query.order_by(

            Flag.created_at.desc()

        ).all()



    except Exception as e:


        print(

            "FLAG FETCH ERROR:",

            e

        )


        raise e











# =====================================================
# VERIFY COMPANY
# ADMIN FEATURE
# =====================================================


def verify_company(company_id):


    try:


        company = Company.query.get(

            company_id

        )



        if not company:


            raise Exception(

                "Company not found"

            )





        company.verification_status = "verified"


        company.verified_by_admin = True




        db.session.commit()



        return company




    except Exception as e:


        db.session.rollback()


        raise e











# =====================================================
# REVIEW FRAUD FLAG
# =====================================================


def review_flag(

        flag_id,

        data

):


    try:


        flag = Flag.query.get(

            flag_id

        )



        if not flag:


            raise Exception(

                "Flag not found"

            )





        flag.status = data.get(

            "status",

            flag.status

        )



        flag.reason = data.get(

            "reason",

            flag.reason

        )





        db.session.commit()



        return flag





    except Exception as e:



        db.session.rollback()



        raise e