from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
)

from app.extensions import db

from app.models.user_model import User
from app.models.recruiter_model import Recruiter
from app.models.company_model import Company
from app.models.token_blocklist_model import TokenBlocklist


from app.utils.password_utils import (
    hash_password,
    verify_password
)


from app.utils.token_utils import (
    generate_reset_token,
    verify_reset_token
)


from app.utils.exceptions import (
    ConflictError,
    UnauthorizedError,
    NotFoundError,
    ValidationError,
)



# =========================
# REGISTER JOBSEEKER
# =========================

def register_jobseeker(data):

    existing = User.query.filter_by(
        email=data["email"]
    ).first()


    if existing:
        raise ConflictError(
            "Email already exists"
        )


    user = User(

        full_name=data["full_name"],

        email=data["email"],

        password_hash=
        hash_password(
            data["password"]
        ),

        role="jobseeker",

        phone=data.get("phone")

    )


    db.session.add(user)

    db.session.commit()


    return user.to_dict()





# =========================
# REGISTER RECRUITER
# =========================

def register_recruiter(data):


    existing = User.query.filter_by(
        email=data["email"]
    ).first()


    if existing:
        raise ConflictError(
            "Email already exists"
        )


    company = Company.query.get(
        data["company_id"]
    )


    if not company:

        raise NotFoundError(
            "Company not found"
        )



    user = User(

        full_name=data["full_name"],

        email=data["email"],

        password_hash=
        hash_password(
            data["password"]
        ),

        role="recruiter",

        phone=data.get("phone")

    )


    db.session.add(user)

    db.session.flush()



    recruiter = Recruiter(

        user_id=user.id,

        company_id=data["company_id"],

        designation=data.get(
            "designation"
        )

    )


    db.session.add(recruiter)

    db.session.commit()



    return user.to_dict()




# =========================
# LOGIN
# =========================

def login_user(email, password):


    user = User.query.filter_by(
        email=email
    ).first()



    if not user:

        raise UnauthorizedError(
            "Invalid email or password"
        )



    if not verify_password(
        password,
        user.password_hash
    ):

        raise UnauthorizedError(
            "Invalid email or password"
        )



    claims = {

        "role": user.role,

        "email": user.email

    }



    access_token = create_access_token(

        identity=str(user.id),

        additional_claims=claims

    )



    refresh_token = create_refresh_token(

        identity=str(user.id),

        additional_claims=claims

    )



    return {


        "user":
        user.to_dict(),


        "access_token":
        access_token,


        "refresh_token":
        refresh_token

    }




# =========================
# CHANGE PASSWORD
# =========================


def change_password(
        user_id,
        old_password,
        new_password
):


    user = User.query.get(
        user_id
    )


    if not user:

        raise NotFoundError(
            "User not found"
        )



    if not verify_password(
        old_password,
        user.password_hash
    ):

        raise UnauthorizedError(
            "Wrong password"
        )



    user.password_hash = hash_password(
        new_password
    )


    db.session.commit()





# =========================
# LOGOUT
# =========================


def logout_current_token(user_id):


    token = get_jwt()


    block = TokenBlocklist(

        jti=token["jti"],

        token_type=token["type"],

        user_id=user_id

    )


    db.session.add(block)

    db.session.commit()




# =========================
# FORGOT PASSWORD
# =========================


def request_password_reset(email):


    user = User.query.filter_by(
        email=email
    ).first()



    if not user:

        return {

            "message":
            "If email exists reset link sent"

        }



    token = generate_reset_token(
        email
    )


    return {


        "message":
        "Reset token generated",


        "reset_token":
        token

    }




# =========================
# RESET PASSWORD
# =========================


def reset_password(token,new_password):


    try:

        email = verify_reset_token(
            token
        )


    except ValueError as e:

        raise ValidationError(
            str(e)
        )



    user = User.query.filter_by(
        email=email
    ).first()



    if not user:

        raise NotFoundError(
            "User not found"
        )



    user.password_hash = hash_password(
        new_password
    )


    db.session.commit()