from flask import jsonify


# =====================================
# ERROR HANDLER REGISTRATION
# =====================================


def register_error_handlers(app):


    @app.errorhandler(400)
    def bad_request(error):

        return jsonify({

            "success": False,

            "message": "Bad request",

            "error": str(error)

        }),400




    @app.errorhandler(401)
    def unauthorized(error):

        return jsonify({

            "success":False,

            "message":"Unauthorized access",

            "error":str(error)

        }),401





    @app.errorhandler(403)
    def forbidden(error):

        return jsonify({

            "success":False,

            "message":"Forbidden",

            "error":str(error)

        }),403





    @app.errorhandler(404)
    def not_found(error):

        return jsonify({

            "success":False,

            "message":"Resource not found",

            "error":str(error)

        }),404





    @app.errorhandler(422)
    def validation_error(error):

        return jsonify({

            "success":False,

            "message":"Validation error",

            "error":str(error)

        }),422






    @app.errorhandler(500)
    def internal_error(error):

        return jsonify({

            "success":False,

            "message":"Internal server error",

            "error":str(error)

        }),500