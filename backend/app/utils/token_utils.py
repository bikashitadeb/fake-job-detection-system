from itsdangerous import (  # type: ignore
    URLSafeTimedSerializer,
    BadSignature,
    SignatureExpired
)

from flask import current_app  # type: ignore


RESET_PASSWORD_SALT = "reset-password"

# Token validity: 30 minutes
RESET_TOKEN_EXPIRES = 1800



# -----------------------------------
# Generate Reset Password Token
# -----------------------------------

def generate_reset_token(email: str) -> str:

    serializer = URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"]
    )

    token = serializer.dumps(
        email,
        salt=RESET_PASSWORD_SALT
    )

    return token



# -----------------------------------
# Verify Reset Password Token
# -----------------------------------

def verify_reset_token(
        token: str,
        max_age: int = RESET_TOKEN_EXPIRES
) -> str:


    serializer = URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"]
    )


    try:

        email = serializer.loads(
            token,
            salt=RESET_PASSWORD_SALT,
            max_age=max_age
        )


        return email



    except SignatureExpired:

        raise ValueError(
            "Password reset token has expired."
        )



    except BadSignature:

        raise ValueError(
            "Invalid password reset token."
        )