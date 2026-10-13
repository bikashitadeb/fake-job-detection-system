from datetime import datetime, timezone

from app.extensions import db





class TokenBlocklist(db.Model):


    """
    Enterprise JWT Token Security System


    Features:

    - Logout token invalidation
    - Access token revocation
    - Refresh token tracking
    - Session security
    - Device tracking
    - Audit logging

    """



    __tablename__ = "token_blocklist"









    # =====================================
    # PRIMARY KEY
    # =====================================


    id = db.Column(

        db.Integer,

        primary_key=True

    )









    # =====================================
    # JWT INFORMATION
    # =====================================


    jti = db.Column(

        db.String(255),

        unique=True,

        nullable=False,

        index=True

    )





    token_type = db.Column(

        db.String(20),

        nullable=False,

        default="access"

    )


    # access
    # refresh







    # =====================================
    # USER CONNECTION
    # =====================================


    user_id = db.Column(

        db.Integer,

        db.ForeignKey(

            "users.id",

            ondelete="CASCADE"

        ),

        nullable=False,

        index=True

    )









    # =====================================
    # SECURITY INFORMATION
    # =====================================


    revoked = db.Column(

        db.Boolean,

        default=True

    )




    revoked_reason = db.Column(

        db.String(255),

        nullable=True

    )





    ip_address = db.Column(

        db.String(100),

        nullable=True

    )





    user_agent = db.Column(

        db.String(500),

        nullable=True

    )









    # =====================================
    # TOKEN TIMING
    # =====================================


    created_at = db.Column(

        db.DateTime,

        default=lambda:

        datetime.now(timezone.utc)

    )





    expires_at = db.Column(

        db.DateTime,

        nullable=True

    )









    # =====================================
    # METHODS
    # =====================================


    def revoke(self, reason="User logout"):


        self.revoked = True

        self.revoked_reason = reason







    def is_expired(self):


        if not self.expires_at:

            return False



        return (

            datetime.now(timezone.utc)

            >

            self.expires_at

        )








    # =====================================
    # SERIALIZER
    # =====================================


    def to_dict(self):


        return {


            "id":

            self.id,



            "jti":

            self.jti,



            "token_type":

            self.token_type,



            "user_id":

            self.user_id,



            "revoked":

            self.revoked,



            "revoked_reason":

            self.revoked_reason,



            "ip_address":

            self.ip_address,



            "user_agent":

            self.user_agent,



            "created_at":

            self.created_at.isoformat()

            if self.created_at

            else None,



            "expires_at":

            self.expires_at.isoformat()

            if self.expires_at

            else None

        }









    def __repr__(self):


        return (

            f"<TokenBlocklist "

            f"jti={self.jti} "

            f"user={self.user_id}>"

        )