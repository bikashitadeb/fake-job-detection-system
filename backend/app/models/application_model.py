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


    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )


    status = db.Column(
        db.String(50),
        default="Applied"
    )


    applied_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )



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

            "user_id": self.user_id,

            "status": self.status,

            "applied_at":
            self.applied_at.isoformat()
            if self.applied_at else None

        }