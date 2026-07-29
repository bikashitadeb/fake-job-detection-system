from datetime import datetime

from app.extensions import db



class User(db.Model):


    __tablename__ = "users"



    # ==========================
    # TABLE CONSTRAINTS
    # ==========================


    __table_args__ = (

        db.UniqueConstraint(

            "email",

            "role",

            name="unique_email_role"

        ),

    )





    # ==========================
    # COLUMNS
    # ==========================


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



    is_active = db.Column(

        db.Boolean,

        nullable=False,

        default=True

    )



    company_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "companies.id"

        ),

        nullable=True

    )



    created_at = db.Column(

        db.DateTime,

        default=datetime.utcnow

    )







    # ==========================
    # RELATIONSHIPS
    # ==========================


    # User belongs to company

    company = db.relationship(

        "Company",

        back_populates="users"

    )





    # Recruiter creates jobs

    jobs = db.relationship(

        "Job",

        back_populates="recruiter",

        cascade="all, delete-orphan"

    )





    # Employee applications

    applications = db.relationship(

        "Application",

        back_populates="user",

        cascade="all, delete-orphan"

    )





    # Notifications

    notifications = db.relationship(

        "Notification",

        back_populates="user",

        cascade="all, delete-orphan"

    )





    # Recruiter profile

    recruiter_profiles = db.relationship(

        "Recruiter",

        back_populates="user",

        cascade="all, delete-orphan"

    )







    # ==========================
    # JSON RESPONSE
    # ==========================


    def to_dict(self):


        return {


            "id": self.id,


            "name": self.name,


            "email": self.email,


            "phone": self.phone,


            "role": self.role,


            "is_active": self.is_active,


            "company_id": self.company_id


        }