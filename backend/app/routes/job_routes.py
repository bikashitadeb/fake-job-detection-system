from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.extensions import db

from app.models.job_model import Job
from app.models.user_model import User


from app.services.linkedin_verification import (
    verify_company
)

from app.services.ai_verification import (
    predict_fake_job
)





# =====================================================
# BLUEPRINT
# =====================================================


job_bp = Blueprint(

    "jobs",

    __name__,

    url_prefix="/api/jobs"

)







# =====================================================
# RESPONSE FORMAT
# =====================================================


def api_response(

    success=True,

    message="",

    data=None,

    status=200

):

    return jsonify({

        "success": success,

        "message": message,

        "data": data

    }), status









# =====================================================
# GET ALL JOBS
# EMPLOYEE DASHBOARD
# =====================================================


@job_bp.route(

    "",

    methods=["GET"]

)

def get_jobs():


    try:



        search = request.args.get(

            "search",

            ""

        )



        page = int(

            request.args.get(

                "page",

                1

            )

        )



        limit = int(

            request.args.get(

                "limit",

                12

            )

        )






        query = Job.query.filter_by(

            is_active=True

        )







        if search:


            query = query.filter(

                Job.title.ilike(

                    f"%{search}%"

                )

            )







        jobs = query.order_by(

            Job.created_at.desc()

        ).paginate(

            page=page,

            per_page=limit,

            error_out=False

        )







        return api_response(



            True,

            "Jobs loaded successfully",



            {


                "jobs":[

                    job.to_dict()

                    for job in jobs.items

                ],



                "page":page,


                "total":jobs.total,


                "pages":jobs.pages


            }

        )









    except Exception as e:



        print(

            "GET JOB ERROR:",

            e

        )



        return api_response(

            False,

            str(e),

            status=500

        )













# =====================================================
# GET SINGLE JOB
# =====================================================


@job_bp.route(

    "/<int:id>",

    methods=["GET"]

)

def get_job(id):


    try:



        job = Job.query.get(id)




        if not job:


            return api_response(

                False,

                "Job not found",

                status=404

            )






        # increase views

        job.views_count += 1


        db.session.commit()





        return api_response(


            True,


            "Job details loaded",



            {


                "job":

                job.to_dict()


            }


        )








    except Exception as e:



        db.session.rollback()



        return api_response(

            False,

            str(e),

            status=500

        )












# =====================================================
# CREATE JOB
# RECRUITER ONLY
# AI + LINKEDIN
# =====================================================



@job_bp.route(

    "",

    methods=["POST"]

)

@jwt_required()

def create_job():


    try:



        user_id = int(

            get_jwt_identity()

        )




        user = User.query.get(

            user_id

        )







        if not user:


            return api_response(

                False,

                "User not found",

                status=404

            )






        if user.role != "recruiter":



            return api_response(

                False,

                "Only recruiters can post jobs",

                status=403

            )







        data = request.get_json() or {}







        title = data.get(

            "title"

        )



        description = data.get(

            "description"

        )






        if not title or not description:


            return api_response(

                False,

                "Title and description required",

                status=400

            )










        company_name = (

            data.get("company")

            or

            data.get("company_name")

            or

            "Unknown Company"

        )









        # =====================================
        # DUPLICATE CHECK
        # =====================================


        duplicate = Job.query.filter_by(

            title=title,

            recruiter_id=user.id

        ).first()



        if duplicate:


            return api_response(

                False,

                "Similar job already exists",

                status=400

            )









        # =====================================
        # LINKEDIN VERIFICATION
        # =====================================



        try:


            linkedin_result = verify_company(

                company_name

            )


        except Exception as e:



            print(

                "LINKEDIN ERROR:",

                e

            )



            linkedin_result = {


                "verified":False,


                "score":0,


                "linkedin_url":None


            }









        # =====================================
        # AI FAKE JOB DETECTION
        # =====================================



        try:



            ai_result = predict_fake_job({


                "title":title,


                "company":company_name,


                "description":description,


                "requirements":

                data.get(

                    "requirements",

                    ""

                )


            })





        except Exception as e:



            print(

                "AI ERROR:",

                e

            )



            ai_result = {


                "is_fake":False,


                "fake_probability":0,


                "trust_score":50,


                "confidence":50


            }









        # =====================================
        # TRUST SCORE
        # =====================================



        trust_score = (

            ai_result.get(

                "trust_score",

                50

            )

            *

            0.7

            +

            linkedin_result.get(

                "score",

                0

            )

            *

            0.3

        )









        job = Job(



            title=title,



            description=description,



            location=data.get(

                "location",

                "Remote"

            ),



            salary=data.get(

                "salary"

            ),



            requirements=data.get(

                "requirements"

            ),



            recruiter_id=user.id,






            is_fake_predicted=

            ai_result.get(

                "is_fake",

                False

            ),



            fake_probability=

            ai_result.get(

                "fake_probability",

                0

            ),



            trust_score=round(

                trust_score,

                2

            ),






            ai_confidence=

            ai_result.get(

                "confidence",

                0

            ),







            linkedin_verified=

            linkedin_result.get(

                "verified",

                False

            ),



            linkedin_url=

            linkedin_result.get(

                "linkedin_url"

            ),



            company_verified=

            linkedin_result.get(

                "verified",

                False

            ),





            status=(

                "verified"

                if trust_score >=70

                else

                "pending"

            )



        )







        db.session.add(job)

        db.session.commit()









        return api_response(



            True,


            "Job posted successfully",



            {


                "job":

                job.to_dict(),



                "ai_result":

                ai_result,



                "linkedin_result":

                linkedin_result



            },



            201


        )









    except Exception as e:



        db.session.rollback()



        print(

            "CREATE JOB ERROR:",

            e

        )



        return api_response(

            False,

            str(e),

            status=500

        )












# =====================================================
# RECRUITER OWN JOBS
# =====================================================


@job_bp.route(

    "/my-jobs",

    methods=["GET"]

)

@jwt_required()

def my_jobs():



    try:



        user_id = int(

            get_jwt_identity()

        )




        jobs = Job.query.filter_by(

            recruiter_id=user_id

        ).order_by(

            Job.created_at.desc()

        ).all()






        return api_response(



            True,


            "Recruiter jobs loaded",



            {


                "jobs":[

                    job.to_dict()

                    for job in jobs

                ]


            }


        )







    except Exception as e:



        print(

            "MY JOB ERROR:",

            e

        )



        return api_response(

            False,

            str(e),

            status=500

        )