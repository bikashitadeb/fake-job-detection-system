
from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    get_jwt
)

from app.extensions import db

from app.services.auth_service import (
    register_jobseeker,
    register_recruiter,
    login_user
)

from app.models.user_model import User
from app.utils.exceptions import UnauthorizedError


# =====================================================
# BLUEPRINT
# =====================================================

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


# =====================================================
# RESPONSE HELPER
# =====================================================

def response(
    success=True,
    message="",
    data=None,
    status=200
):
    result = {
        "success": success,
        "message": message
    }

    if data:
        result.update(data)

    return jsonify(result), status


# =====================================================
# USER SERIALIZER
# =====================================================

def serialize_user(user):
    if not user:
        return None

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "company_id": user.company_id,
        "is_verified": user.is_verified,
        "is_active": user.is_active,
        "created_at": (
            user.created_at.isoformat()
            if user.created_at
            else None
        )
    }


# =====================================================
# JWT ID RESOLVER
# =====================================================

def resolve_jwt_user_id():
    """
    Current tokens use the user's numeric ID as a string.
    This also supports older tokens whose identity contains
    the user's email address.
    """
    identity = get_jwt_identity()

    if identity is None:
        raise ValueError("JWT identity is missing.")

    identity = str(identity).strip()

    if identity.isdigit():
        return int(identity)

    # Compatibility for legacy identity strings containing email.
    import re
    from sqlalchemy import func

    match = re.search(
        r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}",
        identity
    )

    if match:
        user = User.query.filter(
            func.lower(User.email) == match.group(0).lower()
        ).first()

        if user:
            return user.id

    raise ValueError(
        "Invalid or outdated login token. Please log in again."
    )


# =====================================================
# REGISTER
# POST /api/auth/register
# =====================================================

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json(silent=True)

        if not data:
            return response(
                False,
                "Invalid request body",
                status=400
            )

        role = data.get("role")

        if role == "employee":
            user = register_jobseeker(data)

        elif role == "recruiter":
            user = register_recruiter(data)

        else:
            return response(
                False,
                "Invalid role",
                status=400
            )

        return response(
            True,
            "Registration successful",
            {"user": serialize_user(user)},
            201
        )

    except Exception as e:
        db.session.rollback()
        print("REGISTER ERROR:", repr(e))

        return response(
            False,
            str(e),
            status=400
        )


# =====================================================
# LOGIN
# POST /api/auth/login
# =====================================================

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json(silent=True)

        if not data:
            return response(
                False,
                "Invalid request body",
                status=400
            )

        # Authenticate using the existing auth service.
        user = login_user(data)

        if not user:
            return response(
                False,
                "Invalid email or password",
                status=401
            )

        # Reject inactive accounts if this field is available.
        if hasattr(user, "is_active") and not user.is_active:
            return response(
                False,
                "This account is inactive.",
                status=403
            )

        # IMPORTANT:
        # JWT identity must be a string, not a User object.
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "role": user.role,
                "email": user.email
            }
        )

        print(
            "LOGIN SUCCESS:",
            user.email,
            "| USER ID:",
            user.id,
            "| ROLE:",
            user.role
        )

        return response(
            True,
            "Login successful",
            {
                "access_token": access_token,
                "user": serialize_user(user)
            }
        )

    except UnauthorizedError as e:
        return response(
            False,
            str(e),
            status=401
        )

    except Exception as e:
        db.session.rollback()
        print("LOGIN ERROR:", repr(e))

        return response(
            False,
            "Login failed. Please check the server logs.",
            status=500
        )


# =====================================================
# PROFILE
# GET /api/auth/profile
# =====================================================

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    try:
        user_id = resolve_jwt_user_id()
        user = db.session.get(User, user_id)

        if not user:
            return response(
                False,
                "User not found",
                status=404
            )

        return response(
            True,
            "Profile loaded",
            {"user": serialize_user(user)}
        )

    except ValueError as e:
        return response(
            False,
            str(e),
            status=401
        )

    except Exception as e:
        db.session.rollback()
        print("PROFILE ERROR:", repr(e))

        return response(
            False,
            "Unable to load profile",
            status=500
        )


# =====================================================
# LOGOUT
# POST /api/auth/logout
# =====================================================

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    try:
        identity = get_jwt_identity()
        claims = get_jwt()

        return response(
            True,
            "Logout successful",
            {
                "user": identity,
                "role": claims.get("role")
            }
        )

    except Exception as e:
        print("LOGOUT ERROR:", repr(e))

        return response(
            False,
            "Unable to complete logout",
            status=500
        )
