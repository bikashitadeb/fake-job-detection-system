from datetime import datetime

from app.extensions import db


class User(db.Model):

    __tablename__ = "users"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    name = db.Column(
        db.String(150),
        nullable=False
    )


    email = db.Column(
        db.String(150),
        unique=True,
        nullable=False
    )


    password_hash = db.Column(
        db.String(255),
        nullable=False
    )


    role = db.Column(
        db.String(50),
        nullable=False,
        default="jobseeker"
    )


    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


    # ==========================
    # RELATIONSHIPS
    # ==========================


    # Recruiter creates jobs

    jobs = db.relationship(
        "Job",
        back_populates="recruiter",
        lazy=True
    )


    # User applies for jobs

    applications = db.relationship(
        "Application",
        back_populates="user",
        lazy=True
    )


    # Recruiter profile

    recruiter_profile = db.relationship(
        "Recruiter",
        back_populates="user",
        uselist=False
    )



    def to_dict(self):

        return {

            "id": self.id,

            "name": self.name,

            "email": self.email,

            "role": self.role

        }