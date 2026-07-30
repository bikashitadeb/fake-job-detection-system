# app/services/job_risk_analysis.py


import re






# =====================================================
# SUSPICIOUS JOB PATTERNS
# =====================================================


SUSPICIOUS_PATTERNS = {


    "payment_request": {

        "keywords":[

            "pay registration fee",

            "registration fee",

            "pay security deposit",

            "send money",

            "processing fee",

            "training fee"

        ],

        "weight":30

    },



    "unrealistic_income": {


        "keywords":[

            "earn money fast",

            "guaranteed income",

            "easy money",

            "instant income",

            "earn thousands daily"

        ],

        "weight":25

    },




    "fake_remote_job": {


        "keywords":[

            "work from home earn",

            "no experience required",

            "easy online job",

            "part time income"

        ],

        "weight":15

    },




    "investment_scam": {


        "keywords":[

            "investment required",

            "pay investment",

            "join package",

            "buy course"

        ],

        "weight":30

    },




    "communication_risk": {


        "keywords":[

            "whatsapp only",

            "telegram interview",

            "send otp",

            "bank details"

        ],

        "weight":35

    }

}









# =====================================================
# TEXT CLEANING
# =====================================================


def clean_text(text):


    text = text.lower()


    text = re.sub(

        r"[^a-z0-9\s]",

        "",

        text

    )


    return text











# =====================================================
# JOB FRAUD ANALYSIS
# =====================================================


def analyze_job(description):


    try:



        description = clean_text(

            description or ""

        )





        warnings = []

        detected_categories = []



        risk_score = 0






        for category, data in SUSPICIOUS_PATTERNS.items():



            for keyword in data["keywords"]:



                if keyword in description:



                    warnings.append(

                        keyword

                    )



                    detected_categories.append(

                        category

                    )



                    risk_score += data["weight"]



                    break







        risk_score = min(

            risk_score,

            100

        )








        # Risk Classification


        if risk_score >=75:


            risk_level="HIGH"



        elif risk_score >=40:


            risk_level="MEDIUM"



        else:


            risk_level="LOW"









        safe = risk_score < 40







        if warnings:


            explanation = (

                "Suspicious patterns detected: "

                +

                ", ".join(warnings)

            )


        else:


            explanation = (

                "No major fraud indicators detected"

            )










        return {



            "safe":safe,



            "risk_score":risk_score,



            "risk_level":risk_level,



            "warnings":warnings,



            "categories":list(

                set(detected_categories)

            ),



            "keyword_count":len(warnings),



            "ai_explanation":explanation



        }








    except Exception as e:



        return {



            "safe":True,



            "risk_score":0,



            "risk_level":"UNKNOWN",



            "warnings":[],



            "categories":[],


            "keyword_count":0,



            "ai_explanation":

            "Risk analysis unavailable"



        }