# app/services/linkedin_verification.py


import re







# =====================================================
# VERIFIED COMPANY KNOWLEDGE BASE
# =====================================================


KNOWN_COMPANIES = {


    "google":

    {

        "name":"Google",

        "linkedin":
        "https://www.linkedin.com/company/google/",

        "score":98

    },



    "microsoft":

    {

        "name":"Microsoft",

        "linkedin":
        "https://www.linkedin.com/company/microsoft/",

        "score":98

    },



    "amazon":

    {

        "name":"Amazon",

        "linkedin":
        "https://www.linkedin.com/company/amazon/",

        "score":97

    },



    "infosys":

    {

        "name":"Infosys",

        "linkedin":
        "https://www.linkedin.com/company/infosys/",

        "score":95

    },



    "tcs":

    {

        "name":"TCS",

        "linkedin":
        "https://www.linkedin.com/company/tata-consultancy-services/",

        "score":95

    },



    "ibm":

    {

        "name":"IBM",

        "linkedin":
        "https://www.linkedin.com/company/ibm/",

        "score":96

    },



    "accenture":

    {

        "name":"Accenture",

        "linkedin":
        "https://www.linkedin.com/company/accenture/",

        "score":95

    },



    "deloitte":

    {

        "name":"Deloitte",

        "linkedin":
        "https://www.linkedin.com/company/deloitte/",

        "score":95

    },



    "wipro":

    {

        "name":"Wipro",

        "linkedin":
        "https://www.linkedin.com/company/wipro/",

        "score":94

    }


}









# =====================================================
# TEXT NORMALIZER
# =====================================================


def normalize_company(name):


    return re.sub(

        r"[^a-z0-9]",

        "",

        name.lower()

    )









# =====================================================
# COMPANY VERIFICATION ENGINE
# =====================================================


def verify_company(company_name):



    if not company_name:


        return {


            "verified":False,


            "company":None,


            "linkedin_url":None,


            "score":0,


            "confidence":0,


            "risk_level":"HIGH",


            "reason":

            "Company name missing"


        }








    normalized = normalize_company(

        company_name

    )








    # =====================================
    # SEARCH COMPANY DATABASE
    # =====================================


    for key,value in KNOWN_COMPANIES.items():



        if normalized == normalize_company(key):



            score=value["score"]






            return {



                "verified":True,



                "company":

                value["name"],




                "linkedin_url":

                value["linkedin"],




                "score":

                score,




                "confidence":

                score,




                "risk_level":

                "LOW",




                "reason":

                "Company verified successfully"




            }












    # =====================================
    # UNKNOWN COMPANY ANALYSIS
    # =====================================


    suspicious_words=[


        "limited",

        "global",

        "solution",

        "investment",

        "network",

        "online",

        "crypto"

    ]



    risk_points=0



    for word in suspicious_words:


        if word in normalized:


            risk_points +=10







    trust_score=max(

        40-risk_points,

        10

    )







    return {



        "verified":False,



        "company":

        company_name,



        "linkedin_url":

        None,



        "score":

        trust_score,



        "confidence":

        60,



        "risk_level":

        (

            "MEDIUM"

            if trust_score >=30

            else

            "HIGH"

        ),



        "reason":

        "Company could not be verified in trusted database"



    }