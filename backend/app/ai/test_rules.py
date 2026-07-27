from rule_engine import analyze_job


job = {

    "title": "Data Entry Job",

    "description": """
    Earn instant money from home.
    No experience required.
    Pay registration fee to join.
    Contact on WhatsApp.
    """,

    "salary": "5 Lakh/month"

}


result = analyze_job(job)

print(result)