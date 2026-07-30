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




    # JWT location

    JWT_TOKEN_LOCATION = [

        "headers"

    ]




    JWT_HEADER_NAME = "Authorization"


    JWT_HEADER_TYPE = "Bearer"





    # Allow identity as string

    JWT_VERIFY_SUB = False





    # Token expiry


    JWT_ACCESS_TOKEN_EXPIRES = timedelta(

        hours=1

    )



    JWT_REFRESH_TOKEN_EXPIRES = timedelta(

        days=30

    )




    # Token decoding tolerance


    JWT_DECODE_LEEWAY = 10





    JWT_ERROR_MESSAGE_KEY = "msg"







    # ==========================
    # SECURITY
    # ==========================


    SESSION_COOKIE_SECURE = False


    REMEMBER_COOKIE_SECURE = False






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