import logging

logger = logging.getLogger(__name__)


def notify_job_flagged(job):
    """Stub notification hook, triggered whenever a job gets flagged
    (automatically by ML or manually). Wire this up to an email/SMS/Slack
    provider as needed; for now it logs so the flow is observable.
    """
    logger.warning(
        "ALERT: Job #%s ('%s' at %s) flagged as potentially fake with probability %.2f",
        job.id, job.title, job.company, job.fake_probability,
    )


def notify_application_status_changed(application):
    logger.info(
        "Application #%s status changed to '%s' for job #%s",
        application.id, application.status, application.job_id,
    )