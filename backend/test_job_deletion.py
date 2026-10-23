import os
import unittest

os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "local-job-delete-test-secret"
os.environ["JWT_SECRET_KEY"] = "local-job-delete-test-jwt-secret"
os.environ["CORS_ORIGINS"] = "http://localhost"

from sqlalchemy import event
from flask_jwt_extended import create_access_token

from app.config import Config

Config.SQLALCHEMY_ENGINE_OPTIONS = {}

from app import create_app
from app.extensions import db
from app.models.application_model import Application
from app.models.flag_log_model import FlagLog
from app.models.job_model import Job
from app.models.notification_model import Notification
from app.models.prediction_model import Prediction
from app.models.user_model import User
from app.models.verification_model import Verification


class JobDeletionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config.update(TESTING=True)
        with cls.app.app_context():
            engine = db.engine

            @event.listens_for(engine, "connect")
            def enable_sqlite_foreign_keys(connection, _record):
                cursor = connection.cursor()
                cursor.execute("PRAGMA foreign_keys=ON")
                cursor.close()

            db.create_all()

    @classmethod
    def tearDownClass(cls):
        with cls.app.app_context():
            db.session.remove()
            db.drop_all()
            db.engine.dispose()

    def setUp(self):
        self.context = self.app.app_context()
        self.context.push()
        self.client = self.app.test_client()
        db.session.remove()
        db.drop_all()
        db.create_all()
        self.recruiter = self._user("recruiter", "owner@example.test")
        self.other_recruiter = self._user("recruiter", "other@example.test")
        self.employee = self._user("employee", "employee@example.test")
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        self.context.pop()

    def _user(self, role, email):
        user = User(
            name=email.split("@")[0],
            email=email,
            password_hash="test-hash-not-a-real-credential",
            role=role,
        )
        db.session.add(user)
        db.session.flush()
        return user

    def _job(self, owner_id):
        job = Job(
            title="Local test job",
            description="Temporary deletion test record",
            location="Local",
            recruiter_id=owner_id,
        )
        db.session.add(job)
        db.session.flush()
        return job

    def _token_headers(self, user):
        with self.app.app_context():
            token = create_access_token(identity=str(user.id))
        return {"Authorization": f"Bearer {token}"}

    def test_owner_can_delete_job_and_my_jobs_stays_empty_after_refresh(self):
        job = self._job(self.recruiter.id)
        job_id = job.id
        db.session.commit()

        response = self.client.delete(
            f"/api/jobs/{job_id}", headers=self._token_headers(self.recruiter)
        )

        self.assertEqual(response.status_code, 200, response.get_json())
        self.assertTrue(response.get_json()["success"])
        self.assertIsNone(db.session.get(Job, job_id))
        for _ in range(2):
            jobs_response = self.client.get(
                "/api/jobs/my-jobs", headers=self._token_headers(self.recruiter)
            )
            self.assertEqual(jobs_response.status_code, 200)
            self.assertEqual(jobs_response.get_json()["data"]["jobs"], [])

    def test_recruiter_cannot_delete_another_recruiters_job(self):
        job = self._job(self.other_recruiter.id)
        db.session.commit()

        response = self.client.delete(
            f"/api/jobs/{job.id}", headers=self._token_headers(self.recruiter)
        )

        self.assertEqual(response.status_code, 403, response.get_json())
        self.assertIsNotNone(db.session.get(Job, job.id))

    def test_delete_requires_authentication(self):
        job = self._job(self.recruiter.id)
        db.session.commit()

        response = self.client.delete(f"/api/jobs/{job.id}")

        self.assertEqual(response.status_code, 401)
        self.assertIsNotNone(db.session.get(Job, job.id))

    def test_non_recruiter_cannot_delete_a_job(self):
        job = self._job(self.recruiter.id)
        db.session.commit()

        response = self.client.delete(
            f"/api/jobs/{job.id}", headers=self._token_headers(self.employee)
        )

        self.assertEqual(response.status_code, 403)
        self.assertIsNotNone(db.session.get(Job, job.id))

    def test_missing_job_returns_404(self):
        response = self.client.delete(
            "/api/jobs/999999", headers=self._token_headers(self.recruiter)
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["message"], "Job not found")

        malformed_id_response = self.client.delete(
            "/api/jobs/not-an-integer", headers=self._token_headers(self.recruiter)
        )
        self.assertEqual(malformed_id_response.status_code, 404)

    def test_related_records_are_handled_without_integrity_errors(self):
        job = self._job(self.recruiter.id)
        job_id = job.id
        application = Application(job_id=job_id, jobseeker_id=self.employee.id)
        prediction = Prediction(job_id=job_id)
        verification = Verification(job_id=job_id)
        flag_log = FlagLog(job_id=job_id, reason="Local test flag")
        notification = Notification(
            user_id=self.employee.id,
            title="Local test notification",
            message="This notification should remain after job deletion.",
            job_id=job_id,
        )
        db.session.add_all([application, prediction, verification, flag_log, notification])
        db.session.commit()
        application_id = application.id
        prediction_id = prediction.id
        verification_id = verification.id
        flag_log_id = flag_log.id
        notification_id = notification.id

        response = self.client.delete(
            f"/api/jobs/{job_id}", headers=self._token_headers(self.recruiter)
        )

        self.assertEqual(response.status_code, 200, response.get_json())
        self.assertIsNone(db.session.get(Job, job_id))
        self.assertIsNone(db.session.get(Application, application_id))
        self.assertIsNone(db.session.get(Prediction, prediction_id))
        self.assertIsNone(db.session.get(Verification, verification_id))
        self.assertIsNone(db.session.get(FlagLog, flag_log_id))
        retained_notification = db.session.get(Notification, notification_id)
        self.assertIsNotNone(retained_notification)
        self.assertIsNone(retained_notification.job_id)


if __name__ == "__main__":
    unittest.main()
