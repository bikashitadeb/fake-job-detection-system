from datetime import datetime, timezone

from app.extensions import db





class Recruiter(db.Model):


    """
    Enterprise Recruiter Intelligence Model

    Handles:

    - Recruiter profile
    - Company association
    - Verification
    - AI trust scoring
    - Fraud monitoring
    - Hiring analytics
    """



    __tablename__ = "recruiters"





    # =====================================
    # BASIC INFORMATION
    # =====================================


    id = db.Column(

        db.Integer,

        primary_key=True

    )





    user_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id",

            ondelete="CASCADE"

        ),

        nullable=False,

        unique=True

    )





    company_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "companies.id",

            ondelete="SET NULL"

        ),

        nullable=True

    )









    # =====================================
    # PROFESSIONAL DETAILS
    # =====================================


    designation = db.Column(

        db.String(100),

        nullable=True

    )




    department = db.Column(

        db.String(100),

        nullable=True

    )




    work_email = db.Column(

        db.String(150),

        nullable=True

    )




    experience_years = db.Column(

        db.Integer,

        default=0

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





    is_verified = db.Column(

        db.Boolean,

        default=False

    )




    verification_document = db.Column(

        db.String(500),

        nullable=True

    )









    # =====================================
    # AI TRUST SYSTEM
    # =====================================


    trust_score = db.Column(

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









    # =====================================
    # RECRUITMENT ANALYTICS
    # =====================================


    total_jobs_posted = db.Column(

        db.Integer,

        default=0

    )




    successful_hires = db.Column(

        db.Integer,

        default=0

    )




    account_active = db.Column(

        db.Boolean,

        default=True

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



    user = db.relationship(

        "User",

        back_populates="recruiter_profiles",

        foreign_keys=[user_id]

    )






    company = db.relationship(

        "Company",

        back_populates="recruiters",

        foreign_keys=[company_id]

    )









    # =====================================
    # METHODS
    # =====================================


    def verify_recruiter(self):


        self.is_verified = True

        self.verification_status = "verified"









    def calculate_trust_level(self):


        if self.trust_score >= 80:

            return "high"


        elif self.trust_score >= 50:

            return "medium"


        return "low"









    # =====================================
    # JSON RESPONSE
    # =====================================


    def to_dict(self):


        return {


            "id":

            self.id,



            "user_id":

            self.user_id,



            "company_id":

            self.company_id,



            "name":

            self.user.name

            if self.user

            else None,



            "email":

            self.user.email

            if self.user

            else None,



            "company_name":

            self.company.company_name

            if self.company

            else None,



            "designation":

            self.designation,



            "department":

            self.department,



            "work_email":

            self.work_email,



            "experience_years":

            self.experience_years,





            "verification_status":

            self.verification_status,



            "is_verified":

            self.is_verified,







            "trust_score":

            self.trust_score or 0,



            "risk_score":

            self.risk_score or 0,



            "fraud_reports":

            self.fraud_reports or 0,



            "ai_flagged":

            self.ai_flagged,





            "total_jobs_posted":

            self.total_jobs_posted,



            "successful_hires":

            self.successful_hires,







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

            f"<Recruiter "

            f"user={self.user_id} "

            f"company={self.company_id}>"

        )