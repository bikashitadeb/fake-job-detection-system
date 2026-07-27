from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager


db = SQLAlchemy()

migrate = Migrate()

bcrypt = Bcrypt()

jwt = JWTManager()



def init_extensions(app):

    db.init_app(app)

    migrate.init_app(app, db)

    bcrypt.init_app(app)

    jwt.init_app(app)


    with app.app_context():

        from app.models.user_model import User
        from app.models.job_model import Job
        from app.models.application_model import Application
        from app.models.verification_model import Verification
        from app.models.flag_log_model import FlagLog

        db.create_all()