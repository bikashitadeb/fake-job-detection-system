# app/utils/token_utils.py


from itsdangerous import (

    URLSafeTimedSerializer,

    BadSignature,

    SignatureExpired

)



from flask import current_app



import logging





logger = logging.getLogger(__name__)







# =====================================================
# TOKEN CONFIGURATION
# =====================================================


RESET_PASSWORD_SALT = (

    "reset-password"

)



EMAIL_VERIFY_SALT = (

    "email-verification"

)



RESET_TOKEN_EXPIRES = (

    1800

)
# 30 minutes







# =====================================================
# SERIALIZER
# =====================================================


def get_serializer():


    return URLSafeTimedSerializer(

        current_app.config[

            "SECRET_KEY"

        ]

    )









# =====================================================
# GENERATE PASSWORD RESET TOKEN
# =====================================================


def generate_reset_token(

        email: str

) -> str:


    """
    Generate secure password reset token.

    """



    serializer = get_serializer()



    token = serializer.dumps(

        {

            "email": email,

            "purpose":

            "password_reset"

        },

        salt=RESET_PASSWORD_SALT

    )



    return token










# =====================================================
# VERIFY PASSWORD RESET TOKEN
# =====================================================


def verify_reset_token(

        token: str,

        max_age=RESET_TOKEN_EXPIRES

) -> str:


    """
    Validate password reset token.

    Returns:

        email

    """



    serializer = get_serializer()



    try:



        data = serializer.loads(

            token,

            salt=RESET_PASSWORD_SALT,

            max_age=max_age

        )




        if data.get(

            "purpose"

        ) != "password_reset":



            raise ValueError(

                "Invalid token purpose"

            )





        return data.get(

            "email"

        )







    except SignatureExpired:



        logger.warning(

            "Expired password reset token used"

        )



        raise ValueError(

            "Password reset token expired."

        )








    except BadSignature:



        logger.warning(

            "Invalid password reset token attempt"

        )



        raise ValueError(

            "Invalid password reset token."

        )









# =====================================================
# EMAIL VERIFICATION TOKEN
# =====================================================


def generate_email_verify_token(

        email:str

) -> str:


    serializer = get_serializer()



    return serializer.dumps(

        {

            "email":email,

            "purpose":

            "email_verification"

        },


        salt=EMAIL_VERIFY_SALT

    )









def verify_email_token(

        token:str,

        max_age=86400

):


    """
    Verify email token.

    Default expiry:

    24 hours

    """



    serializer = get_serializer()



    try:



        data = serializer.loads(

            token,

            salt=EMAIL_VERIFY_SALT,

            max_age=max_age

        )





        if data.get(

            "purpose"

        ) != "email_verification":



            raise ValueError(

                "Invalid verification token"

            )






        return data.get(

            "email"

        )







    except SignatureExpired:



        raise ValueError(

            "Email verification token expired."

        )







    except BadSignature:



        raise ValueError(

            "Invalid email verification token."

        )