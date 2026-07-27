from flask import Blueprint, request  # type: ignore
from flask_jwt_extended import jwt_required  # type: ignore

from app.services import verification_service, job_service
from app.utils.responses import success_response


verification_bp = Blueprint(
    "verification",
    __name__,
    url_prefix="/api/verification"
)


# -----------------------------------
# Verify Job
# -----------------------------------

@verification_bp.post("/verify/<int:job_id>")
@jwt_required()
def verify_job(job_id):

    job = job_service.get_job(job_id)


    result = verification_service.verify_job_details(
        job
    )


    return success_response(
        "Job verification completed.",
        data=result
    )



# -----------------------------------
# Verification History
# -----------------------------------

@verification_bp.get("/history/<int:job_id>")
def verification_history(job_id):

    history = verification_service.get_verification_history(
        job_id
    )


    return success_response(
        "Verification history fetched.",
        data=history
    )



# -----------------------------------
# Flag Suspicious Job
# -----------------------------------

@verification_bp.post("/flag/<int:job_id>")
@jwt_required()
def flag_job(job_id):

    data = request.get_json(
        silent=True
    ) or {}


    result = verification_service.flag_job(
        job_id,
        data.get("reason")
    )


    return success_response(
        "Job flagged successfully.",
        data=result
    )