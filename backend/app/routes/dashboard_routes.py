from flask import Blueprint

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.models.job_model import Job



dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)




# =====================================
# RECRUITER DASHBOARD
# =====================================

@dashboard_bp.get("/recruiter")
@jwt_required()
def recruiter_dashboard():

    recruiter_id = int(
        get_jwt_identity()
    )


    jobs = Job.query.filter_by(
        recruiter_id=recruiter_id
    ).all()



    total_jobs = len(jobs)



    fake_jobs = 0

    verified_jobs = 0

    pending_jobs = 0



    for job in jobs:


        if job.is_fake_predicted:

            fake_jobs += 1



        if job.status == "verified":

            verified_jobs += 1


        else:

            pending_jobs += 1





    recent_jobs = []



    for job in jobs[-5:]:


        trust_score = 100 - (
            job.fake_probability or 0
        )


        recent_jobs.append({

            "id": job.id,

            "title": job.title,

            "company": job.company,

            "location": job.location,

            "trust_score": round(
                trust_score,
                2
            ),

            "status": job.status

        })





    return {


        "stats": {


            "total_jobs":
            total_jobs,


            "fake_jobs":
            fake_jobs,


            "verified_jobs":
            verified_jobs,


            "pending_jobs":
            pending_jobs

        },


        "recent_jobs":
        recent_jobs

    }