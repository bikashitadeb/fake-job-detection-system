from app.extensions import db

from app.models.verification_model import Verification
from app.models.job_model import Job



# -----------------------------------
# Get Verification History
# -----------------------------------

def get_verification_history(job_id):

    records = Verification.query.filter_by(
        job_id=job_id
    ).all()


    return [
        record.to_dict()
        for record in records
    ]



# -----------------------------------
# Flag Suspicious Job
# -----------------------------------

def flag_job(job_id, reason):

    job = Job.query.get(job_id)


    if not job:

        return {
            "message": "Job not found"
        }



    # Check if fields exist before updating
    if hasattr(job, "is_flagged"):

        job.is_flagged = True


    if hasattr(job, "flag_reason"):

        job.flag_reason = reason



    db.session.commit()



    return {

        "job_id": job_id,

        "flagged": True,

        "reason": reason

    }