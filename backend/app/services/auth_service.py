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

        email=data["email"],

        role="employee"

    ).first()



    if existing_user:


        raise ConflictError(

            "Employee account already exists with this email"

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


        email=data["email"],


        role="recruiter"


    ).first()



    if existing_user:


        raise ConflictError(

            "Recruiter account already exists with this email"

        )








    try:



        # Create Company


        company = Company(


            company_name=data.get(

                "company_name"

            ),


            website_url=data.get(

                "company_website"

            ),


            company_domain=data.get(

                "company_domain"

            ),


            verification_status="pending",


            trust_score=0


        )





        db.session.add(company)


        db.session.flush()







        # Create Recruiter User


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





    except Exception as e:



        db.session.rollback()


        raise e












# =====================================
# LOGIN
# =====================================


def login_user(data):


    user = User.query.filter_by(


        email=data["email"],


        role=data["role"]


    ).first()





    if not user:


        raise UnauthorizedError(

            "Invalid email, password or role"

        )








    if not verify_password(


        data["password"],


        user.password_hash


    ):



        raise UnauthorizedError(

            "Invalid email, password or role"

        )







    # Return User object for JWT

    return user