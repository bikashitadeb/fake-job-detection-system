from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    get_jwt
)

from app.extensions import db

from app.services.auth_service import (
    register_jobseeker,
    register_recruiter,
    login_user
)

from app.models.user_model import User

from app.utils.exceptions import UnauthorizedError



# =====================================================
# BLUEPRINT
# =====================================================

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)




# =====================================================
# RESPONSE HELPER
# =====================================================

def response(
    success=True,
    message="",
    data=None,
    status=200
):

    return jsonify({

        "success": success,

        "message": message,

        **(data if data else {})

    }), status





# =====================================================
# USER SERIALIZER
# =====================================================

def serialize_user(user):

    if not user:
        return None


    return {

        "id": user.id,

        "name": user.name,

        "email": user.email,

        "role": user.role,

        "company_id": user.company_id,

        "is_verified": user.is_verified,

        "is_active": user.is_active,

        "created_at":

            user.created_at.isoformat()

            if user.created_at

            else None

    }





# =====================================================
# REGISTER
# =====================================================

@auth_bp.route(
    "/register",
    methods=["POST"]
)

def register():

    try:

        data = request.get_json()


        if not data:

            return response(

                False,

                "Invalid request body",

                status=400

            )


        role = data.get("role")



        if role == "employee":

            user = register_jobseeker(data)



        elif role == "recruiter":

            user = register_recruiter(data)



        else:

            return response(

                False,

                "Invalid role",

                status=400

            )



        return response(

            True,

            "Registration successful",

            {

                "user":

                serialize_user(user)

            },

            201

        )



    except Exception as e:


        db.session.rollback()


        print(

            "REGISTER ERROR:",

            repr(e)

        )


        return response(

            False,

            str(e),

            status=400

        )






# =====================================================
# LOGIN
# =====================================================


@auth_bp.route(
    "/login",
    methods=["POST"]
)

def login():

    try:


        data = request.get_json()



        print(
            "LOGIN REQUEST DATA:",
            data
        )



        if not data:


            return response(

                False,

                "Invalid request body",

                status=400

            )





        user = login_user(data)




        if not user:


            return response(

                False,

                "Invalid email or password",

                status=401

            )







        # =================================================
        # JWT TOKEN CREATION
        # FIXED HERE
        # =================================================


        access_token = create_access_token(

            identity=user,

            additional_claims={

                "role": user.role,

                "email": user.email

            }

        )





        print(

            "LOGIN SUCCESS:",

            user.email

        )





        return response(

            True,

            "Login successful",

            {

                "access_token":

                access_token,


                "user":

                serialize_user(user)

            }

        )






    except UnauthorizedError as e:


        return response(

            False,

            str(e),

            status=401

        )





    except Exception as e:


        db.session.rollback()


        print(

            "LOGIN ERROR:",

            repr(e)

        )


        return response(

            False,

            str(e),

            status=500

        )








# =====================================================
# PROFILE
# =====================================================


@auth_bp.route(
    "/profile",
    methods=["GET"]
)

@jwt_required()

def profile():


    try:


        identity = get_jwt_identity()



        user = db.session.get(

            User,

            int(identity)

        )



        if not user:


            return response(

                False,

                "User not found",

                status=404

            )





        return response(

            True,

            "Profile loaded",

            {

                "user":

                serialize_user(user)

            }

        )





    except Exception as e:


        print(

            "PROFILE ERROR:",

            repr(e)

        )


        return response(

            False,

            str(e),

            status=500

        )







# =====================================================
# LOGOUT
# =====================================================


@auth_bp.route(
    "/logout",
    methods=["POST"]
)

@jwt_required()

def logout():


    identity = get_jwt_identity()


    claims = get_jwt()



    return response(

        True,

        "Logout successful",

        {

            "user":

            identity,


            "role":

            claims.get("role")

        }

    )