from datetime import datetime

from app.extensions import db



class Flag(db.Model):

    __tablename__ = "flags"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    job_id = db.Column(
        db.Integer,
        db.ForeignKey("jobs.id"),
        nullable=False
    )


    reported_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )


    reason = db.Column(
        db.Text,
        nullable=False
    )


    status = db.Column(
        db.String(50),
        default="Pending"
    )
    # Pending
    # Reviewed
    # Resolved



    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )



    def to_dict(self):

        return {

            "id": self.id,

            "job_id": self.job_id,

            "reported_by": self.reported_by,

            "reason": self.reason,

            "status": self.status,

            "created_at":
                self.created_at.isoformat()
                if self.created_at
                else None
        }