
from datetime import datetime, timezone

from app.extensions import db
from app.models.user_model import User
from app.models.company_model import Company

from app.utils.password_utils import (
    hash_password,
    verify_password,
)

from app.utils.exceptions import (
    ConflictError,
    UnauthorizedError,
)


# =====================================================
# EMAIL NORMALIZER
# =====================================================

def normalize_email(email):
    if not isinstance(email, str):
        return None

    email = email.strip().lower()
    return email or None


# =====================================================
# INPUT VALIDATION
# =====================================================

def validate_registration_data(data):
    if not isinstance(data, dict):
        raise ValueError("Invalid registration data")

    email = normalize_email(data.get("email"))
    password = data.get("password")
    name = data.get("full_name") or data.get("name")

    if not email or not password or not isinstance(name, str) or not name.strip():
        raise ValueError("Name, email and password are required")

    if not isinstance(password, str) or len(password) < 1:
        raise ValueError("Password is required")

    return email, password, name.strip()


# =====================================================
# REGISTER EMPLOYEE
# =====================================================

def register_jobseeker(data):
    email, password, name = validate_registration_data(data)

    existing = User.query.filter_by(email=email).first()

    if existing:
        raise ConflictError("Account already exists")

    try:
        user = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            phone=data.get("phone"),
            role="employee",
            is_active=True,
            is_verified=False,
            trust_score=0,
            risk_score=0,
            fraud_reports=0,
            ai_flagged=False,
            login_attempts=0,
            account_locked=False,
        )

        db.session.add(user)
        db.session.commit()

        return user

    except Exception:
        db.session.rollback()
        raise


# =====================================================
# REGISTER RECRUITER
# =====================================================

def register_recruiter(data):
    email, password, name = validate_registration_data(data)

    existing = User.query.filter_by(email=email).first()

    if existing:
        raise ConflictError("Account already exists")

    try:
        company_name = (
            data.get("company_name") or "Unknown Company"
        ).strip()

        company = Company(
            company_name=company_name,
            website_url=data.get("company_website"),
            company_domain=data.get("company_domain"),
            verification_status="pending",
            trust_score=0,
            reputation_score=0,
            risk_score=0,
        )

        db.session.add(company)
        db.session.flush()

        recruiter = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            phone=data.get("phone"),
            role="recruiter",
            company_id=company.id,
            is_active=True,
            is_verified=False,
            trust_score=0,
            risk_score=0,
            login_attempts=0,
            account_locked=False,
        )

        db.session.add(recruiter)
        db.session.commit()

        return recruiter

    except Exception:
        db.session.rollback()
        raise


# =====================================================
# LOGIN USER
# =====================================================

def login_user(data):
    if not isinstance(data, dict):
        raise UnauthorizedError("Invalid login request")

    email = normalize_email(data.get("email"))
    password = data.get("password")
    requested_role = data.get("role")

    if isinstance(requested_role, str):
        requested_role = requested_role.strip().lower()
    else:
        requested_role = None

    print("LOGIN EMAIL:", email)
    print("LOGIN ROLE:", requested_role)

    if not email or not isinstance(password, str) or not password:
        raise UnauthorizedError("Email and password required")

    user = User.query.filter_by(email=email).first()

    if not user:
        print("LOGIN FAILED: account not found")
        raise UnauthorizedError("Invalid email or password")

    stored_role = (
        user.role.strip().lower()
        if isinstance(user.role, str)
        else ""
    )

    # Role must match the account selected on the login page.
    if requested_role and stored_role != requested_role:
        print(
            "LOGIN FAILED: role mismatch",
            "requested =", requested_role,
            "stored =", stored_role,
        )
        raise UnauthorizedError("Incorrect account type")

    if not user.is_active:
        raise UnauthorizedError("Account inactive")

    if user.account_locked:
        raise UnauthorizedError("Account locked")

    # Verify the submitted password against the stored hash.
    password_valid = verify_password(
        password,
        user.password_hash,
    )

    if not password_valid:
        user.login_attempts = (user.login_attempts or 0) + 1

        if user.login_attempts >= 5:
            user.account_locked = True

        db.session.commit()

        print("LOGIN FAILED: invalid password")
        raise UnauthorizedError("Invalid email or password")

    # Successful login.
    user.login_attempts = 0
    user.account_locked = False
    user.last_login = datetime.now(timezone.utc)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise

    print(
        "LOGIN SUCCESS:",
        user.email,
        "ROLE:",
        stored_role,
    )

    return user
