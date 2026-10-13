from datetime import datetime, timezone

from app.extensions import db



class Job(db.Model):


    """
    Enterprise AI Job Intelligence Model

    Features:
    - Job posting
    - AI fake job detection
    - NLP analysis
    - LinkedIn verification
    - Fraud scoring
    - Candidate applications
    - Analytics
    """


    __tablename__ = "jobs"



    # =====================================
    # BASIC INFORMATION
    # =====================================


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



    location = db.Column(

        db.String(150),

        nullable=False

    )



    salary = db.Column(

        db.Float,

        nullable=True

    )



    requirements = db.Column(

        db.Text,

        nullable=True

    )





    # =====================================
    # COMPANY
    # =====================================


    company_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "companies.id",

            ondelete="SET NULL"

        ),

        nullable=True

    )




    company_name = db.Column(

        db.String(200),

        nullable=True

    )





    # =====================================
    # RECRUITER
    # =====================================


    recruiter_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id",

            ondelete="CASCADE"

        ),

        nullable=False

    )





    # =====================================
    # AI FRAUD DETECTION
    # =====================================


    is_fake_predicted = db.Column(

        db.Boolean,

        default=False

    )



    fake_probability = db.Column(

        db.Float,

        default=0

    )



    trust_score = db.Column(

        db.Float,

        default=0

    )



    ai_confidence = db.Column(

        db.Float,

        default=0

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


    risk_score = db.Column(

        db.Float,

        default=0

    )



    risk_level = db.Column(

        db.String(20),

        default="LOW"

    )



    ai_warnings = db.Column(

        db.Text,

        nullable=True

    )



    ai_explanation = db.Column(

        db.Text,

        nullable=True

    )



    suspicious_keywords = db.Column(

        db.Text,

        nullable=True

    )



    sentiment_score = db.Column(

        db.Float,

        default=0

    )



    keyword_count = db.Column(

        db.Integer,

        default=0

    )
        # =====================================
    # COMPANY VERIFICATION
    # =====================================


    linkedin_verified = db.Column(

        db.Boolean,

        default=False

    )



    linkedin_url = db.Column(

        db.String(300),

        nullable=True

    )



    company_verified = db.Column(

        db.Boolean,

        default=False

    )



    company_reputation_score = db.Column(

        db.Float,

        default=0

    )





    # =====================================
    # ADVANCED AI
    # =====================================


    salary_anomaly = db.Column(

        db.Boolean,

        default=False

    )



    duplicate_job_detected = db.Column(

        db.Boolean,

        default=False

    )



    semantic_similarity_score = db.Column(

        db.Float,

        default=0

    )



    semantic_embedding = db.Column(

        db.Text,

        nullable=True

    )



    job_quality_score = db.Column(

        db.Float,

        default=0

    )





    # =====================================
    # ADMIN REVIEW
    # =====================================


    verification_status = db.Column(

        db.String(30),

        default="pending"

    )



    admin_notes = db.Column(

        db.Text,

        nullable=True

    )



    is_flagged = db.Column(

        db.Boolean,

        default=False

    )



    flag_reason = db.Column(

        db.Text,

        nullable=True

    )





    # =====================================
    # ANALYTICS
    # =====================================


    views_count = db.Column(

        db.Integer,

        default=0

    )



    application_count = db.Column(

        db.Integer,

        default=0

    )



    is_active = db.Column(

        db.Boolean,

        default=True

    )





    # =====================================
    # STATUS
    # =====================================


    status = db.Column(

        db.String(30),

        default="pending"

    )





    # =====================================
    # TIMESTAMP
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


    recruiter = db.relationship(

        "User",

        back_populates="jobs",

        foreign_keys=[recruiter_id]

    )




    company = db.relationship(

        "Company",

        back_populates="jobs",

        foreign_keys=[company_id]

    )




    applications = db.relationship(

        "Application",

        back_populates="job",

        cascade="all, delete-orphan",

        lazy=True

    )




    # ================================
    # FIX FOR FLAGLOG MAPPER ERROR
    # ================================


    flag_logs = db.relationship(

        "FlagLog",

        back_populates="job",

        cascade="all, delete-orphan",

        lazy=True

    )
        # =====================================
    # JSON RESPONSE
    # =====================================


    def to_dict(self):


        return {


            "id":

            self.id,



            "title":

            self.title,



            "description":

            self.description,



            "location":

            self.location,



            "salary":

            self.salary,



            "requirements":

            self.requirements,





            # COMPANY


            "company_id":

            self.company_id,



            "company_name":

            self.company.company_name

            if self.company

            else self.company_name,





            # AI DETECTION


            "is_fake_predicted":

            self.is_fake_predicted,



            "fake_probability":

            self.fake_probability or 0,



            "trust_score":

            self.trust_score or 0,



            "ai_confidence":

            self.ai_confidence or 0,



            "risk_score":

            self.risk_score or 0,



            "risk_level":

            self.risk_level,



            "ai_warnings":

            self.ai_warnings,



            "ai_explanation":

            self.ai_explanation,



            "suspicious_keywords":

            self.suspicious_keywords,





            # COMPANY VERIFICATION


            "linkedin_verified":

            self.linkedin_verified,



            "linkedin_url":

            self.linkedin_url,



            "company_verified":

            self.company_verified,



            "company_reputation_score":

            self.company_reputation_score,





            # ADVANCED AI


            "salary_anomaly":

            self.salary_anomaly,



            "duplicate_job_detected":

            self.duplicate_job_detected,



            "semantic_similarity_score":

            self.semantic_similarity_score,



            "job_quality_score":

            self.job_quality_score or 0,





            # ADMIN REVIEW


            "verification_status":

            self.verification_status,



            "admin_notes":

            self.admin_notes,



            "is_flagged":

            self.is_flagged,



            "flag_reason":

            self.flag_reason,





            # ANALYTICS


            "views_count":

            self.views_count,



            "application_count":

            len(self.applications)

            if self.applications

            else self.application_count,



            "applications_count":

            len(self.applications)

            if self.applications

            else 0,





            # STATUS


            "status":

            self.status,



            "recruiter_id":

            self.recruiter_id,





            # TIMESTAMP


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

            f"<Job "

            f"{self.title} "

            f"risk={self.risk_score}>"

        )