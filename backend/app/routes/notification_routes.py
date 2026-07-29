from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.models.notification_model import Notification



notification_bp = Blueprint(

    "notifications",

    __name__,

    url_prefix="/api/notifications"

)





# =====================================
# GET USER NOTIFICATIONS
# =====================================

@notification_bp.route(

    "",

    methods=["GET"]

)

@jwt_required()

def get_notifications():


    user_id = int(

        get_jwt_identity()

    )



    notifications = Notification.query.filter_by(

        user_id=user_id

    ).order_by(

        Notification.created_at.desc()

    ).all()



    return jsonify({

        "notifications":[

            notification.to_dict()

            for notification in notifications

        ]

    }),200