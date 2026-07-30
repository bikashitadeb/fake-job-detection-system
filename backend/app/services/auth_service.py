from datetime import datetime, timezone

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



# =====================================================
# EMAIL NORMALIZER
# =====================================================

def normalize_email(email):

    if not email:
        return None

    return email.strip().lower()



# =====================================================
# REGISTER EMPLOYEE
# =====================================================

def register_jobseeker(data):

    email = normalize_email(
        data.get("email")
    )

    password = data.get("password")

    name = data.get("full_name")


    if not email or not password or not name:

        raise ValueError(
            "Name, email and password are required"
        )


    existing = User.query.filter_by(
        email=email
    ).first()


    if existing:

        raise ConflictError(
            "Account already exists"
        )


    try:

        user = User(

            name=name.strip(),

            email=email,

            password_hash=hash_password(
                password
            ),

            phone=data.get("phone"),

            role="employee",

            is_active=True,

            is_verified=False,

            trust_score=0,

            risk_score=0,

            fraud_reports=0,

            ai_flagged=False,

            login_attempts=0,

            account_locked=False

        )


        db.session.add(user)

        db.session.commit()


        return user



    except Exception as e:

        db.session.rollback()

        print(
            "EMPLOYEE REGISTER ERROR:",
            e
        )

        raise e





# =====================================================
# REGISTER RECRUITER
# =====================================================

def register_recruiter(data):


    email = normalize_email(
        data.get("email")
    )

    password = data.get("password")

    name = data.get("full_name")



    if not email or not password or not name:

        raise ValueError(
            "Name, email and password are required"
        )



    existing = User.query.filter_by(
        email=email
    ).first()



    if existing:

        raise ConflictError(
            "Account already exists"
        )



    try:


        company = Company(

            company_name=data.get(
                "company_name",
                "Unknown Company"
            ),


            website_url=data.get(
                "company_website"
            ),


            company_domain=data.get(
                "company_domain"
            ),


            verification_status="pending",

            trust_score=0,

            reputation_score=0,

            risk_score=0

        )


        db.session.add(company)

        db.session.flush()



        recruiter = User(


            name=name.strip(),


            email=email,


            password_hash=hash_password(
                password
            ),


            phone=data.get(
                "phone"
            ),


            role="recruiter",


            company_id=company.id,


            is_active=True,


            is_verified=False,


            trust_score=0,


            risk_score=0,


            login_attempts=0,


            account_locked=False

        )



        db.session.add(recruiter)

        db.session.commit()



        return recruiter



    except Exception as e:


        db.session.rollback()


        print(
            "RECRUITER REGISTER ERROR:",
            e
        )


        raise e





# =====================================================
# LOGIN USER
# =====================================================

def login_user(data):


    print(
        "RAW LOGIN DATA:",
        data
    )


    email = normalize_email(
        data.get("email")
    )


    password = data.get(
        "password"
    )


    role = data.get(
        "role"
    )



    print(
        "LOGIN EMAIL:",
        email
    )


    print(
        "LOGIN ROLE:",
        role
    )




    if not email or not password:


        raise UnauthorizedError(
            "Email and password required"
        )




    user = User.query.filter_by(

        email=email

    ).first()



    print(
        "DATABASE USER:",
        user
    )



    if not user:


        raise UnauthorizedError(
            "Invalid email or password"
        )





    # role verification

    if role and user.role != role:


        raise UnauthorizedError(
            "Incorrect account type"
        )





    # account checks

    if not user.is_active:


        raise UnauthorizedError(
            "Account inactive"
        )





    if user.account_locked:


        raise UnauthorizedError(
            "Account locked"
        )






    # password check

    password_valid = verify_password(

        password,

        user.password_hash

    )



    print(
        "PASSWORD CHECK:",
        password_valid
    )





    if not password_valid:


        user.login_attempts = (

            user.login_attempts or 0

        ) + 1



        if user.login_attempts >= 5:

            user.account_locked = True



        db.session.commit()



        raise UnauthorizedError(
            "Invalid email or password"
        )






    # successful login


    user.login_attempts = 0

    user.account_locked = False


    user.last_login = datetime.now(
        timezone.utc
    )



    db.session.commit()



    print(
        "LOGIN SUCCESS:",
        user.email
    )



    return user