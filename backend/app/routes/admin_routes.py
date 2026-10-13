from flask import Blueprint, request

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.services import admin_service

from app.models.user_model import User

from app.utils.responses import success_response, error_response





# =====================================================
# BLUEPRINT
# =====================================================


admin_bp = Blueprint(

    "admin",

    __name__,

    url_prefix="/api/admin"

)









# =====================================================
# ADMIN SECURITY CHECK
# =====================================================


def admin_required():


    user_id = get_jwt_identity()



    try:

        user_id = int(user_id)


    except:


        return None





    user = User.query.get(

        user_id

    )



    if not user:


        return None




    if user.role != "admin":


        return None




    return user










# =====================================================
# ADMIN DASHBOARD STATISTICS
# GET /api/admin/stats
# =====================================================


@admin_bp.get("/stats")

@jwt_required()

def dashboard_stats():


    try:



        admin = admin_required()



        if not admin:


            return error_response(

                "Admin access required",

                403

            )





        result = admin_service.get_dashboard_stats()





        return success_response(

            "Dashboard statistics fetched",

            result

        )







    except Exception as e:



        return error_response(

            str(e),

            500

        )









# =====================================================
# LIST ALL USERS
# GET /api/admin/users
# =====================================================


@admin_bp.get("/users")

@jwt_required()

def list_users():


    try:



        admin = admin_required()



        if not admin:


            return error_response(

                "Admin access required",

                403

            )






        users = admin_service.get_all_users()






        return success_response(


            "Users fetched",



            [

                user.to_dict()

                for user in users

            ]

        )







    except Exception as e:


        return error_response(

            str(e),

            500

        )









# =====================================================
# UPDATE USER STATUS
# PUT /api/admin/users/<id>/status
# =====================================================


@admin_bp.put(

    "/users/<int:user_id>/status"

)

@jwt_required()

def set_user_active_status(user_id):


    try:



        admin = admin_required()



        if not admin:


            return error_response(

                "Admin access required",

                403

            )






        data = request.get_json(

            silent=True

        ) or {}





        if "is_active" not in data:


            return error_response(

                "is_active field required",

                400

            )







        user = admin_service.update_user_status(

            user_id,

            data.get(

                "is_active"

            )

        )






        return success_response(



            "User status updated",



            user.to_dict()


        )






    except Exception as e:


        return error_response(

            str(e),

            500

        )









# =====================================================
# FLAG / FRAUD LOGS
# GET /api/admin/flags
# =====================================================


@admin_bp.get("/flags")

@jwt_required()

def list_flag_logs():


    try:



        admin = admin_required()



        if not admin:


            return error_response(

                "Admin access required",

                403

            )






        flags = admin_service.get_flag_logs()





        return success_response(



            "Flag logs fetched",



            [


                flag.to_dict()

                for flag in flags


            ]


        )







    except Exception as e:


        return error_response(

            str(e),

            500

        )









# =====================================================
# VERIFY / REJECT COMPANY
# FUTURE READY
# =====================================================


@admin_bp.put(

    "/company/<int:company_id>/verify"

)

@jwt_required()

def verify_company(company_id):


    try:



        admin = admin_required()



        if not admin:


            return error_response(

                "Admin access required",

                403

            )







        result = admin_service.verify_company(

            company_id

        )






        return success_response(



            "Company verification updated",



            result.to_dict()

        )







    except Exception as e:


        return error_response(

            str(e),

            500

        )









# =====================================================
# REVIEW FLAG
# FUTURE AI FRAUD PANEL
# =====================================================


@admin_bp.put(

    "/flags/<int:flag_id>/review"

)

@jwt_required()

def review_flag(flag_id):


    try:



        admin = admin_required()



        if not admin:


            return error_response(

                "Admin access required",

                403

            )





        data = request.get_json(

            silent=True

        ) or {}






        result = admin_service.review_flag(

            flag_id,

            data

        )







        return success_response(



            "Flag reviewed successfully",



            result.to_dict()

        )







    except Exception as e:



        return error_response(

            str(e),

            500

        )