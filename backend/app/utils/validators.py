import re


def validate_registration_payload(data):
    errors = {}

    if not data.get("name"):
        errors["name"] = "Name is required."

    email = data.get("email", "").strip()
    if not email:
        errors["email"] = "Email is required."
    elif not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        errors["email"] = "Invalid email address."

    password = data.get("password", "")
    valid, message = validate_password_strength(password)
    if not valid:
        errors["password"] = message

    role = data.get("role", "jobseeker")
    if role not in ["jobseeker", "recruiter", "admin"]:
        errors["role"] = "Invalid role."

    return errors


def validate_login_payload(data):
    errors = {}

    if not data.get("email"):
        errors["email"] = "Email is required."

    if not data.get("password"):
        errors["password"] = "Password is required."

    return errors


def validate_password_strength(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."

    if not re.search(r"\d", password):
        return False, "Password must contain at least one number."

    return True, "Valid"


def validate_application_payload(data):
    errors = {}

    if not data.get("job_id"):
        errors["job_id"] = "Job ID is required."

    if not data.get("cover_letter"):
        errors["cover_letter"] = "Cover letter is required."

    return errors


def paginate_args(args, default_page_size=10, max_page_size=100):
    page = int(args.get("page", 1))
    per_page = int(args.get("per_page", default_page_size))

    if per_page > max_page_size:
        per_page = max_page_size

    return page, per_page