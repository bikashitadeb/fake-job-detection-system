from datetime import datetime

from app.extensions import db



class Company(db.Model):


    __tablename__ = "companies"



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



    website_url = db.Column(

        db.String(255),

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



    verification_status = db.Column(

        db.String(30),

        default="pending"

    )



    trust_score = db.Column(

        db.Float,

        default=0

    )



    created_at = db.Column(

        db.DateTime,

        default=datetime.utcnow

    )



    updated_at = db.Column(

        db.DateTime,

        default=datetime.utcnow

    )





    # ==========================
    # RELATIONSHIPS
    # ==========================


    users = db.relationship(

        "User",

        back_populates="company"

    )



    recruiters = db.relationship(

        "Recruiter",

        back_populates="company"

    )







    def to_dict(self):


        return {


            "id": self.id,


            "company_name": self.company_name,


            "website_url": self.website_url,


            "industry": self.industry,


            "company_size": self.company_size,


            "verification_status":
                self.verification_status,


            "trust_score":
                self.trust_score,


            "created_at":
                self.created_at.isoformat()
                if self.created_at
                else None


        }