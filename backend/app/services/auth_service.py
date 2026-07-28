from app.extensions import db

from app.models.user_model import User

from app.models.company_model import Company

from app.utils.password_utils import (
    hash_password,
    verify_password
)

from app.utils.exceptions import (
    ConflictError,
    UnauthorizedError
)





# =====================================
# EMPLOYEE REGISTER
# =====================================


def register_jobseeker(data):


    existing_user = User.query.filter_by(

        email=data["email"]

    ).first()



    if existing_user:


        raise ConflictError(

            "Email already exists"

        )





    user = User(

        name=data["full_name"],

        email=data["email"],

        password_hash=hash_password(

            data["password"]

        ),

        phone=data.get("phone"),

        role="employee"

    )





    db.session.add(user)


    db.session.commit()



    return user.to_dict()







# =====================================
# RECRUITER REGISTER
# =====================================


def register_recruiter(data):


    existing_user = User.query.filter_by(

        email=data["email"]

    ).first()



    if existing_user:


        raise ConflictError(

            "Email already exists"

        )





    company = Company(

        name=data.get("company_name"),

        website=data.get("company_website"),

        linkedin_url=data.get("linkedin_url")

    )





    db.session.add(company)


    db.session.flush()





    recruiter = User(

        name=data["full_name"],

        email=data["email"],

        password_hash=hash_password(

            data["password"]

        ),

        phone=data.get("phone"),

        role="recruiter",

        company_id=company.id

    )





    db.session.add(recruiter)


    db.session.commit()



    return recruiter.to_dict()







# =====================================
# LOGIN
# =====================================


def login_user(data):


    user = User.query.filter_by(

        email=data["email"]

    ).first()



    if not user:


        raise UnauthorizedError(

            "Invalid email or password"

        )





    if not verify_password(

        data["password"],

        user.password_hash

    ):


        raise UnauthorizedError(

            "Invalid email or password"

        )





    # IMPORTANT
    # Return User object for JWT creation

    return user