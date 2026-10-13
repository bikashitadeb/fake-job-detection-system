import re


# ----------------------------------------
# Suspicious Keywords
# ----------------------------------------

SUSPICIOUS_KEYWORDS = [
    "pay registration fee",
    "registration fee",
    "security deposit",
    "pay money",
    "earn instantly",
    "quick money",
    "make money fast",
    "guaranteed income",
    "no experience required",
    "work from home and earn",
    "whatsapp me",
    "telegram",
    "limited seats",
    "urgent hiring",
    "easy income",
]


# ----------------------------------------
# Salary Analysis
# ----------------------------------------

def check_salary(title, salary):
    """
    Detect unrealistic salary claims.
    """

    risk = 0
    reasons = []

    if not salary:
        return risk, reasons


    salary_text = str(salary).lower()


    # Example:
    # Data Entry - 5 lakh/month

    high_salary_patterns = [
        r"5\s*lakh",
        r"10\s*lakh",
        r"500000",
        r"1000000",
    ]


    for pattern in high_salary_patterns:

        if re.search(pattern, salary_text):

            risk += 30

            reasons.append(
                "Unrealistic salary mentioned"
            )

            break


    return risk, reasons



# ----------------------------------------
# Keyword Detection
# ----------------------------------------

def check_keywords(description):

    risk = 0
    reasons = []


    text = description.lower()


    for keyword in SUSPICIOUS_KEYWORDS:

        if keyword in text:

            risk += 10

            reasons.append(
                f"Suspicious keyword detected: {keyword}"
            )


    return risk, reasons



# ----------------------------------------
# Description Length Check
# ----------------------------------------

def check_description_length(description):

    risk = 0
    reasons = []


    if len(description.split()) < 20:

        risk += 15

        reasons.append(
            "Job description is too short"
        )


    return risk, reasons



# ----------------------------------------
# Complete Rule Engine
# ----------------------------------------

def analyze_job(job):

    total_score = 0

    reasons = []


    title = job.get("title", "")

    description = job.get(
        "description",
        ""
    )

    salary = job.get(
        "salary",
        ""
    )


    # Salary check

    score, result = check_salary(
        title,
        salary
    )

    total_score += score

    reasons.extend(result)



    # Keyword check

    score, result = check_keywords(
        description
    )

    total_score += score

    reasons.extend(result)



    # Description check

    score, result = check_description_length(
        description
    )

    total_score += score

    reasons.extend(result)



    return {
        "rule_score": min(total_score, 100),
        "reasons": reasons
    }