# backend/app/routes/notification_routes.py

import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from app.extensions import db
from app.models.user_model import User
from app.models.notification_model import Notification


# =====================================================
# BLUEPRINT
# =====================================================

notification_bp = Blueprint(
    "notifications",
    __name__,
    url_prefix="/api/notifications"
)


# =====================================================
# COMMON RESPONSE
# =====================================================

def response(success=True, message="", status=200, **data):
    result = {
        "success": success,
        "message": message
    }
    result.update(data)
    return jsonify(result), status


# =====================================================
# JWT USER ID RESOLVER
# =====================================================

def resolve_jwt_user_id():
    identity = get_jwt_identity()

    if identity is None:
        raise ValueError("JWT identity is missing. Please log in again.")

    identity = str(identity).strip()

    # Current token format: identity="123"
    if identity.isdigit():
        return int(identity)

    # Legacy token format:
    # <User bikashita02@gmail.com role=recruiter>
    match = re.search(
        r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}",
        identity
    )

    if match:
        email = match.group(0)

        user = User.query.filter(
            func.lower(User.email) == email.lower()
        ).first()

        if user:
            return user.id

    raise ValueError(
        "Invalid or outdated login token. Please log out and log in again."
    )


# =====================================================
# GET USER NOTIFICATIONS
# GET /api/notifications
# =====================================================

@notification_bp.route("", methods=["GET"])
@jwt_required()
def get_notifications():
    try:
        user_id = resolve_jwt_user_id()

        limit = request.args.get("limit", default=20, type=int)
        limit = max(1, min(limit or 20, 100))

        notifications = Notification.query.filter_by(
            user_id=user_id
        ).order_by(
            Notification.is_read.asc(),
            Notification.created_at.desc()
        ).limit(limit).all()

        unread_count = Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).count()

        return jsonify({
            "success": True,
            "unread_count": unread_count,
            "notifications": [
                notification.to_dict()
                for notification in notifications
            ]
        }), 200

    except ValueError as error:
        return response(False, str(error), 401)

    except Exception:
        db.session.rollback()
        return response(
            False,
            "Unable to load notifications.",
            500
        )


# =====================================================
# GET UNREAD COUNT
# GET /api/notifications/unread-count
# =====================================================

@notification_bp.route("/unread-count", methods=["GET"])
@jwt_required()
def unread_count():
    try:
        user_id = resolve_jwt_user_id()

        count = Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).count()

        return jsonify({
            "success": True,
            "unread_count": count
        }), 200

    except ValueError as error:
        return response(False, str(error), 401)

    except Exception:
        db.session.rollback()
        return response(
            False,
            "Unable to retrieve unread notification count.",
            500
        )


# =====================================================
# MARK SINGLE NOTIFICATION AS READ
# PUT /api/notifications/<id>/read
# =====================================================

@notification_bp.route("/<int:id>/read", methods=["PUT"])
@jwt_required()
def mark_read(id):
    try:
        user_id = resolve_jwt_user_id()

        notification = Notification.query.filter_by(
            id=id,
            user_id=user_id
        ).first()

        if not notification:
            return response(
                False,
                "Notification not found.",
                404
            )

        notification.is_read = True
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Notification marked as read.",
            "notification": notification.to_dict()
        }), 200

    except ValueError as error:
        db.session.rollback()
        return response(False, str(error), 401)

    except Exception:
        db.session.rollback()
        return response(
            False,
            "Unable to mark notification as read.",
            500
        )


# =====================================================
# MARK ALL NOTIFICATIONS AS READ
# PUT /api/notifications/read-all
# =====================================================

@notification_bp.route("/read-all", methods=["PUT"])
@jwt_required()
def mark_all_read():
    try:
        user_id = resolve_jwt_user_id()

        updated = Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).update(
            {"is_read": True},
            synchronize_session=False
        )

        db.session.commit()

        return jsonify({
            "success": True,
            "updated": updated,
            "message": "All notifications marked as read."
        }), 200

    except ValueError as error:
        db.session.rollback()
        return response(False, str(error), 401)

    except Exception:
        db.session.rollback()
        return response(
            False,
            "Unable to mark all notifications as read.",
            500
        )


# =====================================================
# DELETE NOTIFICATION
# DELETE /api/notifications/<id>
# =====================================================

@notification_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_notification(id):
    try:
        user_id = resolve_jwt_user_id()

        notification = Notification.query.filter_by(
            id=id,
            user_id=user_id
        ).first()

        if not notification:
            return response(
                False,
                "Notification not found.",
                404
            )

        db.session.delete(notification)
        db.session.commit()

        return response(
            True,
            "Notification deleted."
        )

    except ValueError as error:
        db.session.rollback()
        return response(False, str(error), 401)

    except Exception:
        db.session.rollback()
        return response(
            False,
            "Unable to delete notification.",
            500
        )