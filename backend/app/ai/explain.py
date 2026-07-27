def generate_explanation(
        ml_prediction,
        ml_confidence,
        rule_reasons,
        trust_score,
        company_verified=True,
        email_verified=True,
        linkedin_verified=True
):
    """
    Generate explainable AI reasons
    for fake job detection.
    """

    reasons = []


    # -----------------------------
    # ML Explanation
    # -----------------------------

    confidence_percentage = round(
        ml_confidence * 100,
        2
    )


    if ml_prediction == 0:

        reasons.append(
            f"✓ ML model predicts genuine job with {confidence_percentage}% confidence"
        )

    else:

        reasons.append(
            f"✗ ML model predicts suspicious job with {confidence_percentage}% confidence"
        )


    # -----------------------------
    # Company Verification
    # -----------------------------

    if company_verified:

        reasons.append(
            "✓ Company verification passed"
        )

    else:

        reasons.append(
            "✗ Company verification failed"
        )


    # -----------------------------
    # Email Verification
    # -----------------------------

    if email_verified:

        reasons.append(
            "✓ Official company email verified"
        )

    else:

        reasons.append(
            "✗ Recruiter email verification failed"
        )


    # -----------------------------
    # LinkedIn Verification
    # -----------------------------

    if linkedin_verified:

        reasons.append(
            "✓ LinkedIn profile/company page available"
        )

    else:

        reasons.append(
            "✗ LinkedIn verification failed"
        )


    # -----------------------------
    # Rule Engine Reasons
    # -----------------------------

    if rule_reasons:

        for reason in rule_reasons:

            reasons.append(
                f"✗ {reason}"
            )

    else:

        reasons.append(
            "✓ No suspicious keywords detected"
        )


    # -----------------------------
    # Final Status
    # -----------------------------

    if trust_score >= 80:

        status = "Verified"

    elif trust_score >= 50:

        status = "Needs Review"

    else:

        status = "Suspicious"


    return {

        "status": status,

        "trust_score": trust_score,

        "explanation": reasons

    }