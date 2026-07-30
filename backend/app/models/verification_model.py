# app/models/verification_model.py


from datetime import datetime, timezone


from app.extensions import db







class Verification(db.Model):


    """
    Enterprise Job Verification Model


    Handles:

    - Company verification
    - Recruiter verification
    - Website validation
    - LinkedIn verification
    - AI trust scoring
    - Fraud risk analysis
    - Admin review


    """



    __tablename__ = "verifications"







    # =====================================================
    # PRIMARY KEY
    # =====================================================


    id = db.Column(


        db.Integer,


        primary_key=True


    )







    # =====================================================
    # JOB CONNECTION
    # =====================================================


    job_id = db.Column(


        db.Integer,


        db.ForeignKey(

            "jobs.id"

        ),


        nullable=False


    )








    # =====================================================
    # COMPANY VERIFICATION
    # =====================================================


    website_verified = db.Column(


        db.Boolean,


        default=False


    )



    website_score = db.Column(


        db.Float,


        default=0


    )





    email_verified = db.Column(


        db.Boolean,


        default=False


    )



    email_domain_score = db.Column(


        db.Float,


        default=0


    )








    linkedin_verified = db.Column(


        db.Boolean,


        default=False


    )



    linkedin_url = db.Column(


        db.String(300),


        nullable=True


    )



    linkedin_score = db.Column(


        db.Float,


        default=0


    )









    # =====================================================
    # COMPANY TRUST
    # =====================================================


    company_score = db.Column(


        db.Float,


        default=0


    )



    recruiter_score = db.Column(


        db.Float,


        default=0


    )



    reputation_score = db.Column(


        db.Float,


        default=0


    )







    # =====================================================
    # FINAL AI VERIFICATION SCORE
    # =====================================================


    overall_score = db.Column(


        db.Float,


        default=0


    )



    risk_level = db.Column(


        db.String(30),


        default="LOW"


    )


    # LOW
    # MEDIUM
    # HIGH
    # CRITICAL






    status = db.Column(


        db.String(50),


        default="pending"


    )


    # verified
    # needs_review
    # rejected







    # =====================================================
    # AI EXPLANATION
    # =====================================================


    verification_notes = db.Column(


        db.Text,


        nullable=True


    )



    detected_issues = db.Column(


        db.JSON,


        nullable=True


    )








    # =====================================================
    # ADMIN REVIEW
    # =====================================================


    reviewed_by = db.Column(


        db.Integer,


        db.ForeignKey(

            "users.id"

        ),


        nullable=True


    )



    admin_comment = db.Column(


        db.Text,


        nullable=True


    )



    is_reviewed = db.Column(


        db.Boolean,


        default=False


    )








    # =====================================================
    # TIMESTAMPS
    # =====================================================


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








    # =====================================================
    # RELATIONSHIP
    # =====================================================


    job = db.relationship(


        "Job",


        backref=db.backref(

            "verification",

            uselist=False,

            lazy=True

        )


    )









    # =====================================================
    # SERIALIZER
    # =====================================================


    def to_dict(self):


        return {



            "id":

            self.id,



            "job_id":

            self.job_id,



            "website_verified":

            self.website_verified,



            "website_score":

            self.website_score or 0,



            "email_verified":

            self.email_verified,



            "email_domain_score":

            self.email_domain_score or 0,



            "linkedin_verified":

            self.linkedin_verified,



            "linkedin_url":

            self.linkedin_url,



            "linkedin_score":

            self.linkedin_score or 0,



            "company_score":

            self.company_score or 0,



            "recruiter_score":

            self.recruiter_score or 0,



            "reputation_score":

            self.reputation_score or 0,



            "overall_score":

            self.overall_score or 0,



            "risk_level":

            self.risk_level,



            "status":

            self.status,



            "verification_notes":

            self.verification_notes,



            "detected_issues":

            self.detected_issues,



            "is_reviewed":

            self.is_reviewed,



            "admin_comment":

            self.admin_comment,



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

            f"<Verification "

            f"job={self.job_id} "

            f"score={self.overall_score}% "

            f"risk={self.risk_level}>"

        )