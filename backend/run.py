# run.py


import os

from app import create_app


from dotenv import load_dotenv


import logging





# =====================================================
# LOAD ENVIRONMENT VARIABLES
# =====================================================


load_dotenv()






# =====================================================
# CREATE APPLICATION
# =====================================================


app = create_app()






# =====================================================
# LOGGING CONFIGURATION
# =====================================================


logging.basicConfig(

    level=logging.INFO,

    format=(

        "%(asctime)s | "

        "%(levelname)s | "

        "%(message)s"

    )

)



logger = logging.getLogger(__name__)









# =====================================================
# SERVER CONFIGURATION
# =====================================================


HOST = os.getenv(

    "FLASK_HOST",

    "0.0.0.0"

)



PORT = int(

    os.getenv(

        "PORT",

        5000

    )

)



DEBUG = (

    os.getenv(

        "FLASK_DEBUG",

        "False"

    ).lower()

    ==

    "true"

)









# =====================================================
# APPLICATION START
# =====================================================


if __name__ == "__main__":


    try:


        logger.info(

            "Starting AI Fake Job Detection API..."

        )


        logger.info(

            f"Running on {HOST}:{PORT}"

        )



        app.run(

            host=HOST,

            port=PORT,

            debug=DEBUG

        )




    except Exception as error:


        logger.exception(

            "Application startup failed"

        )


        raise error