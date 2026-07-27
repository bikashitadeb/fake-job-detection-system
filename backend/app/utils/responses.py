from flask import jsonify


def success_response(message, data=None, meta=None, status_code=200):
    response = {
        "success": True,
        "message": message,
        "data": data,
    }

    if meta is not None:
        response["meta"] = meta

    return jsonify(response), status_code


def error_response(message, errors=None, status_code=400):
    response = {
        "success": False,
        "message": message,
        "errors": errors,
    }

    return jsonify(response), status_code