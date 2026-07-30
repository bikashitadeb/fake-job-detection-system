# app/utils/error_handlers.py


from flask import jsonify, current_app


from sqlalchemy.exc import SQLAlchemyError


from werkzeug.exceptions import HTTPException


import logging




from app.utils.exceptions import (

    ConflictError,

    UnauthorizedError,

    ForbiddenError

)






logger = logging.getLogger(__name__)









# =====================================================
# STANDARD RESPONSE FORMAT
# =====================================================


def error_response(

        message,

        status_code,

        error=None

):


    response = {


        "success":False,


        "message":message,


    }



    if error:


        response["error"] = error



    return jsonify(response), status_code













# =====================================================
# REGISTER ERROR HANDLERS
# =====================================================


def register_error_handlers(app):







    # =================================================
    # CUSTOM APPLICATION ERRORS
    # =================================================


    @app.errorhandler(ConflictError)

    def handle_conflict(error):


        return error_response(

            str(error),

            409

        )







    @app.errorhandler(UnauthorizedError)

    def handle_unauthorized(error):


        return error_response(

            str(error),

            401

        )







    @app.errorhandler(ForbiddenError)

    def handle_forbidden(error):


        return error_response(

            str(error),

            403

        )









    # =================================================
    # CLIENT ERRORS
    # =================================================


    @app.errorhandler(400)

    def bad_request(error):


        return error_response(

            "Bad request",

            400,

            str(error)

        )









    @app.errorhandler(401)

    def unauthorized(error):


        return error_response(

            "Authentication required",

            401

        )









    @app.errorhandler(403)

    def forbidden(error):


        return error_response(

            "Access forbidden",

            403

        )









    @app.errorhandler(404)

    def not_found(error):


        return error_response(

            "Resource not found",

            404

        )









    @app.errorhandler(422)

    def validation_error(error):


        return error_response(

            "Validation failed",

            422,

            str(error)

        )









    # =================================================
    # DATABASE ERRORS
    # =================================================


    @app.errorhandler(SQLAlchemyError)

    def database_error(error):


        logger.exception(

            "Database error occurred"

        )


        return error_response(

            "Database operation failed",

            500

        )









    # =================================================
    # HTTP EXCEPTIONS
    # =================================================


    @app.errorhandler(HTTPException)

    def http_exception(error):


        return error_response(

            error.description,

            error.code

        )









    # =================================================
    # GLOBAL SERVER ERROR
    # =================================================


    @app.errorhandler(Exception)

    def internal_error(error):


        logger.exception(

            "Unhandled server error"

        )



        # Production safe response

        if current_app.config.get(

            "DEBUG"

        ):


            return error_response(

                "Internal server error",

                500,

                str(error)

            )



        return error_response(

            "Internal server error",

            500

        )