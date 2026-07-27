from datetime import datetime

from app.extensions import db


class Prediction(db.Model):

    __tablename__ = "predictions"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    job_id = db.Column(
        db.Integer,
        db.ForeignKey("jobs.id"),
        nullable=False
    )


    ml_label = db.Column(
        db.String(20),
        nullable=False
    )


    ml_confidence = db.Column(
        db.Float,
        nullable=False
    )


    rule_score = db.Column(
        db.Float,
        default=0
    )


    trust_score = db.Column(
        db.Float,
        default=0
    )


    risk_level = db.Column(
        db.String(50)
    )


    final_verdict = db.Column(
        db.String(50)
    )


    explanation = db.Column(
        db.JSON
    )


    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )



    def to_dict(self):

        return {

            "id": self.id,

            "job_id": self.job_id,

            "ml_label": self.ml_label,

            "ml_confidence": self.ml_confidence,

            "rule_score": self.rule_score,

            "trust_score": self.trust_score,

            "risk_level": self.risk_level,

            "final_verdict": self.final_verdict,

            "explanation": self.explanation,

            "created_at":
                self.created_at.isoformat()
                if self.created_at
                else None
        }