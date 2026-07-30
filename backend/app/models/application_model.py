from datetime import datetime

from app.extensions import db





class Application(db.Model):


    """
    Enterprise Job Application Model

    Features:

    - Employee job applications
    - Recruiter pipeline management
    - AI resume analysis
    - Skill matching
    - Interview management
    - Offer management
    - Security tracking

    """



    __tablename__ = "applications"







    # =====================================
    # PRIMARY KEY
    # =====================================


    id = db.Column(

        db.Integer,

        primary_key=True

    )








    # =====================================
    # FOREIGN KEYS
    # =====================================


    job_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "jobs.id",

            ondelete="CASCADE"

        ),

        nullable=False

    )





    jobseeker_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id",

            ondelete="CASCADE"

        ),

        nullable=False

    )









    # =====================================
    # APPLICATION INFORMATION
    # =====================================


    cover_letter = db.Column(

        db.Text,

        default=""

    )




    resume_url = db.Column(

        db.String(300),

        nullable=True

    )



    portfolio_url = db.Column(

        db.String(300),

        nullable=True

    )



    github_url = db.Column(

        db.String(300),

        nullable=True

    )



    linkedin_url = db.Column(

        db.String(300),

        nullable=True

    )









    # =====================================
    # APPLICATION PIPELINE
    # =====================================


    status = db.Column(

        db.String(30),

        default="pending",

        nullable=False

    )


    """

    pending

    shortlisted

    interview

    selected

    rejected

    offered

    """





    rejection_reason = db.Column(

        db.Text,

        nullable=True

    )



    recruiter_notes = db.Column(

        db.Text,

        nullable=True

    )









    # =====================================
    # AI RESUME INTELLIGENCE
    # =====================================


    resume_score = db.Column(

        db.Float,

        default=0

    )




    skill_match_score = db.Column(

        db.Float,

        default=0

    )




    experience_match_score = db.Column(

        db.Float,

        default=0

    )




    ai_match_score = db.Column(

        db.Float,

        default=0

    )





    extracted_skills = db.Column(

        db.Text,

        nullable=True

    )




    missing_skills = db.Column(

        db.Text,

        nullable=True

    )




    ai_recommendation = db.Column(

        db.Text,

        nullable=True

    )









    # =====================================
    # INTERVIEW MANAGEMENT
    # =====================================


    interview_date = db.Column(

        db.DateTime,

        nullable=True

    )




    interview_mode = db.Column(

        db.String(50),

        nullable=True

    )


    # Online / Offline





    interview_link = db.Column(

        db.String(300),

        nullable=True

    )




    interview_feedback = db.Column(

        db.Text,

        nullable=True

    )









    # =====================================
    # OFFER MANAGEMENT
    # =====================================


    offer_status = db.Column(

        db.String(30),

        default="not_sent"

    )


    # not_sent
    # sent
    # accepted
    # declined





    offered_salary = db.Column(

        db.Float,

        nullable=True

    )









    # =====================================
    # SECURITY TRACKING
    # =====================================


    viewed_by_recruiter = db.Column(

        db.Boolean,

        default=False

    )




    notification_sent = db.Column(

        db.Boolean,

        default=False

    )




    priority = db.Column(

        db.String(20),

        default="normal"

    )


    # high
    # normal
    # low









    # =====================================
    # TIMESTAMPS
    # =====================================


    applied_at = db.Column(

        db.DateTime,

        default=datetime.utcnow

    )





    created_at = db.Column(

        db.DateTime,

        default=datetime.utcnow

    )





    updated_at = db.Column(

        db.DateTime,

        default=datetime.utcnow,

        onupdate=datetime.utcnow

    )









    # =====================================
    # RELATIONSHIPS
    # =====================================


    user = db.relationship(

        "User",

        back_populates="applications",

        foreign_keys=[jobseeker_id]

    )





    job = db.relationship(

        "Job",

        back_populates="applications",

        foreign_keys=[job_id]

    )









    # =====================================
    # SERIALIZER
    # =====================================


    def to_dict(self):


        return {


            "id":

            self.id,



            "job_id":

            self.job_id,



            "jobseeker_id":

            self.jobseeker_id,



            "user_id":

            self.jobseeker_id,




            "job_title":

            self.job.title

            if self.job

            else None,




            "company":

            self.job.company

            if self.job

            else None,





            "candidate_name":

            self.user.name

            if self.user

            else None,





            "candidate_email":

            self.user.email

            if self.user

            else None,







            # APPLICATION

            "status":

            self.status,



            "cover_letter":

            self.cover_letter,



            "resume_url":

            self.resume_url,



            "portfolio_url":

            self.portfolio_url,



            "github_url":

            self.github_url,



            "linkedin_url":

            self.linkedin_url,








            # AI

            "resume_score":

            self.resume_score or 0,



            "skill_match_score":

            self.skill_match_score or 0,



            "experience_match_score":

            self.experience_match_score or 0,



            "ai_match_score":

            self.ai_match_score or 0,



            "extracted_skills":

            self.extracted_skills,



            "missing_skills":

            self.missing_skills,



            "ai_recommendation":

            self.ai_recommendation,








            # INTERVIEW

            "interview_date":

            self.interview_date.isoformat()

            if self.interview_date

            else None,



            "interview_mode":

            self.interview_mode,



            "interview_link":

            self.interview_link,



            "interview_feedback":

            self.interview_feedback,









            # OFFER

            "offer_status":

            self.offer_status,



            "offered_salary":

            self.offered_salary,









            # SECURITY

            "priority":

            self.priority,



            "viewed_by_recruiter":

            self.viewed_by_recruiter,



            "notification_sent":

            self.notification_sent,









            # TIME

            "applied_at":

            self.applied_at.isoformat()

            if self.applied_at

            else None,



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

            f"<Application "

            f"id={self.id} "

            f"job={self.job_id} "

            f"user={self.jobseeker_id}>"

        )