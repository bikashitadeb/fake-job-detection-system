# app/utils/exceptions.py


from datetime import datetime, timezone







# =====================================================
# BASE API EXCEPTION
# =====================================================


class APIError(Exception):


    """
    Base application exception.


    Used for:

    - Validation failures
    - Authentication errors
    - Permission errors
    - Database conflicts
    - Business logic errors

    """



    def __init__(

            self,

            message,

            status_code=400,

            errors=None,

            error_code=None

    ):


        self.message = message


        self.status_code = status_code


        self.errors = errors or {}



        self.error_code = (

            error_code

            or

            "API_ERROR"

        )



        self.timestamp = datetime.now(

            timezone.utc

        ).isoformat()



        super().__init__(

            message

        )








    def to_dict(self):


        return {



            "success":False,



            "error":{


                "code":

                self.error_code,



                "message":

                self.message,



                "details":

                self.errors



            },



            "timestamp":

            self.timestamp



        }













# =====================================================
# VALIDATION ERROR
# =====================================================


class ValidationError(APIError):


    def __init__(

            self,

            message="Validation failed.",

            errors=None

    ):


        super().__init__(


            message,


            status_code=422,


            errors=errors,


            error_code="VALIDATION_ERROR"


        )












# =====================================================
# AUTHENTICATION ERROR
# =====================================================


class UnauthorizedError(APIError):


    def __init__(

            self,

            message="Unauthorized access."

    ):


        super().__init__(


            message,


            status_code=401,


            error_code="UNAUTHORIZED"


        )












# =====================================================
# FORBIDDEN ACCESS
# =====================================================


class ForbiddenError(APIError):


    def __init__(

            self,

            message="Access forbidden."

    ):


        super().__init__(


            message,


            status_code=403,


            error_code="FORBIDDEN"


        )












# =====================================================
# RESOURCE NOT FOUND
# =====================================================


class NotFoundError(APIError):


    def __init__(

            self,

            message="Resource not found."

    ):


        super().__init__(


            message,


            status_code=404,


            error_code="NOT_FOUND"


        )












# =====================================================
# CONFLICT ERROR
# =====================================================


class ConflictError(APIError):


    def __init__(

            self,

            message="Resource conflict."

    ):


        super().__init__(


            message,


            status_code=409,


            error_code="CONFLICT"


        )












# =====================================================
# DATABASE ERROR
# =====================================================


class DatabaseError(APIError):


    def __init__(

            self,

            message="Database operation failed."

    ):


        super().__init__(


            message,


            status_code=500,


            error_code="DATABASE_ERROR"


        )












# =====================================================
# AI MODEL ERROR
# =====================================================


class AIServiceError(APIError):


    def __init__(

            self,

            message="AI verification service failed."

    ):


        super().__init__(


            message,


            status_code=503,


            error_code="AI_SERVICE_ERROR"


        )












# =====================================================
# FILE PROCESSING ERROR
# =====================================================


class FileProcessingError(APIError):


    def __init__(

            self,

            message="File processing failed."

    ):


        super().__init__(


            message,


            status_code=400,


            error_code="FILE_PROCESSING_ERROR"


        )