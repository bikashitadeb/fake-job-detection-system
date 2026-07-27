from datetime import datetime, timezone
from app.extensions import db


class FlagLog(db.Model):
    """Audit trail of every time a job gets flagged, by system (ML) or a user/admin."""

    __tablename__ = "flag_logs"

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    flagged_by = db.Column(db.String(20), nullable=False, default="system")  # system | user | admin
    flagged_by_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    reason = db.Column(db.Text, nullable=False)
    fake_probability = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "job_id": self.job_id,
            "flagged_by": self.flagged_by,
            "flagged_by_user_id": self.flagged_by_user_id,
            "reason": self.reason,
            "fake_probability": self.fake_probability,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<FlagLog job={self.job_id} by={self.flagged_by}>"