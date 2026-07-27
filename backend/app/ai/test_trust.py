from trust_score import calculate_trust_score


result = calculate_trust_score(
    ml_confidence=0.96,
    rule_score=10,
    company_score=100,
    email_score=100,
    linkedin_score=100
)


print(result)