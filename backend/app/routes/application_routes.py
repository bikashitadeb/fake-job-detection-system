from flask import Blueprint, request  # type: ignore[import]

from flask_jwt_extended import (  # type: ignore[import]
    jwt_required,
    get_jwt_identity
)

from app.services import application_service

from app.utils.responses import success_response



application_bp = Blueprint(
    "applications",
    __name__,
    url_prefix="/api/applications"
)



# Apply Job

@application_bp.post("/")
@jwt_required()
def apply():

    user_id = int(
        get_jwt_identity()
    )


    data = request.get_json(
        silent=True
    ) or {}


    application = application_service.apply_job(
        data,
        user_id
    )


    return success_response(
        "Application submitted successfully",
        application.to_dict(),
        201
    )



# My Applications

@application_bp.get("/my")
@jwt_required()
def my_applications():

    user_id = int(
        get_jwt_identity()
    )


    applications = application_service.get_my_applications(
        user_id
    )


    return success_response(
        "Applications fetched",
        [
            app.to_dict()
            for app in applications
        ]
    )



# Applications for Recruiter Job

@application_bp.get("/job/<int:job_id>")
@jwt_required()
def applications_for_job(job_id):

    applications = application_service.get_job_applications(
        job_id
    )


    return success_response(
        "Applications fetched",
        [
            app.to_dict()
            for app in applications
        ]
    )



# Update Status

@application_bp.put("/<int:application_id>/status")
@jwt_required()
def update_status(application_id):

    data = request.get_json(
        silent=True
    ) or {}


    application = application_service.update_status(
        application_id,
        data.get("status")
    )


    return success_response(
        "Status updated",
        application.to_dict()
    )



# Withdraw

@application_bp.delete("/<int:application_id>")
@jwt_required()
def withdraw(application_id):

    application_service.withdraw_application(
        application_id
    )


    return success_response(
        "Application withdrawn"
    )