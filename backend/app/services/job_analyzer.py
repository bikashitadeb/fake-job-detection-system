SUSPICIOUS_KEYWORDS = [

    "pay registration fee",

    "earn money fast",

    "guaranteed income",

    "no experience required",

    "easy money",

    "work from home earn",

    "investment required",

    "send money"

]



def analyze_job(description):


    description = description.lower()


    warnings=[]


    for keyword in SUSPICIOUS_KEYWORDS:

        if keyword in description:

            warnings.append(keyword)



    risk_score = len(warnings) * 15



    if risk_score > 100:

        risk_score = 100



    return {


        "risk_score": risk_score,


        "warnings": warnings,


        "safe":

        len(warnings)==0


    }