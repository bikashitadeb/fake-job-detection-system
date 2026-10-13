
# app/services/notification_service.py

import logging

from app.extensions import db
from app.models.notification_model import Notification

logger = logging.getLogger(__name__)


# =====================================================
# CREATE SYSTEM NOTIFICATION
# =====================================================

def create_notification(
    user_id,
    message,
    title="Account update",
    notification_type="general",
    job_id=None,
    application_id=None,
    priority="normal"
):
    """
    Create and persist a notification.

    The second positional argument remains `message` for
    compatibility with existing callers.
    """

    try:
        if not user_id:
            logger.warning("Notification skipped: missing user_id")
            return None

        if not message:
            logger.warning("Notification skipped: missing message")
            return None

        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            is_read=False,
            job_id=job_id,
            application_id=application_id,
            priority=priority,
            is_system_generated=True
        )

        db.session.add(notification)
        db.session.commit()

        logger.info(
            "Notification created | ID: %s | User: %s | Type: %s",
            notification.id,
            user_id,
            notification_type
        )

        return notification

    except Exception:
        db.session.rollback()
        logger.exception(
            "Notification creation failed for user %s",
            user_id
        )
        return None


# =====================================================
# JOB FRAUD ALERT
# =====================================================

def notify_job_flagged(job):
    """Notify the recruiter when their job is flagged by AI."""

    try:
        if not job:
            logger.warning("Cannot notify: job is missing")
            return None

        fake_probability = getattr(job, "fake_probability", None)

        logger.warning(
            "FAKE JOB ALERT | Job ID: %s | Title: %s | Risk: %s%%",
            job.id,
            job.title,
            fake_probability if fake_probability is not None else "Unknown"
        )

        if not job.recruiter_id:
            logger.warning(
                "Fraud alert not sent: job %s has no recruiter",
                job.id
            )
            return None

        risk_text = (
            f"{float(fake_probability):.2f}%"
            if fake_probability is not None
            else "undetermined"
        )

        return create_notification(
            user_id=job.recruiter_id,
            title="AI fraud risk alert",
            message=(
                f"Your job '{job.title}' was flagged by the AI "
                f"verification system. Estimated fraud probability: "
                f"{risk_text}."
            ),
            notification_type="fraud_alert",
            job_id=job.id,
            priority="high"
        )

    except Exception:
        logger.exception(
            "Job flag notification error for job %s",
            getattr(job, "id", None)
        )
        return None


# =====================================================
# APPLICATION STATUS UPDATE
# =====================================================

def notify_application_status_changed(application):
    """Notify the applicant when their application status changes."""

    try:
        if not application:
            logger.warning("Cannot notify: application is missing")
            return None

        logger.info(
            "APPLICATION UPDATE | ID: %s | STATUS: %s",
            application.id,
            application.status
        )

        if not application.jobseeker_id:
            logger.warning(
                "Application %s has no associated jobseeker",
                application.id
            )
            return None

        job = getattr(application, "job", None)
        job_title = getattr(job, "title", None) or "the job"

        status = str(application.status or "updated").replace("_", " ")

        return create_notification(
            user_id=application.jobseeker_id,
            title="Application status updated",
            message=(
                f"Your application for '{job_title}' "
                f"has been updated to: {status}."
            ),
            notification_type="application_update",
            job_id=getattr(application, "job_id", None),
            application_id=application.id,
            priority="normal"
        )

    except Exception:
        logger.exception(
            "Application notification error for application %s",
            getattr(application, "id", None)
        )
        return None


# =====================================================
# ADMIN SECURITY ALERT
# =====================================================

def notify_admin_security_event(message, admin_user_ids=None):
    """
    Log a security event and optionally notify specified admin users.

    Pass actual admin user IDs when available. This function does not
    assume that a particular user ID belongs to an administrator.
    """

    logger.warning("ADMIN SECURITY ALERT: %s", message)

    results = []

    for admin_user_id in admin_user_ids or []:
        notification = create_notification(
            user_id=admin_user_id,
            title="Security alert",
            message=str(message),
            notification_type="security_alert",
            priority="high"
        )

        results.append(notification)

    return results


# =====================================================
# GENERAL USER NOTIFICATION
# =====================================================

def notify_user(
    user_id,
    message,
    title="Account update",
    notification_type="general",
    job_id=None,
    application_id=None,
    priority="normal"
):
    """Create a general notification for a user."""

    return create_notification(
        user_id=user_id,
        message=message,
        title=title,
        notification_type=notification_type,
        job_id=job_id,
        application_id=application_id,
        priority=priority
    )
