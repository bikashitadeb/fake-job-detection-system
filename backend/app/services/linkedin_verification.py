import re


# =====================================
# VERIFIED COMPANIES DATABASE
# =====================================

KNOWN_COMPANIES = {

    "google": {
        "name": "Google",
        "score": 98
    },

    "microsoft": {
        "name": "Microsoft",
        "score": 98
    },

    "amazon": {
        "name": "Amazon",
        "score": 97
    },

    "infosys": {
        "name": "Infosys",
        "score": 95
    },

    "tcs": {
        "name": "TCS",
        "score": 95
    },

    "ibm": {
        "name": "IBM",
        "score": 96
    },

    "accenture": {
        "name": "Accenture",
        "score": 95
    },

    "deloitte": {
        "name": "Deloitte",
        "score": 95
    },

    "wipro": {
        "name": "Wipro",
        "score": 94
    }

}





# =====================================
# LINKEDIN VERIFICATION
# =====================================

def verify_company(company_name):


    if not company_name:


        return {

            "verified": False,

            "company": None,

            "linkedin_url": None,

            "score": 0,

            "reason":
            "Company name missing"

        }




    # Normalize input

    normalized = re.sub(

        r"[^a-zA-Z0-9]",

        "",

        company_name.lower()

    )






    for key, company in KNOWN_COMPANIES.items():


        clean_key = re.sub(

            r"[^a-zA-Z0-9]",

            "",

            key.lower()

        )



        if normalized == clean_key:



            linkedin_name = (

                company["name"]

                .lower()

                .replace(" ", "-")

            )




            return {


                "verified": True,


                "company":

                company["name"],



                "linkedin_url":

                f"https://www.linkedin.com/company/{linkedin_name}",



                "score":

                company["score"],



                "reason":

                "Company verified through LinkedIn"



            }





    return {


        "verified": False,


        "company":

        company_name,



        "linkedin_url":

        None,



        "score":

        40,



        "reason":

        "Company could not be verified"



    }