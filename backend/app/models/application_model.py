from datetime import datetime

from app.extensions import db




class Application(db.Model):


    __tablename__ = "applications"




    id = db.Column(

        db.Integer,

        primary_key=True

    )





    user_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id"

        ),

        nullable=False

    )





    job_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "jobs.id"

        ),

        nullable=False

    )





    status = db.Column(

        db.String(50),

        default="pending"

    )





    created_at = db.Column(

        db.DateTime,

        default=datetime.utcnow

    )






    # ==========================
    # RELATIONSHIPS
    # ==========================


    user = db.relationship(

        "User",

        backref="applications"

    )





    job = db.relationship(

        "Job",

        backref="applications"

    )






    def to_dict(self):


        return {


            "id": self.id,


            "user_id": self.user_id,


            "job_id": self.job_id,


            "status": self.status,


            "created_at": self.created_at

        }