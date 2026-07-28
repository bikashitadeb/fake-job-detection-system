from datetime import datetime

from app.extensions import db




class Company(db.Model):


    __tablename__ = "companies"




    id = db.Column(

        db.Integer,

        primary_key=True

    )




    name = db.Column(

        db.String(200),

        nullable=False

    )




    website = db.Column(

        db.String(255),

        nullable=True

    )




    linkedin_url = db.Column(

        db.String(255),

        nullable=True

    )




    created_at = db.Column(

        db.DateTime,

        default=datetime.utcnow

    )
        # ==========================
    # RELATIONSHIPS
    # ==========================

    recruiters = db.relationship(
        "Recruiter",
        back_populates="company",
        cascade="all, delete-orphan"
    )





    def to_dict(self):


        return {


            "id": self.id,


            "name": self.name,


            "website": self.website,


            "linkedin_url": self.linkedin_url


        }