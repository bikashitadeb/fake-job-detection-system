from flask import Blueprint, request
from app.services.prediction_service import analyze_and_save_job
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.services import job_service

from app.utils.responses import success_response

from app.utils.exceptions import (
    ValidationError,
    NotFoundError
)


job_bp = Blueprint(
    "jobs",
    __name__,
    url_prefix="/api/jobs"
)



# =====================================
# CREATE JOB
# =====================================

@job_bp.post("")
@jwt_required()
def create_job():

    recruiter_id = int(
        get_jwt_identity()
    )


    data = request.get_json(
        silent=True
    )


    print("===================")
    print("JOB DATA:")
    print(data)

    print("RECRUITER:")
    print(recruiter_id)
    print("===================")



    if not data:

        raise ValidationError(
            "Request body is empty"
        )


    required_fields = [
        "title",
        "description",
        "company",
        "location"
    ]


    for field in required_fields:

        if not data.get(field):

            raise ValidationError(
                f"{field} is required"
            )



    job = job_service.create_job(

        data,

        recruiter_id

    )
    prediction = analyze_and_save_job(job)



    return success_response(
    "Job created and analysed successfully.",
    data={
        "job": job.to_dict(),
        "prediction": prediction
    },
    status_code=201
)





# =====================================
# GET ALL JOBS
# =====================================

@job_bp.get("")
def get_jobs():

    jobs = job_service.get_all_jobs()


    return success_response(

        "Jobs fetched successfully.",

        data=[
            job.to_dict()
            for job in jobs
        ]

    )





# =====================================
# GET SINGLE JOB
# =====================================

@job_bp.get("/<int:job_id>")
def get_job(job_id):

    job = job_service.get_job(
        job_id
    )


    if not job:

        raise NotFoundError(
            "Job not found"
        )


    return success_response(

        "Job fetched successfully.",

        data=job.to_dict()

    )





# =====================================
# UPDATE JOB
# =====================================

@job_bp.put("/<int:job_id>")
@jwt_required()
def update_job(job_id):

    data = request.get_json(
        silent=True
    ) or {}


    job = job_service.update_job(

        job_id,

        data

    )


    return success_response(

        "Job updated successfully.",

        data=job.to_dict()

    )





# =====================================
# DELETE JOB
# =====================================

@job_bp.delete("/<int:job_id>")
@jwt_required()
def delete_job(job_id):

    job_service.delete_job(
        job_id
    )


    return success_response(

        "Job deleted successfully."

    )