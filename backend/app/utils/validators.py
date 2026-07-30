# app/utils/validators.py


import re

from urllib.parse import urlparse







# =====================================================
# COMMON VALIDATORS
# =====================================================


def is_valid_email(email):


    pattern = (

        r"^[a-zA-Z0-9._%+-]+@"

        r"[a-zA-Z0-9.-]+\."

        r"[a-zA-Z]{2,}$"

    )


    return re.match(

        pattern,

        email

    )








def is_valid_url(url):


    try:


        result = urlparse(url)


        return all([

            result.scheme,

            result.netloc

        ])


    except Exception:


        return False











def is_valid_phone(phone):


    return re.match(

        r"^[6-9]\d{9}$",

        phone

    )









# =====================================================
# REGISTRATION VALIDATION
# =====================================================


def validate_registration_payload(data):


    errors = {}





    name = data.get(

        "name"

    )



    if not name:


        errors["name"] = (

            "Full name is required."

        )





    email = data.get(

        "email",

        ""

    ).strip()



    if not email:


        errors["email"] = (

            "Email is required."

        )


    elif not is_valid_email(email):


        errors["email"] = (

            "Invalid email format."

        )







    password = data.get(

        "password",

        ""

    )



    valid, message = validate_password_strength(

        password

    )



    if not valid:


        errors["password"] = message







    role = data.get(

        "role",

        "employee"

    )



    allowed_roles = [

        "employee",

        "recruiter",

        "admin"

    ]



    if role not in allowed_roles:


        errors["role"] = (

            "Invalid user role."

        )








    phone = data.get(

        "phone"

    )



    if phone and not is_valid_phone(phone):


        errors["phone"] = (

            "Invalid phone number."

        )





    return errors










# =====================================================
# LOGIN VALIDATION
# =====================================================


def validate_login_payload(data):


    errors = {}



    email = data.get(

        "email"

    )



    password = data.get(

        "password"

    )




    if not email:


        errors["email"] = (

            "Email is required."

        )



    elif not is_valid_email(email):


        errors["email"] = (

            "Invalid email format."

        )






    if not password:


        errors["password"] = (

            "Password is required."

        )






    return errors











# =====================================================
# PASSWORD SECURITY
# =====================================================


def validate_password_strength(password):


    if len(password) < 8:


        return False, (

            "Password must contain minimum 8 characters."

        )




    if not re.search(

        r"[A-Z]",

        password

    ):


        return False, (

            "Password requires uppercase letter."

        )





    if not re.search(

        r"[a-z]",

        password

    ):


        return False, (

            "Password requires lowercase letter."

        )





    if not re.search(

        r"\d",

        password

    ):


        return False, (

            "Password requires a number."

        )





    if not re.search(

        r"[!@#$%^&*]",

        password

    ):


        return False, (

            "Password requires special character."

        )






    return True, "Valid"









# =====================================================
# JOB CREATION VALIDATION
# =====================================================


def validate_job_payload(data):


    errors = {}



    required_fields = [

        "title",

        "description",

        "location",

        "company"

    ]





    for field in required_fields:


        if not data.get(field):


            errors[field] = (

                f"{field} is required."

            )






    salary = data.get(

        "salary"

    )



    if salary:


        try:


            float(salary)



        except ValueError:


            errors["salary"] = (

                "Salary must be numeric."

            )





    return errors











# =====================================================
# APPLICATION VALIDATION
# =====================================================


def validate_application_payload(data):


    errors = {}




    if not data.get(

        "job_id"

    ):


        errors["job_id"] = (

            "Job ID required."

        )





    if not data.get(

        "resume_url"

    ):


        errors["resume_url"] = (

            "Resume URL required."

        )



    elif not is_valid_url(

        data["resume_url"]

    ):


        errors["resume_url"] = (

            "Invalid resume URL."

        )






    return errors











# =====================================================
# PAGINATION VALIDATION
# =====================================================


def paginate_args(

        args,

        default_page_size=10,

        max_page_size=100

):


    try:


        page = int(

            args.get(

                "page",

                1

            )

        )



        per_page = int(

            args.get(

                "per_page",

                default_page_size

            )

        )



    except ValueError:


        page = 1

        per_page = default_page_size







    if page < 1:


        page = 1





    if per_page < 1:


        per_page = default_page_size





    if per_page > max_page_size:


        per_page = max_page_size





    return page, per_page