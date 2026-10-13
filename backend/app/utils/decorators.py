# app/utils/decorators.py


from functools import wraps


from flask_jwt_extended import (

    verify_jwt_in_request,

    get_jwt,

    get_jwt_identity

)



import logging



from app.utils.exceptions import (

    ForbiddenError,

    UnauthorizedError

)







logger = logging.getLogger(__name__)









# =====================================================
# ROLE BASED ACCESS CONTROL
# =====================================================


def roles_required(*allowed_roles):

    """
    Enterprise Role Based Access Control


    Example:

        @roles_required(
            "admin",
            "recruiter"
        )

        def create_job():
            pass


    """



    def decorator(function):


        @wraps(function)

        def wrapper(*args, **kwargs):


            try:



                verify_jwt_in_request()



            except Exception as e:



                logger.warning(

                    "Unauthorized JWT access attempt"

                )


                raise UnauthorizedError(

                    "Valid authentication token required"

                ) from e







            claims = get_jwt()



            user_role = claims.get(

                "role"

            )





            user_id = get_jwt_identity()






            if not user_role:



                logger.warning(

                    "Missing role claim for user %s",

                    user_id

                )


                raise ForbiddenError(

                    "User role missing"

                )







            if user_role not in allowed_roles:




                logger.warning(

                    "Access denied user=%s role=%s",

                    user_id,

                    user_role

                )



                raise ForbiddenError(



                    f"This resource requires: "

                    f"{', '.join(allowed_roles)}"



                )







            return function(

                *args,

                **kwargs

            )




        return wrapper



    return decorator













# =====================================================
# AUTHENTICATION ONLY
# =====================================================


def jwt_required_custom(function):


    """
    Custom JWT authentication decorator.


    Provides consistent API errors.


    """



    @wraps(function)

    def wrapper(*args, **kwargs):


        try:


            verify_jwt_in_request()



        except Exception as e:



            raise UnauthorizedError(

                "Authentication required"

            ) from e





        return function(

            *args,

            **kwargs

        )




    return wrapper












# =====================================================
# ADMIN ONLY
# =====================================================


def admin_required(function):


    """
    Restrict endpoint to admin users.
    """



    @wraps(function)

    def wrapper(*args, **kwargs):


        try:



            verify_jwt_in_request()



        except Exception as e:



            raise UnauthorizedError(

                "Admin authentication required"

            ) from e





        claims = get_jwt()



        if claims.get("role") != "admin":



            raise ForbiddenError(

                "Administrator access required"

            )





        return function(

            *args,

            **kwargs

        )



    return wrapper












# =====================================================
# RECRUITER ONLY
# =====================================================


def recruiter_required(function):


    """
    Restrict endpoint to recruiters.
    """



    return roles_required(

        "recruiter"

    )(function)









# =====================================================
# EMPLOYEE ONLY
# =====================================================


def employee_required(function):


    """
    Restrict endpoint to employees.
    """



    return roles_required(

        "employee"

    )(function)