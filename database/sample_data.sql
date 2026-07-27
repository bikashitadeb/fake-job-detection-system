-- ============================================================================
-- SAMPLE DATA
-- Insert order respects FK dependencies:
-- users -> companies -> recruiters -> admins -> jobs -> applications
--       -> saved_jobs -> predictions -> reports
-- ============================================================================

USE fake_job_detection_db;

-- ----------------------------------------------------------------------------
-- 1. USERS  (3 jobseekers, 2 recruiters, 1 admin -> 6 base identities)
-- ----------------------------------------------------------------------------
INSERT INTO users (user_id, full_name, email, password_hash, role, phone, is_active, email_verified) VALUES
(1, 'Ananya Sharma',   'ananya.sharma@gmail.com',   '$2b$12$Kx1z9examplehash0001', 'jobseeker', '9876543210', TRUE, TRUE),
(2, 'Rohan Mehta',     'rohan.mehta@gmail.com',     '$2b$12$Kx1z9examplehash0002', 'jobseeker', '9876543211', TRUE, TRUE),
(3, 'Priya Nair',      'priya.nair@gmail.com',      '$2b$12$Kx1z9examplehash0003', 'jobseeker', '9876543212', TRUE, FALSE),
(4, 'Karan Verma',     'karan.verma@infosys.com',   '$2b$12$Kx1z9examplehash0004', 'recruiter', '9876543213', TRUE, TRUE),
(5, 'Sneha Reddy',     'sneha.reddy@quickhireco.in','$2b$12$Kx1z9examplehash0005', 'recruiter', '9876543214', TRUE, TRUE),
(6, 'Admin User',      'admin@platform.com',        '$2b$12$Kx1z9examplehash0006', 'admin',     '9876543215', TRUE, TRUE);

-- ----------------------------------------------------------------------------
-- 2. COMPANIES  (1 verified legitimate company, 1 unverified/suspicious one)
-- ----------------------------------------------------------------------------
INSERT INTO companies (company_id, company_name, company_domain, industry, company_size, website_url, headquarters_location, registration_number, is_verified, verification_source) VALUES
(1, 'Infosys Limited',        'infosys.com',      'Information Technology', '1000+', 'https://www.infosys.com', 'Bengaluru, India', 'L85110KA1981PLC013115', TRUE,  'Admin Manual Review'),
(2, 'QuickHire Consultancy',  'quickhireco.in',   'Recruitment Agency',      '11-50', 'https://quickhireco.in', 'Delhi, India',      NULL,                    FALSE, NULL);

-- ----------------------------------------------------------------------------
-- 3. RECRUITERS  (1:1 with users where role='recruiter')
-- ----------------------------------------------------------------------------
INSERT INTO recruiters (recruiter_id, user_id, company_id, designation, work_email, is_verified_recruiter, linkedin_url) VALUES
(1, 4, 1, 'Senior Talent Acquisition Specialist', 'karan.verma@infosys.com',    TRUE,  'https://linkedin.com/in/karanverma'),
(2, 5, 2, 'HR Manager',                           'sneha.reddy@quickhireco.in', FALSE, NULL);

-- ----------------------------------------------------------------------------
-- 4. ADMINS  (1:1 with users where role='admin')
-- ----------------------------------------------------------------------------
INSERT INTO admins (admin_id, user_id, access_level) VALUES
(1, 6, 'super_admin');

-- ----------------------------------------------------------------------------
-- 5. JOBS  (2 from verified company, 2 from unverified company)
-- ----------------------------------------------------------------------------
INSERT INTO jobs (job_id, recruiter_id, company_id, title, description, requirements, responsibilities, employment_type, location, salary_min, salary_max, experience_required, application_deadline, status, verified_by_admin_id, views_count) VALUES
(1, 1, 1, 'Software Engineer - Backend',
   'Infosys is hiring backend engineers to work on large-scale enterprise systems using Java and Spring Boot.',
   'B.E./B.Tech in CS or related field, strong Java fundamentals, understanding of REST APIs.',
   'Design, develop and maintain backend services; collaborate with cross-functional teams.',
   'full_time', 'Bengaluru, India', 600000.00, 1200000.00, '0-2 years', '2026-09-30',
   'verified', 1, 245),

