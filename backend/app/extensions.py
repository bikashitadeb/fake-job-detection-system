from flask_sqlalchemy import SQLAlchemy

from flask_jwt_extended import JWTManager

from flask_cors import CORS

from flask_bcrypt import Bcrypt



# Database

db = SQLAlchemy()



# JWT Authentication

jwt = JWTManager()



# Cross Origin

cors = CORS()



# Password Hashing

bcrypt = Bcrypt()