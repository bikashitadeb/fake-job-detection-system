import os
from datetime import timedelta


try:
    from dotenv import load_dotenv

except Exception:

    def load_dotenv(*args, **kwargs):
        return False



load_dotenv()



class Config:


    # ==========================
    # APPLICATION
    # ==========================

    SECRET_KEY = os.getenv(

        "SECRET_KEY",

        "FakeJobDetectionSystemSecretKey2026"

    )



    # ==========================
    # DATABASE
    # ==========================

    SQLALCHEMY_DATABASE_URI = os.getenv(

        "DATABASE_URL",

        "mysql+pymysql://root:2709@localhost:3306/fake_job_detection_db"

    )


    SQLALCHEMY_TRACK_MODIFICATIONS = False



    # ==========================
    # JWT CONFIGURATION
    # ==========================

    JWT_SECRET_KEY = os.getenv(

        "JWT_SECRET_KEY",

        "FakeJobJWTSecretKey2026"

    )


    # Where JWT token is searched

    JWT_TOKEN_LOCATION = [

        "headers"

    ]


    # Header configuration

    JWT_HEADER_NAME = "Authorization"


    JWT_HEADER_TYPE = "Bearer"



    # Token expiry

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(

        hours=1

    )


    JWT_REFRESH_TOKEN_EXPIRES = timedelta(

        days=30

    )


    # Error messages

    JWT_ERROR_MESSAGE_KEY = "msg"



    # ==========================
    # PAGINATION
    # ==========================

    DEFAULT_PAGE_SIZE = 10


    MAX_PAGE_SIZE = 100



    # ==========================
    # LOGGING
    # ==========================

    LOG_LEVEL = "INFO"


    LOG_FILE = "logs/app.log"




def get_config():

    return Config