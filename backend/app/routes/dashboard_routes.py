import re

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from app.extensions import db
from app.models.user_model import User
from app.models.job_model import Job
from app.models.application_model import Application


# =====================================================
# BLUEPRINT
# =====================================================

dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


# =====================================================
# COMMON RESPONSE
# =====================================================

def response(success=True, message="", data=None, status=200):
    return jsonify({
        "success": success,
        "message": message,
        "data": data
    }), status


# =====================================================
# JWT USER ID RESOLVER
# =====================================================

def resolve_jwt_user_id():
    identity = get_jwt_identity()

    if identity is None:
        raise ValueError(
            "JWT identity is missing. Please log in again."
        )

    identity = str(identity).strip()

    # Current token format: identity="123"
    if identity.isdigit():
        return int(identity)

    # Legacy token format:
    # <User bikashita02@gmail.com role=recruiter>
    match = re.search(
        r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}",
        identity
    )

    if match:
        email = match.group(0)

        user = User.query.filter(
            func.lower(User.email) == email.lower()
        ).first()

        if user:
            return user.id

    raise ValueError(
        "Invalid or outdated login token. "
        "Please log out and log in again."
    )


# =====================================================
# PROFILE
# GET /api/dashboard/profile
# =====================================================

@dashboard_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    try:
        user_id = resolve_jwt_user_id()
        user = db.session.get(User, user_id)

        if not user:
            return response(
                False,
                "User not found",
                status=404
            )

        return response(
            True,
            "Profile loaded",
            {"user": user.to_dict()}
        )

    except ValueError as error:
        return response(False, str(error), status=401)

    except Exception:
        db.session.rollback()
        return response(
            False,
            "Unable to load profile",
            status=500
        )


# =====================================================
# EMPLOYEE DASHBOARD
# GET /api/dashboard/employee
# =====================================================

@dashboard_bp.route("/employee", methods=["GET"])
@jwt_required()
def employee_dashboard():
    try:
        user_id = resolve_jwt_user_id()
        user = db.session.get(User, user_id)

        if not user:
            return response(
                False,
                "User not found",
                status=404
            )

        if user.role != "employee":
            return response(
                False,
                "Employee access required",
                status=403
            )

        jobs = Job.query.filter(
            Job.is_active.is_(True)
        ).order_by(
            Job.created_at.desc()
        ).all()

        applications = Application.query.filter_by(
            jobseeker_id=user.id
        ).order_by(
            Application.applied_at.desc()
        ).all()

        suspicious_jobs = Job.query.filter(
            Job.is_fake_predicted.is_(True)
        ).all()

        verified_jobs = [
            job for job in jobs
            if job.linkedin_verified
        ]

        application_status = {
            "pending": sum(
                1 for app in applications
                if app.status == "pending"
            ),
            "selected": sum(
                1 for app in applications
                if app.status == "selected"
            ),
            "rejected": sum(
                1 for app in applications
                if app.status == "rejected"
            )
        }

        data = {
            "user": user.to_dict(),
            "jobs": [
                job.to_dict() for job in jobs
            ],
            "applications": [
                app.to_dict() for app in applications
            ],
            "suspicious_jobs": [
                job.to_dict() for job in suspicious_jobs
            ],
            "analytics": {
                "total_jobs": len(jobs),
                "verified_jobs": len(verified_jobs),
                "suspicious_jobs": len(suspicious_jobs),
                "applications_sent": len(applications),
                "application_status": application_status
            }
        }

        return response(
            True,
            "Employee dashboard loaded",
            data
        )

    except ValueError as error:
        return response(False, str(error), status=401)

    except Exception:
        db.session.rollback()
        return response(
            False,
            "Unable to load employee dashboard",
            status=500
        )


# =====================================================
# RECRUITER DASHBOARD
# GET /api/dashboard/recruiter
# =====================================================

@dashboard_bp.route("/recruiter", methods=["GET"])
@jwt_required()
def recruiter_dashboard():
    try:
        user_id = resolve_jwt_user_id()
        user = db.session.get(User, user_id)

        if not user:
            return response(
                False,
                "User not found",
                status=404
            )

        if user.role != "recruiter":
            return response(
                False,
                "Recruiter access required",
                status=403
            )

        jobs = Job.query.filter_by(
            recruiter_id=user.id
        ).order_by(
            Job.created_at.desc()
        ).all()

        applications = Application.query.join(
            Job
        ).filter(
            Job.recruiter_id == user.id
        ).order_by(
            Application.applied_at.desc()
        ).all()

        average_trust = (
            sum(
                float(job.trust_score or 0)
                for job in jobs
            ) / len(jobs)
            if jobs else 0
        )

        flagged_jobs = [
            job for job in jobs
            if job.is_fake_predicted
        ]

        analytics = {
            "total_jobs": len(jobs),

            "active_jobs": sum(
                1 for job in jobs
                if job.is_active
            ),

            "fake_jobs_detected": len(flagged_jobs),

            "average_trust_score": round(
                average_trust, 2
            ),

            "total_applicants": len(applications),

            "shortlisted_candidates": sum(
                1 for app in applications
                if app.status == "shortlisted"
            ),

            "selected_candidates": sum(
                1 for app in applications
                if app.status == "selected"
            ),

            "pending_applications": sum(
                1 for app in applications
                if app.status == "pending"
            ),

            "profile_views": sum(
                int(job.views_count or 0)
                for job in jobs
            ),

            "verified_jobs": sum(
                1 for job in jobs
                if not job.is_fake_predicted
                and float(job.trust_score or 0) >= 80
            )
        }

        data = {
            "user": user.to_dict(),
            "jobs": [
                job.to_dict() for job in jobs
            ],
            "applications": [
                app.to_dict() for app in applications
            ],
            "analytics": analytics
        }

        return response(
            True,
            "Recruiter dashboard loaded",
            data
        )

    except ValueError as error:
        return response(False, str(error), status=401)

    except Exception:
        db.session.rollback()
        return response(
            False,
            "Unable to load recruiter dashboard",
            status=500
        )