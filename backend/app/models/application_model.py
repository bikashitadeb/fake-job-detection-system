from datetime import datetime

from app.extensions import db



class Application(db.Model):


    __tablename__ = "applications"



    id = db.Column(

        db.Integer,

        primary_key=True

    )



    job_id = db.Column(

        db.Integer,

        db.ForeignKey("jobs.id"),

        nullable=False

    )



    # Employee/User who applied

    jobseeker_id = db.Column(

        db.Integer,

        db.ForeignKey("users.id"),

        nullable=False

    )



    cover_letter = db.Column(

        db.Text,

        nullable=False,

        default=""

    )



    resume_url = db.Column(

        db.String(300),

        nullable=True

    )



    status = db.Column(

        db.String(20),

        nullable=False,

        default="pending"

    )



    applied_at = db.Column(

        db.DateTime,

        default=datetime.utcnow

    )



    updated_at = db.Column(

        db.DateTime,

        default=datetime.utcnow,

        onupdate=datetime.utcnow

    )






    # ==========================
    # RELATIONSHIPS
    # ==========================


    user = db.relationship(

        "User",

        back_populates="applications"

    )



    job = db.relationship(

        "Job",

        back_populates="applications"

    )






    def to_dict(self):


        return {


            "id": self.id,


            "job_id": self.job_id,


            "user_id": self.jobseeker_id,


            "status": self.status,


            "cover_letter": self.cover_letter,


            "resume_url": self.resume_url,


            "applied_at":

                self.applied_at.isoformat()

                if self.applied_at

                else None


        }