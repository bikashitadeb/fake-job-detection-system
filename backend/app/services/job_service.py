from app.extensions import db

from app.models.job_model import Job





# =====================================
# CREATE JOB
# =====================================

def create_job(data, recruiter_id):


    job = Job(


        title=data.get(

            "title"

        ),



        description=data.get(

            "description"

        ),



        company=data.get(

            "company",

            "Unknown Company"

        ),



        location=data.get(

            "location"

        ),



        salary=data.get(

            "salary"

        ),



        trust_score=data.get(

            "trust_score",

            0

        ),



        status="pending",



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





    allowed_fields = [


        "title",


        "description",


        "company",


        "location",


        "salary",


        "status",


        "trust_score"



    ]





    for key,value in data.items():


        if key in allowed_fields:


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