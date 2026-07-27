from app.extensions import db


class Company(db.Model):

    __tablename__ = "companies"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    name = db.Column(
        db.String(150),
        nullable=False
    )


    website = db.Column(
        db.String(255)
    )


    email = db.Column(
        db.String(150)
    )


    created_at = db.Column(
        db.DateTime
    )



    # =========================
    # RELATIONSHIP
    # =========================

    recruiters = db.relationship(

        "Recruiter",

        back_populates="company",

        lazy=True

    )



    def to_dict(self):

        return {

            "id": self.id,

            "name": self.name,

            "website": self.website,

            "email": self.email

        }