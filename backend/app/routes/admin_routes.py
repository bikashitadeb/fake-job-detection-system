from flask import Blueprint, request  # type: ignore[import]

from flask_jwt_extended import jwt_required  # type: ignore[import]

from app.services import admin_service

from app.utils.responses import success_response



admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/admin"
)



# Dashboard Stats

@admin_bp.get("/stats")
@jwt_required()
def dashboard_stats():

    result = admin_service.get_dashboard_stats()


    return success_response(
        "Dashboard statistics fetched",
        result
    )



# List Users

@admin_bp.get("/users")
@jwt_required()
def list_users():

    users = admin_service.get_all_users()


    return success_response(
        "Users fetched",
        [
            user.to_dict()
            for user in users
        ]
    )



# Update User Status

@admin_bp.put("/users/<int:user_id>/status")
@jwt_required()
def set_user_active_status(user_id):

    data = request.get_json(
        silent=True
    ) or {}


    user = admin_service.update_user_status(
        user_id,
        data.get("is_active")
    )


    return success_response(
        "User status updated",
        user.to_dict()
    )



# Flag Logs

@admin_bp.get("/flags")
@jwt_required()
def list_flag_logs():

    flags = admin_service.get_flag_logs()


    return success_response(
        "Flag logs fetched",
        [
            flag.to_dict()
            for flag in flags
        ]
    )