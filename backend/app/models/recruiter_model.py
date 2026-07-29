from app.extensions import db



class Recruiter(db.Model):


    __tablename__ = "recruiters"



    id = db.Column(

        db.Integer,

        primary_key=True

    )



    user_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id"

        ),

        nullable=False

    )



    company_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "companies.id"

        ),

        nullable=False

    )



    designation = db.Column(

        db.String(100),

        nullable=True

    )



    work_email = db.Column(

        db.String(150),

        nullable=True

    )





    # =========================
    # RELATIONSHIPS
    # =========================


    user = db.relationship(

        "User",

        back_populates="recruiter_profiles"

    )



    company = db.relationship(

        "Company",

        back_populates="recruiters"

    )





    def to_dict(self):


        return {


            "id": self.id,


            "user_id": self.user_id,


            "company_id": self.company_id,


            "designation": self.designation,


            "work_email": self.work_email


        }