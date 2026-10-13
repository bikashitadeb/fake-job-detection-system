from flask_jwt_extended import (
    create_access_token,
    decode_token
)



# =====================================================
# GENERATE USER JWT TOKEN
# =====================================================

def generate_token(user):


    print("===================")
    print("JWT USER:", user)
    print("JWT TYPE:", type(user))
    print("===================")



    if not hasattr(user, "id"):

        raise TypeError(

            f"JWT ERROR: Expected User object, received {type(user)}"

        )



    if user.id is None:

        raise ValueError(

            "JWT ERROR: User ID missing"

        )





    token = create_access_token(

        identity=user,

        additional_claims={

            "email": user.email,

            "role": user.role

        }

    )


    return token







# =====================================================
# ADMIN TOKEN
# =====================================================

def generate_admin_token(admin_user):


    if not hasattr(admin_user, "id"):

        raise TypeError(

            "Admin token requires User object"

        )



    return create_access_token(

        identity=admin_user,

        additional_claims={

            "email": admin_user.email,

            "role":"admin"

        }

    )








# =====================================================
# DECODE TOKEN
# =====================================================

def get_token_data(token):


    decoded = decode_token(token)


    return {

        "id": decoded.get("sub"),

        "email": decoded.get("email"),

        "role": decoded.get("role")

    }