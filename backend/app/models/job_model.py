from datetime import datetime

from app.extensions import db




class Job(db.Model):


    __tablename__ = "jobs"




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




    company_name = db.Column(

        db.String(200),

        nullable=False

    )




    location = db.Column(

        db.String(150),

        nullable=True

    )




    salary = db.Column(

        db.String(100),

        nullable=True

    )




    # ML verification score

    trust_score = db.Column(

        db.Integer,

        default=0

    )




    # verified / fake / pending

    status = db.Column(

        db.String(50),

        default="pending"

    )




    recruiter_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id"

        ),

        nullable=False

    )





    created_at = db.Column(

        db.DateTime,

        default=datetime.utcnow

    )





    # ==========================
    # RELATIONSHIP
    # ==========================


    recruiter = db.relationship(

        "User",

        back_populates="jobs"

    )






    def to_dict(self):


        return {


            "id": self.id,


            "title": self.title,


            "description": self.description,


            "company_name": self.company_name,


            "location": self.location,


            "salary": self.salary,


            "trust_score": self.trust_score,


            "status": self.status,


            "recruiter_id": self.recruiter_id,


            "created_at": self.created_at

        }