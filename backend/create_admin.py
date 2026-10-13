
from getpass import getpass

from app import create_app
from app.extensions import db
from app.models.user_model import User
from app.utils.password_utils import hash_password


ADMIN_EMAIL = "admin@fakeguard.local"
ADMIN_NAME = "FakeGuard Administrator"


def main():
    app = create_app()

    with app.app_context():
        existing = User.query.filter_by(
            email=ADMIN_EMAIL
        ).first()

        if existing:
            if existing.role != "admin":
                print(
                    f"STOP: {ADMIN_EMAIL} already exists "
                    f"with role '{existing.role}'."
                )
                print("No changes were made.")
                return

            print("The admin account already exists.")
            print("Email:", existing.email)
            print("Role:", existing.role)
            print("Active:", existing.is_active)
            print("No duplicate account was created.")
            return

        password = getpass("Create admin password: ")
        confirm_password = getpass("Confirm admin password: ")

        if len(password) < 12:
            print("Use a password with at least 12 characters.")
            return

        if password != confirm_password:
            print("Passwords do not match.")
            return

        admin = User(
            name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password_hash=hash_password(password),
            role="admin",
            is_active=True,
            is_verified=True,
            company_id=None,
            login_attempts=0,
            account_locked=False,
            trust_score=0,
            risk_score=0,
            fraud_reports=0,
            ai_flagged=False,
        )

        try:
            db.session.add(admin)
            db.session.commit()

            print("\nAdmin account created successfully.")
            print("Email:", ADMIN_EMAIL)
            print("Role:", admin.role)
            print("Account ID:", admin.id)
            print("Password was stored as a hash.")

        except Exception:
            db.session.rollback()
            print(
                "Admin creation failed. "
                "Check the backend error and database connection."
            )
            raise


if __name__ == "__main__":
    main()
