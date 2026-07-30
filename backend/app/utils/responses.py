# app/utils/responses.py


from flask import jsonify, request


from datetime import datetime, timezone


import uuid






# =====================================================
# COMMON HELPERS
# =====================================================


def get_timestamp():

    return datetime.now(

        timezone.utc

    ).isoformat()







def get_request_id():

    """
    Generates unique request tracking ID.

    Useful for:
    - debugging
    - logs
    - production monitoring

    """

    return request.headers.get(

        "X-Request-ID"

    ) or str(uuid.uuid4())









# =====================================================
# SUCCESS RESPONSE
# =====================================================


def success_response(

        message,

        data=None,

        meta=None,

        status_code=200

):


    """
    Enterprise Success Response

    Example:

    {
        success:true,
        message:"",
        data:{},
        meta:{},
        api_version:"v1"
    }

    """



    response = {


        "success": True,


        "message": message,


        "data": data,


        "meta": meta or {},


        "api_version": "v1",


        "request_id":

        get_request_id(),


        "timestamp":

        get_timestamp()

    }




    return jsonify(response), status_code







# =====================================================
# ERROR RESPONSE
# =====================================================


def error_response(

        message,

        errors=None,

        status_code=400,

        error_code="API_ERROR"

):


    """
    Enterprise Error Response

    """



    response = {


        "success": False,


        "error": {


            "code":

            error_code,



            "message":

            message,



            "details":

            errors or {}

        },



        "api_version":

        "v1",



        "request_id":

        get_request_id(),



        "timestamp":

        get_timestamp()

    }




    return jsonify(response), status_code











# =====================================================
# PAGINATION RESPONSE
# =====================================================


def paginated_response(

        message,

        items,

        page,

        per_page,

        total,

        status_code=200

):


    """
    Used for:

    - Jobs
    - Applications
    - Users
    - Notifications
    - Admin tables

    """



    total_pages = (

        (total + per_page - 1)

        //

        per_page

    )




    response = {



        "success": True,



        "message": message,



        "data": items,



        "pagination": {


            "current_page":

            page,



            "page_size":

            per_page,



            "total_records":

            total,



            "total_pages":

            total_pages,



            "has_next":

            page < total_pages,



            "has_previous":

            page > 1



        },



        "api_version":

        "v1",



        "request_id":

        get_request_id(),



        "timestamp":

        get_timestamp()



    }





    return jsonify(response), status_code







# =====================================================
# CREATED RESPONSE
# =====================================================


def created_response(

        message,

        data=None

):


    return success_response(

        message,

        data,

        status_code=201

    )









# =====================================================
# NO CONTENT RESPONSE
# =====================================================


def no_content_response():

    return "",204