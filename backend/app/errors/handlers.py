from flask import jsonify
from werkzeug.exceptions import HTTPException
from marshmallow import ValidationError as MarshmallowValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.utils.exceptions import APIError
from app.extensions import db


def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(err):
        app.logger.warning("APIError [%s]: %s | errors=%s", err.status_code, err.message, err.errors)
        return jsonify(err.to_dict()), err.status_code

    @app.errorhandler(MarshmallowValidationError)
    def handle_marshmallow_error(err):
        app.logger.warning("Validation error: %s", err.messages)
        return (
            jsonify({"success": False, "message": "Validation failed.", "errors": err.messages}),
            422,
        )

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(err):
        db.session.rollback()
        app.logger.error("Database integrity error: %s", str(err.orig))
        return (
            jsonify(
                {
                    "success": False,
                    "message": "A database integrity error occurred (e.g. duplicate entry).",
                    "errors": None,
                }
            ),
            409,
        )

    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(err):
        db.session.rollback()
        app.logger.exception("Database error: %s", err)
        return (
            jsonify({"success": False, "message": "A database error occurred.", "errors": None}),
            500,
        )

    @app.errorhandler(HTTPException)
    def handle_http_exception(err):
        app.logger.warning("HTTPException [%s]: %s", err.code, err.description)
        return (
            jsonify({"success": False, "message": err.description, "errors": None}),
            err.code,
        )

    @app.errorhandler(404)
    def handle_404(err):
        return jsonify({"success": False, "message": "Resource not found.", "errors": None}), 404

    @app.errorhandler(405)
    def handle_405(err):
        return (
            jsonify({"success": False, "message": "Method not allowed.", "errors": None}),
            405,
        )

    @app.errorhandler(Exception)
    def handle_uncaught_exception(err):
        db.session.rollback()
        app.logger.exception("Unhandled exception: %s", err)
        return (
            jsonify(
                {
                    "success": False,
                    "message": "An unexpected internal error occurred.",
                    "errors": None,
                }
            ),
            500,
        )