from datetime import datetime

from app.extensions import db


class Verification(db.Model):

    __tablename__ = "verifications"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    job_id = db.Column(
        db.Integer,
        db.ForeignKey("jobs.id"),
        nullable=False
    )

    website_verified = db.Column(
        db.Boolean,
        default=False
    )

    email_verified = db.Column(
        db.Boolean,
        default=False
    )

    linkedin_verified = db.Column(
        db.Boolean,
        default=False
    )

    company_score = db.Column(
        db.Float,
        default=0
    )

    recruiter_score = db.Column(
        db.Float,
        default=0
    )

    overall_score = db.Column(
        db.Float,
        default=0
    )

    status = db.Column(
        db.String(50),
        default="Needs Review"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


    def to_dict(self):

        return {
            "id": self.id,
            "job_id": self.job_id,
            "website_verified": self.website_verified,
            "email_verified": self.email_verified,
            "linkedin_verified": self.linkedin_verified,
            "company_score": self.company_score,
            "recruiter_score": self.recruiter_score,
            "overall_score": self.overall_score,
            "status": self.status,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }