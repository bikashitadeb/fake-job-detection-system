from datetime import datetime

from app.extensions import db



class Job(db.Model):

    __tablename__ = "jobs"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    title = db.Column(
        db.String(200),
        nullable=False
    )


    description = db.Column(
        db.Text,
        nullable=False
    )


    company = db.Column(
        db.String(150),
        nullable=False
    )


    location = db.Column(
        db.String(150),
        nullable=False
    )


    salary = db.Column(
        db.Float,
        nullable=True
    )


    recruiter_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )


    # AI Prediction Fields

    is_fake_predicted = db.Column(
        db.Boolean,
        default=False
    )


    fake_probability = db.Column(
        db.Float,
        default=0.0
    )


    trust_score = db.Column(
        db.Float,
        default=0.0
    )


    status = db.Column(
        db.String(50),
        default="pending"
    )


    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )



    # Relationships

    recruiter = db.relationship(
        "User",
        back_populates="jobs"
    )


    applications = db.relationship(
        "Application",
        back_populates="job",
        lazy=True,
        cascade="all, delete"
    )



    def to_dict(self):

        return {

            "id": self.id,

            "title": self.title,

            "description": self.description,

            "company": self.company,

            "location": self.location,

            "salary": self.salary,

            "recruiter_id": self.recruiter_id,


            "is_fake_predicted":
                self.is_fake_predicted,


            "fake_probability":
                self.fake_probability,


            "trust_score":
                self.trust_score,


            "status":
                self.status,


            "created_at":
                self.created_at.isoformat()
                if self.created_at else None,


            "updated_at":
                self.updated_at.isoformat()
                if self.updated_at else None

        }