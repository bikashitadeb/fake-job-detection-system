from datetime import datetime, timezone

from app.extensions import db





class Notification(db.Model):


    """
    Enterprise Notification Management System


    Handles:

    - Employee alerts
    - Recruiter updates
    - Application status changes
    - Job notifications
    - AI fraud warnings
    - Security alerts
    """



    __tablename__ = "notifications"








    # =====================================
    # PRIMARY KEY
    # =====================================


    id = db.Column(

        db.Integer,

        primary_key=True

    )








    # =====================================
    # USER CONNECTION
    # =====================================


    user_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id",

            ondelete="CASCADE"

        ),

        nullable=False

    )









    # =====================================
    # OPTIONAL REFERENCES
    # =====================================


    job_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "jobs.id",

            ondelete="SET NULL"

        ),

        nullable=True

    )




    application_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "applications.id",

            ondelete="SET NULL"

        ),

        nullable=True

    )









    # =====================================
    # NOTIFICATION CONTENT
    # =====================================


    title = db.Column(

        db.String(200),

        nullable=False

    )




    message = db.Column(

        db.Text,

        nullable=False

    )





    notification_type = db.Column(

        db.String(50),

        default="general"

    )


    # general
    # job
    # application
    # security
    # fraud
    # system







    # =====================================
    # STATUS MANAGEMENT
    # =====================================


    is_read = db.Column(

        db.Boolean,

        default=False

    )





    priority = db.Column(

        db.String(30),

        default="normal"

    )


    # low
    # normal
    # high
    # critical







    # =====================================
    # SECURITY TRACKING
    # =====================================


    is_system_generated = db.Column(

        db.Boolean,

        default=False

    )




    created_by = db.Column(

        db.String(100),

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




    read_at = db.Column(

        db.DateTime,

        nullable=True

    )









    # =====================================
    # RELATIONSHIPS
    # =====================================


    user = db.relationship(

        "User",

        back_populates="notifications",

        foreign_keys=[user_id]

    )









    # =====================================
    # METHODS
    # =====================================


    def mark_as_read(self):


        self.is_read = True

        self.read_at = datetime.now(timezone.utc)








    def mark_unread(self):


        self.is_read = False

        self.read_at = None











    # =====================================
    # JSON RESPONSE
    # =====================================


    def to_dict(self):


        return {


            "id":

            self.id,



            "user_id":

            self.user_id,



            "job_id":

            self.job_id,



            "application_id":

            self.application_id,



            "title":

            self.title,



            "message":

            self.message,



            "notification_type":

            self.notification_type,



            "priority":

            self.priority,



            "is_read":

            self.is_read,



            "is_system_generated":

            self.is_system_generated,



            "created_by":

            self.created_by,



            "created_at":

            self.created_at.isoformat()

            if self.created_at

            else None,



            "read_at":

            self.read_at.isoformat()

            if self.read_at

            else None

        }









    def __repr__(self):


        return (

            f"<Notification "

            f"user={self.user_id} "

            f"type={self.notification_type}>"

        )