from app.extensions import db

from app.models.application_model import Application
from app.models.job_model import Job



def apply_job(data, jobseeker_id):


    job_id = data.get("job_id")


    job = Job.query.get(job_id)


    if not job:

        raise Exception(
            "Job not found"
        )



    existing = Application.query.filter_by(
        job_id=job_id,
        jobseeker_id=jobseeker_id
    ).first()


    if existing:

        raise Exception(
            "Already applied for this job"
        )



    application = Application(

        job_id=job_id,

        jobseeker_id=jobseeker_id,

        cover_letter=data.get(
            "cover_letter"
        ),

        resume_url=data.get(
            "resume_url"
        )

    )


    db.session.add(application)

    db.session.commit()


    return application



def get_my_applications(user_id):


    return Application.query.filter_by(
        jobseeker_id=user_id
    ).all()



def get_job_applications(job_id):


    return Application.query.filter_by(
        job_id=job_id
    ).all()



def update_status(application_id,status):


    application = Application.query.get(
        application_id
    )


    if not application:

        raise Exception(
            "Application not found"
        )


    application.status = status


    db.session.commit()


    return application



def withdraw_application(application_id):


    application = Application.query.get(
        application_id
    )


    if not application:

        raise Exception(
            "Application not found"
        )


    db.session.delete(
        application
    )


    db.session.commit()