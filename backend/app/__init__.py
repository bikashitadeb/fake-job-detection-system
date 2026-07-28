from flask import Flask

from app.extensions import (
    db,
    jwt,
    cors
)



def create_app():

    app = Flask(__name__)


    # ==========================
    # CONFIG
    # ==========================

    app.config.from_object(
        "app.config.Config"
    )



    # ==========================
    # EXTENSIONS
    # ==========================

    db.init_app(app)

    jwt.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*":{
                "origins":"*"
            }
        }
    )



    # ==========================
    # DATABASE MODELS
    # ==========================

    from app.models.user_model import User
    from app.models.job_model import Job
    from app.models.company_model import Company
    from app.models.recruiter_model import Recruiter
    from app.models.application_model import Application
    from app.models.token_blocklist_model import TokenBlocklist



    # ==========================
    # ROUTES
    # ==========================

    from app.routes.auth_routes import auth_bp
    from app.routes.job_routes import job_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.analytics_routes import analytics_bp



    app.register_blueprint(
        auth_bp
    )


    app.register_blueprint(
        job_bp
    )


    app.register_blueprint(
        dashboard_bp
    )


    app.register_blueprint(
        analytics_bp
    )



    # ==========================
    # ERROR HANDLERS
    # ==========================

    from app.utils.error_handlers import register_error_handlers

    register_error_handlers(app)



    return app