from flask import Blueprint, request, jsonify


from app.services.auth_service import (

    register_jobseeker,

    register_recruiter,

    login_user

)


from app.utils.jwt_utils import generate_token






auth_bp = Blueprint(

    "auth",

    __name__,

    url_prefix="/api/auth"

)








# =====================================
# REGISTER USER
# =====================================


@auth_bp.route(

    "/register",

    methods=["POST"]

)

def register():


    data = request.get_json()



    if not data:


        return jsonify({

            "message":"Invalid request"

        }),400






    role = data.get("role")



    try:



        if role == "employee":


            user = register_jobseeker(data)




        elif role == "recruiter":


            user = register_recruiter(data)




        else:


            return jsonify({

                "message":"Invalid role"

            }),400






        return jsonify({


            "message":

            "Registration successful",



            "user":

            user



        }),201





    except Exception as e:



        print(

            "REGISTER ERROR:",

            str(e)

        )



        return jsonify({


            "message":

            str(e)



        }),400













# =====================================
# LOGIN
# =====================================


@auth_bp.route(

    "/login",

    methods=["POST"]

)

def login():



    data = request.get_json()



    if not data:


        return jsonify({

            "message":"Invalid request"

        }),400





    try:



        user = login_user(data)




        token = generate_token(user)





        return jsonify({


            "message":

            "Login successful",



            "access_token":

            token,



            "user":

            user.to_dict()



        }),200






    except Exception as e:



        print(

            "LOGIN ERROR:",

            str(e)

        )



        return jsonify({


            "message":

            str(e)



        }),401