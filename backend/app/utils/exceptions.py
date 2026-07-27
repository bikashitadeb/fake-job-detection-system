class APIError(Exception):
    def __init__(self, message, status_code=400, errors=None):
        self.message = message
        self.status_code = status_code
        self.errors = errors
        super().__init__(message)

    def to_dict(self):
        return {
            "success": False,
            "message": self.message,
            "errors": self.errors,
        }


class ValidationError(APIError):
    def __init__(self, message="Validation failed.", errors=None):
        super().__init__(message, 422, errors)


class UnauthorizedError(APIError):
    def __init__(self, message="Unauthorized"):
        super().__init__(message, 401)


class ForbiddenError(APIError):
    def __init__(self, message="Forbidden"):
        super().__init__(message, 403)


class NotFoundError(APIError):
    def __init__(self, message="Not found"):
        super().__init__(message, 404)


class ConflictError(APIError):
    def __init__(self, message="Conflict"):
        super().__init__(message, 409)