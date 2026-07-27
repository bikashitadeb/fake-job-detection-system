from app.extensions import db

from app.models.job_model import Job



# =====================================
# CREATE JOB
# =====================================

def create_job(data, recruiter_id):


    job = Job(

        title=data.get("title"),

        description=data.get("description"),

        company_name=data.get("company_name"),

        location=data.get("location"),

        job_type=data.get("job_type"),

        experience=data.get("experience"),

        salary=data.get("salary"),

        skills=data.get("skills"),

        website=data.get("website"),

        official_email=data.get("official_email"),

        linkedin_url=data.get("linkedin_url"),

        recruiter_id=recruiter_id

    )


    db.session.add(job)

    db.session.commit()


    return job





# =====================================
# GET ALL JOBS
# =====================================

def get_all_jobs():

    return Job.query.all()





# =====================================
# GET SINGLE JOB
# =====================================

def get_job(job_id):

    return Job.query.get(job_id)





# =====================================
# UPDATE JOB
# =====================================

def update_job(job_id,data):


    job = Job.query.get(job_id)


    if not job:

        raise Exception(
            "Job not found"
        )


    for key,value in data.items():

        if hasattr(job,key):

            setattr(
                job,
                key,
                value
            )


    db.session.commit()


    return job





# =====================================
# DELETE JOB
# =====================================

def delete_job(job_id):


    job = Job.query.get(job_id)


    if not job:

        raise Exception(
            "Job not found"
        )


    db.session.delete(job)

    db.session.commit()