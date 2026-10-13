from datetime import datetime, timezone

from app.extensions import db





class Company(db.Model):

    """
    Enterprise AI Company Intelligence Model

    Handles:

    - Company profile
    - Recruiter ownership
    - LinkedIn verification
    - AI reputation scoring
    - Fraud detection
    - Job management
    - Admin investigation
    """



    __tablename__ = "companies"



    # =====================================
    # INDEXES
    # =====================================


    __table_args__ = (

        db.Index(
            "idx_company_domain",
            "company_domain"
        ),

        db.Index(
            "idx_company_status",
            "verification_status"
        ),

    )








    # =====================================
    # BASIC INFORMATION
    # =====================================


    id = db.Column(

        db.Integer,

        primary_key=True

    )



    company_name = db.Column(

        db.String(200),

        nullable=False

    )



    company_domain = db.Column(

        db.String(150),

        nullable=True,

        unique=True

    )



    website_url = db.Column(

        db.String(255),

        nullable=True

    )



    description = db.Column(

        db.Text,

        nullable=True

    )



    industry = db.Column(

        db.String(100),

        nullable=True

    )



    company_size = db.Column(

        db.String(50),

        nullable=True

    )



    headquarters_location = db.Column(

        db.String(200),

        nullable=True

    )



    registration_number = db.Column(

        db.String(100),

        nullable=True

    )









    # =====================================
    # VERIFICATION SYSTEM
    # =====================================


    verification_status = db.Column(

        db.String(30),

        default="pending"

    )


    # pending
    # verified
    # rejected
    # blacklisted





    verified_by_admin = db.Column(

        db.Boolean,

        default=False

    )



    verification_date = db.Column(

        db.DateTime,

        nullable=True

    )








    # =====================================
    # LINKEDIN VERIFICATION
    # =====================================


    linkedin_url = db.Column(

        db.String(300),

        nullable=True

    )



    linkedin_verified = db.Column(

        db.Boolean,

        default=False

    )



    linkedin_employee_count = db.Column(

        db.Integer,

        default=0

    )








    # =====================================
    # AI TRUST ENGINE
    # =====================================


    trust_score = db.Column(

        db.Float,

        default=0

    )



    reputation_score = db.Column(

        db.Float,

        default=0

    )



    risk_score = db.Column(

        db.Float,

        default=0

    )



    fraud_reports = db.Column(

        db.Integer,

        default=0

    )



    ai_flagged = db.Column(

        db.Boolean,

        default=False

    )



    ai_warnings = db.Column(

        db.Text,

        nullable=True

    )



    ai_analysis = db.Column(

        db.Text,

        nullable=True

    )









    # =====================================
    # DOMAIN INTELLIGENCE
    # =====================================


    domain_age = db.Column(

        db.Integer,

        nullable=True

    )



    website_verified = db.Column(

        db.Boolean,

        default=False

    )



    email_domain_verified = db.Column(

        db.Boolean,

        default=False

    )








    # =====================================
    # SECURITY
    # =====================================


    is_blacklisted = db.Column(

        db.Boolean,

        default=False

    )



    blacklist_reason = db.Column(

        db.Text,

        nullable=True

    )



    trust_level = db.Column(

        db.String(30),

        default="unknown"

    )


    # high
    # medium
    # low







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


    # Company users

    users = db.relationship(

        "User",

        back_populates="company",

        foreign_keys="User.company_id",

        lazy=True

    )





    # Recruiter profiles

    recruiters = db.relationship(

        "Recruiter",

        back_populates="company",

        lazy=True

    )





    # Posted jobs

    jobs = db.relationship(

        "Job",

        back_populates="company",

        cascade="all, delete-orphan",

        lazy=True

    )





    # Fraud investigations

    flag_logs = db.relationship(

        "FlagLog",

        back_populates="company",

        cascade="all, delete-orphan",

        lazy=True

    )









    # =====================================
    # HELPER METHODS
    # =====================================


    def calculate_trust_level(self):


        if self.trust_score >= 80:

            return "high"


        elif self.trust_score >= 50:

            return "medium"


        else:

            return "low"








    def mark_verified(self):


        self.verification_status = "verified"

        self.verified_by_admin = True

        self.verification_date = datetime.now(timezone.utc)









    # =====================================
    # JSON SERIALIZER
    # =====================================


    def to_dict(self):


        return {


            "id":

            self.id,



            "company_name":

            self.company_name,



            "domain":

            self.company_domain,



            "website":

            self.website_url,



            "description":

            self.description,



            "industry":

            self.industry,



            "company_size":

            self.company_size,



            "location":

            self.headquarters_location,







            "verification_status":

            self.verification_status,



            "verified_by_admin":

            self.verified_by_admin,



            "linkedin_verified":

            self.linkedin_verified,



            "linkedin_url":

            self.linkedin_url,







            "trust_score":

            self.trust_score or 0,



            "reputation_score":

            self.reputation_score or 0,



            "risk_score":

            self.risk_score or 0,



            "fraud_reports":

            self.fraud_reports or 0,



            "ai_flagged":

            self.ai_flagged,



            "ai_warnings":

            self.ai_warnings,



            "ai_analysis":

            self.ai_analysis,







            "is_blacklisted":

            self.is_blacklisted,



            "trust_level":

            self.trust_level,







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

            f"<Company "

            f"{self.company_name} "

            f"trust={self.trust_score}%>"

        )