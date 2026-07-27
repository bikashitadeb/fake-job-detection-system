from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from app.utils.exceptions import ForbiddenError, UnauthorizedError


def roles_required(*allowed_roles):
    """Decorator to restrict a route to one or more roles.
    Must be used together with @jwt_required() (applied internally here).

    Usage:
        @jobs_bp.route("/", methods=["POST"])
        @roles_required("recruiter", "admin")
        def create_job():
            ...
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as exc:
                raise UnauthorizedError("A valid access token is required.") from exc

            claims = get_jwt()
            role = claims.get("role")
            if role not in allowed_roles:
                raise ForbiddenError(
                    f"Access restricted to roles: {', '.join(allowed_roles)}."
                )
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def jwt_required_custom(fn):
    """Simple wrapper ensuring a valid JWT is present, raising our own
    UnauthorizedError (rather than flask-jwt-extended's default) so the
    response shape stays consistent with the rest of the API.
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception as exc:
            raise UnauthorizedError("A valid access token is required.") from exc
        return fn(*args, **kwargs)

    return wrapper