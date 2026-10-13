def calculate_trust_score(
        ml_confidence,
        rule_score,
        company_score=100,
        email_score=100,
        linkedin_score=100
):

    """
    Calculate final job trust score.

    Parameters:
    ml_confidence : float (0-1)
    rule_score    : float (0-100)
    company_score : float (0-100)
    email_score   : float (0-100)
    linkedin_score: float (0-100)

    Returns:
    trust score and risk level
    """


    # Convert ML confidence to percentage

    ml_score = ml_confidence * 100


    # Higher rule score means higher risk
    # so reverse it

    rule_trust = 100 - rule_score


    trust_score = (

        (ml_score * 0.40)
        +
        (company_score * 0.20)
        +
        (email_score * 0.15)
        +
        (linkedin_score * 0.15)
        +
        (rule_trust * 0.10)

    )


    trust_score = round(
        max(0, min(trust_score, 100)),
        2
    )


    # Risk classification

    if trust_score >= 80:
        risk_level = "Low Risk"

    elif trust_score >= 50:
        risk_level = "Medium Risk"

    else:
        risk_level = "High Risk"


    return {
        "trust_score": trust_score,
        "risk_level": risk_level
    }