from datetime import datetime

from app.extensions import db


class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)

    jti = db.Column(db.String(255), unique=True, nullable=False)

    token_type = db.Column(db.String(20), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "jti": self.jti,
            "token_type": self.token_type,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }