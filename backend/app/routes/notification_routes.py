# app/routes/notification_routes.py


from flask import Blueprint, jsonify, request


from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)


from app.extensions import db


from app.models.notification_model import Notification







notification_bp = Blueprint(

    "notifications",

    __name__,

    url_prefix="/api/notifications"

)









# =====================================================
# GET USER NOTIFICATIONS
# GET /api/notifications
# =====================================================


@notification_bp.route(

    "",

    methods=["GET"]

)

@jwt_required()

def get_notifications():


    try:


        user_id = int(

            get_jwt_identity()

        )



        limit = request.args.get(

            "limit",

            20,

            type=int

        )



        notifications = Notification.query.filter_by(

            user_id=user_id

        ).order_by(


            Notification.is_read.asc(),


            Notification.created_at.desc()


        ).limit(

            limit

        ).all()





        unread_count = Notification.query.filter_by(

            user_id=user_id,

            is_read=False

        ).count()






        return jsonify({



            "success": True,



            "unread_count": unread_count,



            "notifications":[


                notification.to_dict()

                for notification in notifications


            ]



        }),200







    except Exception as e:



        return jsonify({



            "success":False,


            "message":str(e)



        }),500











# =====================================================
# GET UNREAD COUNT
# GET /api/notifications/unread-count
# =====================================================


@notification_bp.route(

    "/unread-count",

    methods=["GET"]

)

@jwt_required()

def unread_count():


    try:


        user_id = int(

            get_jwt_identity()

        )



        count = Notification.query.filter_by(

            user_id=user_id,

            is_read=False

        ).count()






        return jsonify({



            "success":True,


            "unread_count":count



        }),200






    except Exception as e:



        return jsonify({


            "success":False,


            "message":str(e)


        }),500











# =====================================================
# MARK SINGLE NOTIFICATION AS READ
# PUT /api/notifications/<id>/read
# =====================================================


@notification_bp.route(

    "/<int:id>/read",

    methods=["PUT"]

)

@jwt_required()

def mark_read(id):


    try:


        user_id=int(

            get_jwt_identity()

        )





        notification = Notification.query.filter_by(


            id=id,


            user_id=user_id


        ).first()






        if not notification:


            return jsonify({


                "success":False,


                "message":

                "Notification not found"



            }),404







        notification.is_read=True


        db.session.commit()






        return jsonify({


            "success":True,


            "message":

            "Notification marked as read",



            "notification":

            notification.to_dict()



        }),200







    except Exception as e:



        db.session.rollback()



        return jsonify({


            "success":False,


            "message":str(e)



        }),500











# =====================================================
# MARK ALL NOTIFICATIONS AS READ
# PUT /api/notifications/read-all
# =====================================================


@notification_bp.route(

    "/read-all",

    methods=["PUT"]

)

@jwt_required()

def mark_all_read():


    try:



        user_id=int(

            get_jwt_identity()

        )




        updated = Notification.query.filter_by(

            user_id=user_id,

            is_read=False

        ).update(


            {

                "is_read":True

            }

        )




        db.session.commit()






        return jsonify({



            "success":True,


            "updated":

            updated,


            "message":

            "All notifications marked as read"



        }),200







    except Exception as e:



        db.session.rollback()



        return jsonify({



            "success":False,


            "message":str(e)



        }),500











# =====================================================
# DELETE NOTIFICATION
# DELETE /api/notifications/<id>
# =====================================================


@notification_bp.route(

    "/<int:id>",

    methods=["DELETE"]

)

@jwt_required()

def delete_notification(id):


    try:



        user_id=int(

            get_jwt_identity()

        )





        notification = Notification.query.filter_by(

            id=id,

            user_id=user_id

        ).first()






        if not notification:


            return jsonify({



                "success":False,


                "message":

                "Notification not found"



            }),404







        db.session.delete(

            notification

        )


        db.session.commit()






        return jsonify({



            "success":True,


            "message":

            "Notification deleted"



        }),200








    except Exception as e:



        db.session.rollback()



        return jsonify({



            "success":False,


            "message":str(e)



        }),500