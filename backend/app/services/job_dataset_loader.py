# app/services/dataset_loader.py


import os

import pandas as pd






# =====================================================
# DATASET CONFIGURATION
# =====================================================


BASE_DIR = os.path.dirname(

    os.path.dirname(

        os.path.abspath(__file__)

    )

)



CSV_PATH = os.path.join(

    BASE_DIR,

    "dataset",

    "fake_job_postings.csv"

)









# =====================================================
# LOAD DATASET
# =====================================================


def load_dataset_jobs():


    try:



        if not os.path.exists(CSV_PATH):


            raise FileNotFoundError(

                "Fake job dataset not found"

            )







        df = pd.read_csv(

            CSV_PATH

        )







        # Replace empty values


        df = df.fillna("")







        jobs = []






        for _, row in df.iterrows():



            job = {



                "title":

                str(

                    row.get(

                        "title",

                        ""

                    )

                ),




                "description":

                str(

                    row.get(

                        "description",

                        ""

                    )

                ),




                "company":

                str(

                    row.get(

                        "company",

                        "Unknown Company"

                    )

                ),




                "location":

                str(

                    row.get(

                        "location",

                        ""

                    )

                ),




                "requirements":

                str(

                    row.get(

                        "requirements",

                        ""

                    )

                ),





                "salary":

                str(

                    row.get(

                        "salary_range",

                        ""

                    )

                ),






                "employment_type":

                str(

                    row.get(

                        "employment_type",

                        ""

                    )

                ),






                "industry":

                str(

                    row.get(

                        "industry",

                        ""

                    )

                ),





                "experience":

                str(

                    row.get(

                        "required_experience",

                        ""

                    )

                ),





                "is_fake":

                int(

                    row.get(

                        "fraudulent",

                        0

                    )

                )



            }







            jobs.append(

                job

            )







        return jobs








    except Exception as e:



        print(

            "DATASET LOAD ERROR:",

            e

        )



        return []









# =====================================================
# DATASET INFORMATION
# =====================================================


def dataset_statistics():


    try:



        df = pd.read_csv(

            CSV_PATH

        )






        return {



            "total_records":

            len(df),




            "fake_jobs":

            int(

                df["fraudulent"].sum()

            )

            if "fraudulent" in df.columns

            else 0,






            "real_jobs":

            int(

                len(df)

                -

                df["fraudulent"].sum()

            )

            if "fraudulent" in df.columns

            else 0,






            "columns":

            list(

                df.columns

            )



        }






    except Exception as e:



        return {



            "error":

            str(e)

        }