from datetime import datetime

from app.extensions import db



class User(db.Model):


    __tablename__ = "users"



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

        unique=True,

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


    company = db.relationship(

        "Company",

        backref="users"

    )



    # Recruiter posted jobs

    jobs = db.relationship(

        "Job",

        back_populates="recruiter",

        cascade="all, delete-orphan"

    )







    def to_dict(self):


        return {


            "id": self.id,


            "name": self.name,


            "email": self.email,


            "phone": self.phone,


            "role": self.role,


            "company_id": self.company_id


        }