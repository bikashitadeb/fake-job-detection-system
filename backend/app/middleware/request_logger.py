import time
from flask import request, g  # type: ignore[import]


def register_request_logging(app):
    @app.before_request
    def start_timer():
        g.start_time = time.time()

    @app.after_request
    def log_request(response):
        duration_ms = round(
            (time.time() - getattr(g, "start_time", time.time())) * 1000,
            2,
        )

        app.logger.info(
            "[%s] %s %s -> %s (%sms)",
            request.remote_addr,
            request.method,
            request.path,
            response.status_code,
            duration_ms,
        )

        return response