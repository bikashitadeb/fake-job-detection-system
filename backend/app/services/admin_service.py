from app.extensions import db

from app.models.user_model import User
from app.models.job_model import Job
from app.models.flag_model import Flag
from app.models.application_model import Application



# -----------------------------
# Dashboard Statistics
# -----------------------------

def get_dashboard_stats():

    users = User.query.count()

    jobs = Job.query.count()

    applications = Application.query.count()

    fake_jobs = Job.query.filter_by(
        ai_prediction="fake"
    ).count()


    flagged_jobs = Job.query.filter_by(
        is_flagged=True
    ).count()



    return {

        "total_users": users,

        "total_jobs": jobs,

        "total_applications": applications,

        "fake_jobs_detected": fake_jobs,

        "flagged_jobs": flagged_jobs
    }



# -----------------------------
# List Users
# -----------------------------

def get_all_users():

    return User.query.all()



# -----------------------------
# Activate / Deactivate User
# -----------------------------

def update_user_status(
        user_id,
        status
):

    user = User.query.get(
        user_id
    )


    if not user:
        raise Exception(
            "User not found"
        )


    user.is_active = status


    db.session.commit()


    return user



# -----------------------------
# Flag Logs
# -----------------------------

def get_flag_logs():

    return Flag.query.order_by(
        Flag.created_at.desc()
    ).all()