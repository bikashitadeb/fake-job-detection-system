from datetime import datetime, timezone

from app.extensions import db





class User(db.Model):


    """
    Enterprise AI User Management Model

    Supports:

    - Employees
    - Recruiters
    - Admins
    - Company accounts
    - AI trust scoring
    - Fraud monitoring
    - Applications
    - Job management
    - Notifications
    """



    __tablename__ = "users"





    # =====================================
    # CONSTRAINTS
    # =====================================


    __table_args__ = (

        db.UniqueConstraint(

            "email",

            "role",

            name="unique_email_role"

        ),

    )









    # =====================================
    # BASIC INFORMATION
    # =====================================


    id = db.Column(

        db.Integer,

        primary_key=True

    )




    name = db.Column(

        db.String(150),

        nullable=False

    )




    email = db.Column(

        db.String(150),

        nullable=False

    )




    password_hash = db.Column(

        db.String(255),

        nullable=False

    )




    phone = db.Column(

        db.String(20),

        nullable=True

    )




    role = db.Column(

        db.String(50),

        nullable=False,

        default="employee"

    )









    # =====================================
    # SECURITY
    # =====================================


    is_active = db.Column(

        db.Boolean,

        default=True

    )




    is_verified = db.Column(

        db.Boolean,

        default=False

    )




    last_login = db.Column(

        db.DateTime,

        nullable=True

    )




    login_attempts = db.Column(

        db.Integer,

        default=0

    )




    account_locked = db.Column(

        db.Boolean,

        default=False

    )









    # =====================================
    # COMPANY CONNECTION
    # =====================================


    company_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "companies.id",

            ondelete="SET NULL"

        ),

        nullable=True

    )









    # =====================================
    # PROFILE
    # =====================================


    profile_image = db.Column(

        db.String(500),

        nullable=True

    )




    bio = db.Column(

        db.Text,

        nullable=True

    )




    skills = db.Column(

        db.Text,

        nullable=True

    )




    resume_url = db.Column(

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



    # Company members

    company = db.relationship(

        "Company",

        back_populates="users",

        foreign_keys=[company_id]

    )






    # Recruiter created jobs

    jobs = db.relationship(

        "Job",

        back_populates="recruiter",

        foreign_keys="Job.recruiter_id",

        cascade="all, delete-orphan",

        lazy=True

    )







    # Employee applications

    applications = db.relationship(

        "Application",

        back_populates="user",

        foreign_keys="Application.jobseeker_id",

        cascade="all, delete-orphan",

        lazy=True

    )







    # Notifications

    notifications = db.relationship(

        "Notification",

        back_populates="user",

        cascade="all, delete-orphan",

        lazy=True

    )







    # Recruiter profile

    recruiter_profiles = db.relationship(

        "Recruiter",

        back_populates="user",

        cascade="all, delete-orphan",

        lazy=True

    )







    # User reported fraud

    reported_flags = db.relationship(

        "FlagLog",

        foreign_keys="FlagLog.reported_by_user_id",

        back_populates="reporter",

        cascade="all, delete-orphan",

        lazy=True

    )







    # Admin reviewed fraud

    reviewed_flags = db.relationship(

        "FlagLog",

        foreign_keys="FlagLog.reviewed_by",

        back_populates="reviewer",

        cascade="all, delete-orphan",

        lazy=True

    )









    # =====================================
    # JWT SUPPORT
    # =====================================


    def get_id(self):

        return str(self.id)









    # =====================================
    # SECURITY METHODS
    # =====================================


    def update_last_login(self):


        self.last_login = datetime.now(timezone.utc)

        self.login_attempts = 0





    def increase_login_failure(self):


        self.login_attempts += 1


        if self.login_attempts >= 5:

            self.account_locked = True









    # =====================================
    # SERIALIZER
    # =====================================


    def to_dict(self):


        return {


            "id":

            self.id,



            "name":

            self.name,



            "email":

            self.email,



            "phone":

            self.phone,



            "role":

            self.role,



            "is_active":

            self.is_active,



            "is_verified":

            self.is_verified,



            "company_id":

            self.company_id,



            "profile_image":

            self.profile_image,



            "bio":

            self.bio,



            "skills":

            self.skills,



            "resume_url":

            self.resume_url,





            # AI

            "trust_score":

            self.trust_score or 0,



            "risk_score":

            self.risk_score or 0,



            "fraud_reports":

            self.fraud_reports or 0,



            "ai_flagged":

            self.ai_flagged,








            # Stats

            "jobs_created":

            len(self.jobs)

            if self.jobs

            else 0,



            "applications_sent":

            len(self.applications)

            if self.applications

            else 0,







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

            f"<User "

            f"{self.email} "

            f"role={self.role}>"

        )