(2, 1, 1, 'Data Analyst Intern',
   'Internship opportunity for students to work with real business data and analytics dashboards.',
   'Currently pursuing B.E./B.Tech/BCA, basic SQL and Excel knowledge.',
   'Assist in building reports, cleaning data, and supporting the analytics team.',
   'internship', 'Pune, India', 15000.00, 25000.00, '0 years', '2026-08-15',
   'verified', 1, 89),

(3, 2, 2, 'Work From Home Data Entry - Earn 80000/month',
   'No experience needed! Just fill simple forms daily and earn guaranteed monthly income. Registration fee required to start.',
   'No qualification needed. Must pay a one-time registration fee of Rs. 999.',
   'Fill online forms, no targets, flexible hours.',
   'remote', 'Work From Home', 80000.00, 80000.00, '0 years', '2026-12-31',
   'fake', NULL, 512),

(4, 2, 2, 'Urgent Hiring - Customer Support Executive',
   'Immediate joining, huge incentives, salary credited daily in cash. Limited seats available, apply now.',
   'Any graduate. No interview process, direct joining.',
   'Handle customer calls, no fixed target.',
   'full_time', 'Delhi, India', 30000.00, 45000.00, '0-1 years', '2026-08-01',
   'suspicious', NULL, 178);

-- ----------------------------------------------------------------------------
-- 6. APPLICATIONS
-- ----------------------------------------------------------------------------
INSERT INTO applications (application_id, job_id, user_id, resume_url, cover_letter, status) VALUES
(1, 1, 1, '/uploads/resumes/ananya_resume.pdf', 'Excited to contribute to Infosys backend systems.', 'shortlisted'),
(2, 1, 2, '/uploads/resumes/rohan_resume.pdf',  'I have strong Java and Spring Boot experience.',     'applied'),
(3, 2, 3, '/uploads/resumes/priya_resume.pdf',  'Keen to start my career in data analytics.',         'under_review'),
(4, 3, 2, '/uploads/resumes/rohan_resume.pdf',  NULL,                                                  'applied');

-- ----------------------------------------------------------------------------
-- 7. SAVED_JOBS
-- ----------------------------------------------------------------------------
INSERT INTO saved_jobs (saved_id, user_id, job_id) VALUES
(1, 1, 2),
(2, 3, 1),
(3, 2, 4);

-- ----------------------------------------------------------------------------
-- 8. PREDICTIONS  (ML + rule engine audit trail per job)
-- ----------------------------------------------------------------------------
INSERT INTO predictions (prediction_id, job_id, ml_label, ml_confidence, rule_based_score, final_verdict, model_version, flagged_reasons) VALUES
(1, 1, 'real', 0.9421, 0.95, 'verified',
   'tfidf_nb_v1', JSON_ARRAY()),

(2, 2, 'real', 0.8890, 0.90, 'verified',
   'tfidf_nb_v1', JSON_ARRAY()),

(3, 3, 'fake', 0.9765, 0.10, 'fake',
   'tfidf_nb_v1', JSON_ARRAY('registration_fee_requested', 'unverified_company', 'unrealistic_salary_promise')),

(4, 4, 'fake', 0.6120, 0.45, 'suspicious',
   'tfidf_nb_v1', JSON_ARRAY('urgency_language_detected', 'no_interview_process', 'unverified_company'));

-- ----------------------------------------------------------------------------
-- 9. REPORTS  (community-flagged jobs)
-- ----------------------------------------------------------------------------
INSERT INTO reports (report_id, job_id, reported_by, reason, description, status, reviewed_by, resolved_at) VALUES
(1, 3, 2, 'fake_job', 'Asked me to pay a registration fee before starting. Classic scam pattern.', 'action_taken', 1, NOW()),
(2, 4, 3, 'scam',     'No interview at all, felt very suspicious, asked for personal bank details.', 'pending', NULL, NULL);
