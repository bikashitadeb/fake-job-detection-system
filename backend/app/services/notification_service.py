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

        message

):


    try:


        notification = Notification(


            user_id=user_id,


            message=message,


            is_read=False


        )



        db.session.add(

            notification

        )


        db.session.commit()



        return notification






    except Exception as e:


        db.session.rollback()



        logger.error(

            "Notification creation failed: %s",

            e

        )



        return None











# =====================================================
# JOB FRAUD ALERT
# =====================================================


def notify_job_flagged(job):


    try:



        logger.warning(


            "FAKE JOB ALERT | Job ID: %s | Title: %s | Company: %s | Risk: %s%%",


            job.id,


            job.title,


            getattr(

                job,

                "company",

                "Unknown"

            ),



            job.fake_probability


        )






        # Notify recruiter


        if job.recruiter_id:


            create_notification(


                job.recruiter_id,


                f"Your job '{job.title}' has been flagged by AI verification system. Risk probability: {job.fake_probability}%"

            )






    except Exception as e:


        logger.error(

            "Job flag notification error: %s",

            e

        )









# =====================================================
# APPLICATION STATUS UPDATE
# =====================================================


def notify_application_status_changed(application):


    try:



        logger.info(


            "APPLICATION UPDATE | ID:%s | STATUS:%s",


            application.id,


            application.status


        )





        if application.jobseeker_id:



            create_notification(


                application.jobseeker_id,


                f"Your application status for {application.job.title} changed to {application.status}"

            )






    except Exception as e:


        logger.error(

            "Application notification error: %s",

            e

        )









# =====================================================
# ADMIN SECURITY ALERT
# =====================================================


def notify_admin_security_event(message):


    logger.warning(

        "ADMIN SECURITY ALERT: %s",

        message

    )









# =====================================================
# GENERAL USER NOTIFICATION
# =====================================================


def notify_user(

        user_id,

        message

):


    return create_notification(

        user_id,

        message

    )