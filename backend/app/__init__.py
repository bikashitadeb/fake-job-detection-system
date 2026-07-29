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

                "origins":[

                    "http://localhost:5173",

                    "http://127.0.0.1:5173"

                ],

                "methods":[

                    "GET",

                    "POST",

                    "PUT",

                    "DELETE",

                    "OPTIONS"

                ],

                "allow_headers":[

                    "Content-Type",

                    "Authorization"

                ],

                "supports_credentials":True

            }

        }

    )







    # ==========================
    # LOAD MODELS
    # ==========================


    from app.models.user_model import User

    from app.models.company_model import Company

    from app.models.job_model import Job

    from app.models.recruiter_model import Recruiter

    from app.models.application_model import Application

    from app.models.notification_model import Notification

    from app.models.token_blocklist_model import TokenBlocklist






    # ==========================
    # LOAD ROUTES
    # ==========================


    from app.routes.auth_routes import auth_bp

    from app.routes.job_routes import job_bp

    from app.routes.dashboard_routes import dashboard_bp

    from app.routes.analytics_routes import analytics_bp

    from app.routes.notification_routes import notification_bp

    from app.routes.application_routes import application_bp







    # ==========================
    # REGISTER BLUEPRINTS
    # ==========================


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


    app.register_blueprint(

        notification_bp

    )


    app.register_blueprint(

        application_bp

    )







    # ==========================
    # ERROR HANDLERS
    # ==========================


    from app.utils.error_handlers import register_error_handlers


    register_error_handlers(app)





    return app