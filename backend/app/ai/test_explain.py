from explain import generate_explanation


result = generate_explanation(

    ml_prediction=0,

    ml_confidence=0.96,

    rule_reasons=[],

    trust_score=94,

    company_verified=True,

    email_verified=True,

    linkedin_verified=True

)


print(result)