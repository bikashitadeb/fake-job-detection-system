from flask import Blueprint, jsonify, request

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)


from app.extensions import db

from app.models.job_model import Job

from app.models.application_model import Application



job_bp = Blueprint(

    "jobs",

    __name__,

    url_prefix="/api/jobs"

)





# =====================================
# GET ALL JOBS
# =====================================


@job_bp.route(

    "",

    methods=["GET"]

)

@jwt_required()

def get_jobs():


    jobs = Job.query.all()



    return jsonify({


        "jobs":[

            job.to_dict()

            for job in jobs

        ]



    }),200







# =====================================
# VERIFY JOB USING ML
# =====================================


@job_bp.route(

    "/<int:job_id>/verify",

    methods=["POST"]

)

@jwt_required()

def verify_job(job_id):


    job = Job.query.get(job_id)



    if not job:


        return jsonify({

            "message":"Job not found"

        }),404





    # TEMP ML RESULT
    # Later connect your ML model here


    score = 85



    job.trust_score = score



    if score >= 70:


        job.status = "verified"



    else:


        job.status = "fake"





    db.session.commit()



    return jsonify({


        "message":"Verification completed",


        "trust_score":score,


        "status":job.status



    }),200







# =====================================
# APPLY FOR JOB
# =====================================


@job_bp.route(

    "/<int:job_id>/apply",

    methods=["POST"]

)

@jwt_required()

def apply_job(job_id):


    user_id = get_jwt_identity()



    job = Job.query.get(job_id)




    if not job:


        return jsonify({

            "message":"Job not found"

        }),404






    existing = Application.query.filter_by(

        job_id=job_id,

        user_id=user_id

    ).first()





    if existing:


        return jsonify({

            "message":"Already applied"

        }),400






    application = Application(

        job_id=job_id,

        user_id=user_id,

        status="pending"

    )





    db.session.add(application)


    db.session.commit()





    return jsonify({


        "message":

        "Application submitted"



    }),201
# =====================================
# CREATE JOB (RECRUITER)
# =====================================


@job_bp.route(

    "/create",

    methods=["POST"]

)

@jwt_required()

def create_job():


    recruiter_id = get_jwt_identity()



    data = request.get_json()



    recruiter = User.query.get(

        recruiter_id

    )



    if not recruiter:


        return jsonify({

            "message":"Recruiter not found"

        }),404





    if recruiter.role != "recruiter":


        return jsonify({

            "message":"Only recruiters can post jobs"

        }),403






    job = Job(


        title=data.get("title"),


        description=data.get("description"),


        company_name=data.get("company_name"),


        location=data.get("location"),


        salary=data.get("salary"),


        recruiter_id=recruiter.id,


        trust_score=0,


        status="pending"


    )





    db.session.add(job)


    db.session.commit()





    return jsonify({


        "message":"Job posted successfully",


        "job":job.to_dict()


    }),201