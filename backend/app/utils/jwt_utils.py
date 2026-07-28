from flask_jwt_extended import (
    create_access_token,
    decode_token
)





# =====================================
# GENERATE JWT TOKEN
# =====================================


def generate_token(user):


    token = create_access_token(

        identity=str(user.id),

        additional_claims={

            "email": user.email,

            "role": user.role

        }

    )


    return token






# =====================================
# GET USER DATA FROM TOKEN
# =====================================


def get_token_data(token):


    decoded = decode_token(token)



    return {

        "id": decoded["sub"],

        "email": decoded["email"],

        "role": decoded["role"]

    }