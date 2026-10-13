# app/models/prediction_model.py


from datetime import datetime, timezone


from app.extensions import db







class Prediction(db.Model):


    """
    AI Job Fraud Prediction Model


    Stores:

    - ML prediction results
    - NLP risk analysis
    - Trust calculation
    - AI explanation
    - Admin review feedback
    - Model version tracking

    """



    __tablename__ = "predictions"






    # =====================================================
    # PRIMARY KEY
    # =====================================================


    id = db.Column(

        db.Integer,

        primary_key=True

    )







    # =====================================================
    # JOB CONNECTION
    # =====================================================


    job_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "jobs.id"

        ),

        nullable=False

    )








    # =====================================================
    # MACHINE LEARNING OUTPUT
    # =====================================================


    ml_label = db.Column(

        db.String(30),

        nullable=False,

        default="unknown"

    )


    # fake / genuine




    ml_confidence = db.Column(

        db.Float,

        default=0

    )



    model_name = db.Column(

        db.String(100),

        default="LogisticRegression"

    )



    model_version = db.Column(

        db.String(50),

        default="v1.0"

    )









    # =====================================================
    # RULE BASED FRAUD ANALYSIS
    # =====================================================


    rule_score = db.Column(

        db.Float,

        default=0

    )



    suspicious_keywords = db.Column(

        db.JSON,

        nullable=True

    )



    keyword_count = db.Column(

        db.Integer,

        default=0

    )






    # =====================================================
    # FINAL TRUST SYSTEM
    # =====================================================


    trust_score = db.Column(

        db.Float,

        default=0

    )



    risk_level = db.Column(

        db.String(30),

        default="LOW"

    )


    # LOW
    # MEDIUM
    # HIGH
    # CRITICAL





    final_verdict = db.Column(

        db.String(50),

        default="pending"

    )


    # safe
    # suspicious
    # fake





    # =====================================================
    # AI EXPLANATION
    # =====================================================


    explanation = db.Column(

        db.JSON,

        nullable=True

    )





    # Example:

    # {
    #   "reason":"Salary anomaly detected",
    #   "keywords":["pay fee"],
    #   "recommendation":"Avoid applying"
    # }





    # =====================================================
    # ADMIN REVIEW
    # =====================================================


    reviewed = db.Column(

        db.Boolean,

        default=False

    )


    admin_comment = db.Column(

        db.Text,

        nullable=True

    )







    # =====================================================
    # TIMESTAMPS
    # =====================================================


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








    # =====================================================
    # RELATIONSHIP
    # =====================================================


    job = db.relationship(

        "Job",

        backref=db.backref(

            "predictions",

            lazy=True

        )

    )









    # =====================================================
    # SERIALIZER
    # =====================================================


    def to_dict(self):


        return {



            "id":

            self.id,



            "job_id":

            self.job_id,



            "ml_label":

            self.ml_label,



            "ml_confidence":

            self.ml_confidence or 0,



            "model_name":

            self.model_name,



            "model_version":

            self.model_version,



            "rule_score":

            self.rule_score or 0,



            "suspicious_keywords":

            self.suspicious_keywords,



            "keyword_count":

            self.keyword_count,



            "trust_score":

            self.trust_score or 0,



            "risk_level":

            self.risk_level,



            "final_verdict":

            self.final_verdict,



            "explanation":

            self.explanation,



            "reviewed":

            self.reviewed,



            "admin_comment":

            self.admin_comment,



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

            f"<Prediction "

            f"job={self.job_id} "

            f"risk={self.risk_level} "

            f"trust={self.trust_score}%>"

        )