from datetime import datetime, timezone

from app.extensions import db





class FlagLog(db.Model):


    """
    Enterprise AI Fraud Detection Audit System


    Handles:

    - AI fake job detection
    - NLP fraud analysis
    - Employee reports
    - Recruiter reports
    - Admin investigations
    - ML feedback loop
    - Fraud analytics

    """



    __tablename__ = "flag_logs"









    # =====================================
    # PRIMARY KEY
    # =====================================


    id = db.Column(

        db.Integer,

        primary_key=True

    )









    # =====================================
    # TARGET REFERENCES
    # =====================================


    job_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "jobs.id",

            ondelete="CASCADE"

        ),

        nullable=False,

        index=True

    )





    company_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "companies.id",

            ondelete="SET NULL"

        ),

        nullable=True,

        index=True

    )









    # =====================================
    # USER TRACKING
    # =====================================


    reported_by_user_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id",

            ondelete="SET NULL"

        ),

        nullable=True,

        index=True

    )





    reviewed_by = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id",

            ondelete="SET NULL"

        ),

        nullable=True

    )









    # =====================================
    # SOURCE INFORMATION
    # =====================================


    source = db.Column(

        db.String(50),

        default="AI"

    )


    # AI
    # employee
    # recruiter
    # admin







    detection_type = db.Column(

        db.String(100),

        default="fake_job_detection"

    )









    # =====================================
    # AI MODEL OUTPUT
    # =====================================


    fake_probability = db.Column(

        db.Float,

        default=0

    )





    risk_score = db.Column(

        db.Float,

        default=0

    )





    confidence_score = db.Column(

        db.Float,

        default=0

    )





    prediction_label = db.Column(

        db.String(30),

        default="suspicious"

    )





    model_name = db.Column(

        db.String(100),

        default="LogisticRegression"

    )





    model_version = db.Column(

        db.String(50),

        default="v1"

    )









    # =====================================
    # NLP INTELLIGENCE
    # =====================================


    suspicious_keywords = db.Column(

        db.Text,

        nullable=True

    )





    keyword_count = db.Column(

        db.Integer,

        default=0

    )





    sentiment_score = db.Column(

        db.Float,

        default=0

    )





    ai_explanation = db.Column(

        db.Text,

        nullable=True

    )









    # =====================================
    # FRAUD CLASSIFICATION
    # =====================================


    fraud_category = db.Column(

        db.String(100),

        nullable=True

    )





    severity = db.Column(

        db.String(20),

        default="medium"

    )


    # low
    # medium
    # high
    # critical







    reason = db.Column(

        db.Text,

        nullable=False

    )









    # =====================================
    # EVIDENCE
    # =====================================


    evidence_text = db.Column(

        db.Text,

        nullable=True

    )





    evidence_url = db.Column(

        db.String(500),

        nullable=True

    )





    screenshot = db.Column(

        db.String(500),

        nullable=True

    )









    # =====================================
    # ADMIN REVIEW
    # =====================================


    status = db.Column(

        db.String(30),

        default="pending"

    )


    # pending
    # reviewing
    # verified_fake
    # verified_safe
    # rejected







    admin_comment = db.Column(

        db.Text,

        nullable=True

    )





    resolution = db.Column(

        db.Text,

        nullable=True

    )





    reviewed_at = db.Column(

        db.DateTime,

        nullable=True

    )









    # =====================================
    # ML FEEDBACK LOOP
    # =====================================


    used_for_training = db.Column(

        db.Boolean,

        default=False

    )





    training_label = db.Column(

        db.Integer,

        nullable=True

    )


    # 0 genuine
    # 1 fake







    is_false_positive = db.Column(

        db.Boolean,

        default=False

    )





    false_positive_reason = db.Column(

        db.Text,

        nullable=True

    )









    # =====================================
    # TIMESTAMPS
    # =====================================


    created_at = db.Column(

        db.DateTime,

        default=lambda:

        datetime.now(timezone.utc)

    )





    updated_at = db.Column(

        db.DateTime,

        default=lambda:

        datetime.now(timezone.utc),

        onupdate=lambda:

        datetime.now(timezone.utc)

    )









    # =====================================
    # RELATIONSHIPS
    # =====================================


    job = db.relationship(

        "Job",

        back_populates="flag_logs"

    )





    company = db.relationship(

        "Company",

        back_populates="flag_logs"

    )





    reporter = db.relationship(

        "User",

        foreign_keys=[reported_by_user_id],

        back_populates="reported_flags"

    )





    reviewer = db.relationship(

        "User",

        foreign_keys=[reviewed_by],

        back_populates="reviewed_flags"

    )









    # =====================================
    # BUSINESS METHODS
    # =====================================


    def resolve(self, admin_id, comment=None):


        self.status = "verified_fake"

        self.reviewed_by = admin_id

        self.admin_comment = comment

        self.reviewed_at = datetime.now(timezone.utc)








    def mark_safe(self, admin_id, comment=None):


        self.status = "verified_safe"

        self.reviewed_by = admin_id

        self.admin_comment = comment

        self.reviewed_at = datetime.now(timezone.utc)








    def reject(self, admin_id, comment=None):


        self.status = "rejected"

        self.reviewed_by = admin_id

        self.admin_comment = comment

        self.reviewed_at = datetime.now(timezone.utc)









    # =====================================
    # API SERIALIZER
    # =====================================


    def to_dict(self):


        return {


            "id": self.id,


            "job_id": self.job_id,


            "company_id": self.company_id,


            "reported_by":

            self.reported_by_user_id,



            "reviewed_by":

            self.reviewed_by,



            "source":

            self.source,



            "detection_type":

            self.detection_type,



            "fake_probability":

            self.fake_probability or 0,



            "risk_score":

            self.risk_score or 0,



            "confidence_score":

            self.confidence_score or 0,



            "prediction_label":

            self.prediction_label,



            "model_name":

            self.model_name,



            "model_version":

            self.model_version,



            "suspicious_keywords":

            self.suspicious_keywords,



            "keyword_count":

            self.keyword_count,



            "sentiment_score":

            self.sentiment_score,



            "ai_explanation":

            self.ai_explanation,



            "fraud_category":

            self.fraud_category,



            "severity":

            self.severity,



            "reason":

            self.reason,



            "status":

            self.status,



            "admin_comment":

            self.admin_comment,



            "resolution":

            self.resolution,



            "used_for_training":

            self.used_for_training,



            "training_label":

            self.training_label,



            "created_at":

            self.created_at.isoformat()

            if self.created_at

            else None,



            "updated_at":

            self.updated_at.isoformat()

            if self.updated_at

            else None

        }









    def __repr__(self):


        return (

            f"<FlagLog "

            f"job={self.job_id} "

            f"risk={self.risk_score}% "

            f"status={self.status}>"

        )