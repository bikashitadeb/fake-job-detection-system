from flask import Flask, jsonify, request


from app.extensions import (
    db,
    jwt,
    cors,
    migrate,
    bcrypt
)





def create_app():


    app = Flask(__name__)




    # =====================================================
    # CONFIGURATION
    # =====================================================


    app.config.from_object(
        "app.config.Config"
    )






    # =====================================================
    # JWT CONFIGURATION
    # =====================================================


    app.config["JWT_TOKEN_LOCATION"] = [
        "headers"
    ]


    app.config["JWT_HEADER_NAME"] = "Authorization"


    app.config["JWT_HEADER_TYPE"] = "Bearer"







    # =====================================================
    # INITIALIZE EXTENSIONS
    # =====================================================


    db.init_app(app)


    migrate.init_app(
        app,
        db
    )


    jwt.init_app(app)


    bcrypt.init_app(app)







    # =====================================================
    # CORS CONFIGURATION
    # =====================================================


    cors.init_app(

        app,

        resources={

            r"/api/*": {

                "origins":[

                    "http://localhost:5173",

                    "http://127.0.0.1:5173"

                ],

                "methods":[

                    "GET",

                    "POST",

                    "PUT",

                    "PATCH",

                    "DELETE",

                    "OPTIONS"

                ],

                "allow_headers":[

                    "Content-Type",

                    "Authorization",

                    "Accept"

                ],

                "supports_credentials":True

            }

        }

    )







    # =====================================================
    # HANDLE PREFLIGHT REQUEST
    # =====================================================


    @app.before_request
    def handle_preflight():


        if request.method == "OPTIONS":


            return jsonify({

                "message":
                "CORS preflight successful"

            }),200







    # =====================================================
    # ADD CORS HEADERS
    # =====================================================


    @app.after_request
    def add_cors_headers(response):


        response.headers["Access-Control-Allow-Origin"] = (
            "http://localhost:5173"
        )


        response.headers["Access-Control-Allow-Headers"] = (
            "Content-Type, Authorization, Accept"
        )


        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        )


        response.headers["Access-Control-Allow-Credentials"] = (
            "true"
        )


        return response







    # =====================================================
    # LOAD DATABASE MODELS
    # =====================================================


    with app.app_context():


        from app.models.user_model import User

        from app.models.company_model import Company

        from app.models.job_model import Job

        from app.models.recruiter_model import Recruiter

        from app.models.application_model import Application

        from app.models.notification_model import Notification

        from app.models.token_blocklist_model import TokenBlocklist

        from app.models.flag_log_model import FlagLog




        try:


            db.create_all()


            print(
                "Database tables verified"
            )


        except Exception as e:


            print(

                "Database initialization error:",

                e

            )








    # =====================================================
    # REGISTER BLUEPRINTS
    # =====================================================


    from app.routes.auth_routes import auth_bp

    from app.routes.job_routes import job_bp

    from app.routes.dashboard_routes import dashboard_bp

    from app.routes.analytics_routes import analytics_bp

    from app.routes.notification_routes import notification_bp

    from app.routes.application_routes import application_bp






    app.register_blueprint(auth_bp)

    app.register_blueprint(job_bp)

    app.register_blueprint(dashboard_bp)

    app.register_blueprint(analytics_bp)

    app.register_blueprint(notification_bp)

    app.register_blueprint(application_bp)







    # =====================================================
    # JWT ERROR HANDLERS
    # =====================================================


    @jwt.unauthorized_loader
    def missing_token(error):


        return jsonify({

            "message":

            "Authorization token required"

        }),401






    @jwt.invalid_token_loader
    def invalid_token(error):


        return jsonify({

            "message":

            "Invalid authentication token"

        }),401






    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):


        return jsonify({

            "message":

            "Session expired. Login again"

        }),401






    @jwt.revoked_token_loader
    def revoked_token(jwt_header, jwt_payload):


        return jsonify({

            "message":

            "Token revoked"

        }),401







    # =====================================================
    # ERROR HANDLERS
    # =====================================================


    @app.errorhandler(404)
    def not_found(error):


        return jsonify({

            "message":

            "API endpoint not found"

        }),404






    @app.errorhandler(500)
    def server_error(error):


        return jsonify({

            "message":

            "Internal server error"

        }),500







    # =====================================================
    # CUSTOM ERROR HANDLERS
    # =====================================================


    from app.utils.error_handlers import register_error_handlers


    register_error_handlers(app)







    # =====================================================
    # HEALTH CHECK
    # =====================================================


    @app.route("/")
    def home():


        return jsonify({

            "status":
            "running",

            "service":
            "AI Fake Job Detection API",

            "version":
            "2.0"

        })






    return app