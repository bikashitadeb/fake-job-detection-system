from pipeline import run_ai_pipeline



job = {

    "title":
    "Data Entry Work From Home",

    "description":
    """
    Earn 5 lakh per month from home.
    No experience required.
    Pay registration fee to join.
    Contact WhatsApp immediately.
    """,

    "salary":
    "5 lakh/month",

    "company_verified": False,

    "email_verified": False,

    "linkedin_verified": False

}


result = run_ai_pipeline(job)


print(result)