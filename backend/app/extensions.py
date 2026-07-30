from flask_sqlalchemy import SQLAlchemy

from flask_migrate import Migrate

from flask_jwt_extended import JWTManager

from flask_cors import CORS

from flask_bcrypt import Bcrypt





# =====================================================
# DATABASE ORM
# =====================================================

db = SQLAlchemy()





# =====================================================
# DATABASE MIGRATION
# =====================================================

migrate = Migrate()





# =====================================================
# JWT AUTHENTICATION
# =====================================================

jwt = JWTManager()





# =====================================================
# PASSWORD SECURITY
# =====================================================

bcrypt = Bcrypt()





# =====================================================
# FRONTEND API ACCESS
# =====================================================

cors = CORS()





# =====================================================
# JWT IDENTITY HANDLER
# =====================================================

@jwt.user_identity_loader
def user_identity_lookup(identity):

    """
    Converts JWT identity into string.

    Login sends:
        identity=str(user.id)

    So do not access .id here.
    """

    return str(identity)





# =====================================================
# JWT ERROR RESPONSES
# =====================================================


@jwt.unauthorized_loader
def missing_token(reason):

    return {

        "success": False,

        "message":
        "Authentication token missing"

    }, 401





@jwt.invalid_token_loader
def invalid_token(reason):

    return {

        "success": False,

        "message":
        "Invalid authentication token"

    }, 401





@jwt.expired_token_loader
def expired_token(jwt_header, jwt_payload):

    return {

        "success": False,

        "message":
        "Token expired. Please login again"

    }, 401





@jwt.revoked_token_loader
def revoked_token(jwt_header, jwt_payload):

    return {

        "success": False,

        "message":
        "Token revoked"

    }, 401