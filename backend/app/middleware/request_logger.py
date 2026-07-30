# app/middleware/request_logger.py


import time
import uuid
import logging


from flask import (
    request,
    g
)



logger = logging.getLogger(__name__)







# =====================================================
# REQUEST LOGGING MIDDLEWARE
# =====================================================


def register_request_logging(app):


    @app.before_request
    def start_request_timer():



        # Unique request ID


        g.request_id = str(

            uuid.uuid4()

        )



        # Start timer


        g.start_time = time.time()







        logger.info(

            "REQUEST START | ID=%s | METHOD=%s | PATH=%s | IP=%s",

            g.request_id,

            request.method,

            request.path,

            request.remote_addr

        )









    @app.after_request
    def log_request(response):


        try:



            duration = round(

                (

                    time.time()

                    -

                    getattr(

                        g,

                        "start_time",

                        time.time()

                    )

                )

                *

                1000,

                2

            )







            # Attach request ID to response


            response.headers[

                "X-Request-ID"

            ] = getattr(

                g,

                "request_id",

                "unknown"

            )








            logger.info(


                "REQUEST COMPLETE | ID=%s | %s %s | STATUS=%s | TIME=%sms",

                getattr(

                    g,

                    "request_id",

                    "unknown"

                ),



                request.method,



                request.path,



                response.status_code,



                duration


            )







        except Exception as e:



            logger.error(

                "REQUEST LOGGING ERROR: %s",

                e

            )







        return response










    @app.teardown_request
    def log_exception(error):


        if error:


            logger.exception(

                "REQUEST FAILED | ID=%s | ERROR=%s",

                getattr(

                    g,

                    "request_id",

                    "unknown"

                ),

                error

            )