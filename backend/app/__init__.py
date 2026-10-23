from flask import Flask, jsonify

from app.extensions import bcrypt, cors, db, jwt, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["CORS_ORIGINS"],
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization", "Accept"],
                "supports_credentials": app.config["CORS_SUPPORTS_CREDENTIALS"],
            }
        },
    )

    # Import every model so Flask-Migrate sees the complete SQLAlchemy metadata.
    with app.app_context():
        from app import models as _models  # noqa: F401

    from app.routes.admin_routes import admin_bp
    from app.routes.analytics_routes import analytics_bp
    from app.routes.application_routes import application_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.job_routes import job_bp
    from app.routes.notification_routes import notification_bp
    from app.routes.verification_routes import verification_bp

    for blueprint in (auth_bp, job_bp, dashboard_bp, analytics_bp, notification_bp, application_bp, admin_bp, verification_bp):
        app.register_blueprint(blueprint)

    @jwt.unauthorized_loader
    def missing_token(_error):
        return jsonify({"message": "Authorization token required"}), 401

    @jwt.invalid_token_loader
    def invalid_token(_error):
        return jsonify({"message": "Invalid authentication token"}), 401

    @jwt.expired_token_loader
    def expired_token(_jwt_header, _jwt_payload):
        return jsonify({"message": "Session expired. Login again"}), 401

    @jwt.revoked_token_loader
    def revoked_token(_jwt_header, _jwt_payload):
        return jsonify({"message": "Token revoked"}), 401

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"message": "API endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(_error):
        return jsonify({"message": "Internal server error"}), 500

    from app.utils.error_handlers import register_error_handlers
    register_error_handlers(app)

    @app.get("/")
    @app.get("/healthz")
    def healthz():
        return jsonify({"status": "running", "service": "AI Fake Job Detection API", "version": "2.0"})

    return app
