from flask import Blueprint, request

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    get_jwt,
)

from app.services import auth_service

from app.utils.responses import success_response

from app.models.user_model import User

from app.utils.exceptions import NotFoundError



auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)



# =====================================
# REGISTER JOBSEEKER
# =====================================

@auth_bp.post("/register")
def register():

    data = request.get_json(
        silent=True
    ) or {}


    result = auth_service.register_jobseeker(
        data
    )


    return success_response(
        "User registered successfully.",
        data=result,
        status_code=201
    )



# =====================================
# REGISTER RECRUITER
# =====================================

@auth_bp.post("/register/recruiter")
def register_recruiter():

    data = request.get_json(
        silent=True
    ) or {}


    result = auth_service.register_recruiter(
        data
    )


    return success_response(
        "Recruiter registered successfully.",
        data=result,
        status_code=201
    )



# =====================================
# LOGIN
# =====================================

@auth_bp.post("/login")
def login():

    data = request.get_json(
        silent=True
    ) or {}


    email = data.get(
        "email"
    )

    password = data.get(
        "password"
    )


    result = auth_service.login_user(
        email,
        password
    )


    return success_response(
        "Login successful.",
        data=result,
        status_code=200
    )



# =====================================
# REFRESH TOKEN
# =====================================

@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():

    identity = get_jwt_identity()

    claims = get_jwt()



    access_token = create_access_token(

        identity=identity,

        additional_claims={

            "role": claims.get("role"),

            "email": claims.get("email")

        }

    )


    return success_response(

        "Token refreshed.",

        data={

            "access_token":
            access_token

        }

    )



# =====================================
# CURRENT USER
# =====================================

@auth_bp.get("/me")
@jwt_required()
def me():

    user_id = int(
        get_jwt_identity()
    )


    user = User.query.get(
        user_id
    )


    if not user:

        raise NotFoundError(
            "User not found"
        )


    return success_response(

        "Current user fetched.",

        data=user.to_dict()

    )



# =====================================
# CHANGE PASSWORD
# =====================================

@auth_bp.put("/change-password")
@jwt_required()
def change_password():

    user_id = int(
        get_jwt_identity()
    )


    data = request.get_json(
        silent=True
    ) or {}



    auth_service.change_password(

        user_id,

        data.get(
            "old_password"
        ),

        data.get(
            "new_password"
        )

    )


    return success_response(

        "Password changed successfully."

    )



# =====================================
# LOGOUT
# =====================================

@auth_bp.post("/logout")
@jwt_required()
def logout():

    user_id = int(
        get_jwt_identity()
    )


    auth_service.logout_current_token(
        user_id
    )


    return success_response(

        "Logged out successfully."

    )



# =====================================
# FORGOT PASSWORD
# =====================================

@auth_bp.post("/forgot-password")
def forgot_password():

    data = request.get_json(
        silent=True
    ) or {}



    result = auth_service.request_password_reset(

        data.get(
            "email"
        )

    )


    return success_response(

        result["message"],

        data=result

    )



# =====================================
# RESET PASSWORD
# =====================================

@auth_bp.post("/reset-password")
def reset_password():

    data = request.get_json(
        silent=True
    ) or {}



    auth_service.reset_password(

        data.get(
            "token"
        ),

        data.get(
            "new_password"
        )

    )


    return success_response(

        "Password reset successful."

    )