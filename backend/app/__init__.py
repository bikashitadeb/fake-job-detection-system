from flask import Flask

from flask_cors import CORS

from flask_jwt_extended import JWTManager


from app.config import get_config

from app.extensions import init_extensions

from app.errors.handlers import register_error_handlers

from app.middleware.request_logger import register_request_logging



from app.routes.auth_routes import auth_bp

from app.routes.job_routes import job_bp

from app.routes.application_routes import application_bp

from app.routes.verification_routes import verification_bp

from app.routes.admin_routes import admin_bp





def create_app():

    app = Flask(__name__)



    # ==========================
    # CONFIGURATION
    # ==========================

    app.config.from_object(
        get_config()
    )



    # ==========================
    # CORS
    # ==========================

    CORS(

        app,

        resources={

            r"/api/*": {

                "origins": "http://localhost:5173"

            }

        }

    )



    # ==========================
    # EXTENSIONS
    # ==========================

    init_extensions(app)



    # ==========================
    # JWT INITIALIZATION
    # ==========================

    jwt = JWTManager(app)



    @jwt.invalid_token_loader
    def invalid_token(reason):

        return {

            "success": False,

            "error": "Invalid token",

            "reason": reason

        }, 422



    @jwt.unauthorized_loader
    def missing_token(reason):

        return {

            "success": False,

            "error": "Missing Authorization token",

            "reason": reason

        }, 401



    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):

        return {

            "success": False,

            "error": "Token expired"

        }, 401



    # ==========================
    # ERROR HANDLERS
    # ==========================

    register_error_handlers(app)



    # ==========================
    # REQUEST LOGGER
    # ==========================

    register_request_logging(app)



    # ==========================
    # ROUTES
    # ==========================

    app.register_blueprint(auth_bp)

    app.register_blueprint(job_bp)

    app.register_blueprint(application_bp)

    app.register_blueprint(verification_bp)

    app.register_blueprint(admin_bp)





    @app.get("/")

    def home():

        return {

            "success": True,

            "message":
            "Fake Job Detection API is running!",

            "version":
            "1.0"

        }



    return app