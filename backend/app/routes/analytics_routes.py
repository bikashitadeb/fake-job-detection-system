from flask import Blueprint

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from sqlalchemy import func

from app.extensions import db

from app.models.job_model import Job



analytics_bp = Blueprint(
    "analytics",
    __name__,
    url_prefix="/api/analytics"
)




# =====================================
# RECRUITER ANALYTICS
# =====================================

@analytics_bp.get("/recruiter")
@jwt_required()
def recruiter_analytics():


    recruiter_id = int(
        get_jwt_identity()
    )



    jobs = Job.query.filter_by(
        recruiter_id=recruiter_id
    ).all()



    fake = 0

    genuine = 0


    for job in jobs:


        if job.is_fake_predicted:

            fake += 1

        else:

            genuine += 1





    trust_scores = []



    for job in jobs:

        score = 100 - (
            job.fake_probability or 0
        )

        trust_scores.append(
            round(score,2)
        )





    return {


        "fake_vs_genuine":{


            "fake":fake,

            "genuine":genuine


        },


        "trust_distribution":{


            "high":
            len(
                [
                    x for x in trust_scores
                    if x >= 80
                ]
            ),


            "medium":
            len(
                [
                    x for x in trust_scores
                    if 50 <= x < 80
                ]
            ),


            "low":
            len(
                [
                    x for x in trust_scores
                    if x < 50
                ]
            )

        },


        "total_jobs":
        len(jobs)

    }