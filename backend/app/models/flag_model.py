from datetime import datetime, timezone

from app.extensions import db





class FlagLog(db.Model):


    """
    Enterprise AI Fraud Flag System

    Handles:

    - Fake job reporting
    - Company fraud reporting
    - User complaints
    - AI risk analysis
    - Admin investigation
    - Fraud tracking
    """



    __tablename__ = "flag_logs"






    # =====================================
    # PRIMARY KEY
    # =====================================


    id = db.Column(

        db.Integer,

        primary_key=True

    )









    # =====================================
    # TARGET REFERENCES
    # =====================================


    job_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "jobs.id",

            ondelete="CASCADE"

        ),

        nullable=True

    )





    company_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "companies.id",

            ondelete="CASCADE"

        ),

        nullable=True

    )









    # =====================================
    # USER REFERENCES
    # =====================================


    reported_by_user_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id",

            ondelete="CASCADE"

        ),

        nullable=False

    )





    reviewed_by = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id",

            ondelete="SET NULL"

        ),

        nullable=True

    )









    # =====================================
    # FLAG DETAILS
    # =====================================


    flag_type = db.Column(

        db.String(100),

        nullable=False

    )


    # fake_job
    # fake_company
    # scam_recruiter
    # spam





    reason = db.Column(

        db.Text,

        nullable=False

    )





    severity = db.Column(

        db.String(30),

        default="medium"

    )


    # low
    # medium
    # high
    # critical





    status = db.Column(

        db.String(30),

        default="pending"

    )


    # pending
    # investigating
    # resolved
    # rejected







    # =====================================
    # AI FRAUD ANALYSIS
    # =====================================


    ai_score = db.Column(

        db.Float,

        default=0

    )




    ai_reason = db.Column(

        db.Text,

        nullable=True

    )




    evidence = db.Column(

        db.Text,

        nullable=True

    )









    # =====================================
    # ADMIN NOTES
    # =====================================


    admin_notes = db.Column(

        db.Text,

        nullable=True

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


    job = db.relationship(

        "Job",

        back_populates="flag_logs"

    )





    company = db.relationship(

        "Company",

        back_populates="flag_logs"

    )





    reporter = db.relationship(

        "User",

        foreign_keys=[reported_by_user_id],

        back_populates="reported_flags"

    )





    reviewer = db.relationship(

        "User",

        foreign_keys=[reviewed_by],

        back_populates="reviewed_flags"

    )









    # =====================================
    # METHODS
    # =====================================


    def resolve(self, admin_id):


        self.status = "resolved"

        self.reviewed_by = admin_id







    def reject(self, admin_id):


        self.status = "rejected"

        self.reviewed_by = admin_id







    # =====================================
    # JSON SERIALIZER
    # =====================================


    def to_dict(self):


        return {


            "id":

            self.id,



            "job_id":

            self.job_id,



            "company_id":

            self.company_id,



            "reported_by":

            self.reported_by_user_id,



            "reviewed_by":

            self.reviewed_by,



            "flag_type":

            self.flag_type,



            "reason":

            self.reason,



            "severity":

            self.severity,



            "status":

            self.status,



            "ai_score":

            self.ai_score or 0,



            "ai_reason":

            self.ai_reason,



            "evidence":

            self.evidence,



            "admin_notes":

            self.admin_notes,



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

            f"<FlagLog "

            f"type={self.flag_type} "

            f"status={self.status}>"

        )