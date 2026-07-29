from datetime import datetime

from app.extensions import db



class Job(db.Model):


    __tablename__ = "jobs"



    # ==========================
    # BASIC DETAILS
    # ==========================


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


    requirements = db.Column(
        db.Text,
        nullable=True
    )


    recruiter_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "users.id"
        ),
        nullable=False
    )





    # ==========================
    # AI FAKE JOB DETECTION
    # ==========================


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





    # ==========================
    # NLP RISK ANALYSIS
    # ==========================


    risk_score = db.Column(
        db.Float,
        default=0
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





    # ==========================
    # COMPANY VERIFICATION
    # ==========================


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





    # ==========================
    # ADVANCED AI FEATURES
    # ==========================


    salary_anomaly = db.Column(
        db.Boolean,
        default=False
    )


    semantic_embedding = db.Column(
        db.Text,
        nullable=True
    )





    # ==========================
    # JOB STATUS
    # ==========================


    status = db.Column(
        db.String(20),
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







    # ==========================
    # RELATIONSHIPS
    # ==========================


    recruiter = db.relationship(

        "User",

        back_populates="jobs"

    )


    applications = db.relationship(

        "Application",

        back_populates="job",

        cascade="all, delete-orphan"

    )







    # ==========================
    # JSON RESPONSE
    # ==========================


    def to_dict(self):


        return {


            "id":
            self.id,


            "title":
            self.title,


            "description":
            self.description,


            "company_name":
            self.company,


            "location":
            self.location,


            "salary":
            self.salary,


            "requirements":
            self.requirements,



            # ==================
            # ML RESULTS
            # ==================


            "is_fake_predicted":
            self.is_fake_predicted,


            "fake_probability":
            self.fake_probability or 0,


            "trust_score":
            self.trust_score or 0,





            # ==================
            # NLP RESULTS
            # ==================


            "risk_score":
            self.risk_score or 0,


            "ai_warnings":
            self.ai_warnings,


            "ai_explanation":
            self.ai_explanation,


            "suspicious_keywords":
            self.suspicious_keywords,





            # ==================
            # COMPANY RESULTS
            # ==================


            "linkedin_verified":
            self.linkedin_verified,


            "linkedin_url":
            self.linkedin_url,


            "company_verified":
            self.company_verified,


            "company_reputation_score":
            self.company_reputation_score or 0,





            # ==================
            # ADVANCED AI
            # ==================


            "salary_anomaly":
            self.salary_anomaly,


            "semantic_embedding":
            self.semantic_embedding,





            # ==================
            # STATUS
            # ==================


            "status":
            self.status,


            "recruiter_id":
            self.recruiter_id,



            "created_at":

            self.created_at.isoformat()

            if self.created_at

            else None,



            "updated_at":

            self.updated_at.isoformat()

            if self.updated_at

            else None

        }