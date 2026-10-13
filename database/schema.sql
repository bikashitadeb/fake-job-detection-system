-- ============================================================================
-- AI-Powered Fake Job Detection, Verification and Recruitment Intelligence
-- Production-Ready MySQL Schema (3NF)
-- Engine: InnoDB | Charset: utf8mb4
-- ============================================================================

DROP DATABASE IF EXISTS fake_job_detection_db;
CREATE DATABASE fake_job_detection_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE fake_job_detection_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- 1. USERS
-- Base authentication + identity table for EVERY person in the system
-- (jobseeker / recruiter / admin). Role-specific data is NOT stored here —
-- it lives in Recruiters / Admins to avoid nullable columns (3NF: every
-- non-key attribute here depends only on user_id, nothing else).
-- ============================================================================
CREATE TABLE users (
    user_id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name           VARCHAR(150)  NOT NULL,
    email               VARCHAR(150)  NOT NULL,
    password_hash       VARCHAR(255)  NOT NULL,
    role                ENUM('jobseeker','recruiter','admin') NOT NULL DEFAULT 'jobseeker',
    phone               VARCHAR(20)   NULL,
    profile_picture_url VARCHAR(255)  NULL,
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    email_verified      BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE INDEX idx_users_role ON users (role);

-- ============================================================================
-- 2. COMPANIES
-- Independent entity. Central to fake-job detection: a job's legitimacy is
-- heavily tied to whether the posting company itself is verifiable.
-- ============================================================================
CREATE TABLE companies (
    company_id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_name          VARCHAR(200)  NOT NULL,
    company_domain        VARCHAR(150)  NULL,          -- e.g. infosys.com
    industry              VARCHAR(100)  NULL,
    company_size          ENUM('1-10','11-50','51-200','201-500','501-1000','1000+') NULL,
    website_url           VARCHAR(255)  NULL,
    headquarters_location VARCHAR(200)  NULL,
    registration_number   VARCHAR(100)  NULL,          -- govt/CIN style registration
    is_verified           BOOLEAN       NOT NULL DEFAULT FALSE,
    verification_source   VARCHAR(150)  NULL,          -- e.g. 'Admin Manual Review'
    created_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_companies_domain UNIQUE (company_domain)
) ENGINE=InnoDB;

CREATE INDEX idx_companies_name       ON companies (company_name);
CREATE INDEX idx_companies_verified   ON companies (is_verified);

-- ============================================================================
-- 3. RECRUITERS
-- 1:1 extension of USERS (a user with role='recruiter' has exactly one row
-- here). N:1 to COMPANIES because a recruiter belongs to one company
-- (agencies with multiple recruiter accounts are still one row per person).
-- ============================================================================
CREATE TABLE recruiters (
    recruiter_id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id              BIGINT UNSIGNED NOT NULL,
    company_id           BIGINT UNSIGNED NOT NULL,
    designation          VARCHAR(100)   NULL,
    work_email           VARCHAR(150)   NULL,   -- checked against company_domain
    is_verified_recruiter BOOLEAN       NOT NULL DEFAULT FALSE,
    linkedin_url         VARCHAR(255)   NULL,
    created_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_recruiters_user UNIQUE (user_id),
    CONSTRAINT fk_recruiters_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_recruiters_company
        FOREIGN KEY (company_id) REFERENCES companies(company_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_recruiters_company ON recruiters (company_id);

-- ============================================================================
-- 4. ADMINS
-- 1:1 extension of USERS, same reasoning as Recruiters.
-- ============================================================================
CREATE TABLE admins (
    admin_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT UNSIGNED NOT NULL,
    access_level   ENUM('super_admin','moderator') NOT NULL DEFAULT 'moderator',
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_admins_user UNIQUE (user_id),
    CONSTRAINT fk_admins_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 5. JOBS
-- Posted by a Recruiter, on behalf of a Company. company_id is kept
-- independent of recruiter->company (not transitive) to correctly support
-- agency recruiters who post for multiple client companies.
-- ============================================================================
CREATE TABLE jobs (
    job_id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recruiter_id         BIGINT UNSIGNED NOT NULL,
    company_id           BIGINT UNSIGNED NOT NULL,
    title                VARCHAR(200)   NOT NULL,
    description          TEXT           NOT NULL,
    requirements         TEXT           NULL,
    responsibilities     TEXT           NULL,
    employment_type      ENUM('full_time','part_time','contract','internship','remote')
                                        NOT NULL DEFAULT 'full_time',
    location             VARCHAR(200)   NULL,
    salary_min           DECIMAL(12,2)  NULL,
    salary_max           DECIMAL(12,2)  NULL,
    experience_required  VARCHAR(50)    NULL,   -- e.g. '0-2 years'
    application_deadline DATE           NULL,
    status               ENUM('pending','verified','suspicious','fake','closed')
                                        NOT NULL DEFAULT 'pending',
    verified_by_admin_id BIGINT UNSIGNED NULL,  -- set only on manual admin override
    views_count          INT UNSIGNED   NOT NULL DEFAULT 0,
    created_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_jobs_salary CHECK (
        salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max
    ),
    CONSTRAINT fk_jobs_recruiter
        FOREIGN KEY (recruiter_id) REFERENCES recruiters(recruiter_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_jobs_company
        FOREIGN KEY (company_id) REFERENCES companies(company_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_jobs_admin
        FOREIGN KEY (verified_by_admin_id) REFERENCES admins(admin_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_jobs_recruiter   ON jobs (recruiter_id);
CREATE INDEX idx_jobs_company     ON jobs (company_id);
CREATE INDEX idx_jobs_status      ON jobs (status);
CREATE INDEX idx_jobs_location    ON jobs (location);
CREATE INDEX idx_jobs_created_at  ON jobs (created_at);
CREATE FULLTEXT INDEX ftx_jobs_search ON jobs (title, description);

-- ============================================================================
-- 6. APPLICATIONS
-- M:N resolver between Users (jobseekers) and Jobs, with attributes of its
-- own (status, resume, cover letter) -> a genuine associative entity, not
-- just a join table.
-- ============================================================================
CREATE TABLE applications (
    application_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id          BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NOT NULL,
    resume_url      VARCHAR(255)    NULL,
    cover_letter    TEXT            NULL,
    status          ENUM('applied','under_review','shortlisted','rejected','hired')
                                    NOT NULL DEFAULT 'applied',
    applied_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_applications_job_user UNIQUE (job_id, user_id),
    CONSTRAINT fk_applications_job
        FOREIGN KEY (job_id) REFERENCES jobs(job_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_applications_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_applications_job    ON applications (job_id);
CREATE INDEX idx_applications_user   ON applications (user_id);
CREATE INDEX idx_applications_status ON applications (status);

-- ============================================================================
-- 7. SAVED_JOBS
-- Pure M:N join table (bookmarks). No meaningful attributes beyond the
-- timestamp, so it stays a lightweight junction table.
-- ============================================================================
CREATE TABLE saved_jobs (
    saved_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT UNSIGNED NOT NULL,
    job_id     BIGINT UNSIGNED NOT NULL,
    saved_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_saved_jobs_user_job UNIQUE (user_id, job_id),
    CONSTRAINT fk_saved_jobs_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_saved_jobs_job
        FOREIGN KEY (job_id) REFERENCES jobs(job_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_saved_jobs_user ON saved_jobs (user_id);
CREATE INDEX idx_saved_jobs_job  ON saved_jobs (job_id);

-- ============================================================================
-- 8. PREDICTIONS
-- One-to-many with JOBS: every verification run (initial + re-checks) creates
-- a new row, giving a full ML audit trail instead of overwriting history.
-- ============================================================================
CREATE TABLE predictions (
    prediction_id     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id            BIGINT UNSIGNED NOT NULL,
    ml_label          ENUM('real','fake') NOT NULL,
    ml_confidence     DECIMAL(5,4)   NOT NULL,   -- 0.0000 - 1.0000
    rule_based_score  DECIMAL(5,4)   NULL,       -- heuristic engine score
    final_verdict     ENUM('verified','suspicious','fake') NOT NULL,
    model_version     VARCHAR(50)    NOT NULL DEFAULT 'tfidf_nb_v1',
    flagged_reasons   JSON           NULL,       -- rule engine explanations
    predicted_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_predictions_confidence CHECK (
        ml_confidence >= 0 AND ml_confidence <= 1
    ),
    CONSTRAINT fk_predictions_job
        FOREIGN KEY (job_id) REFERENCES jobs(job_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_predictions_job       ON predictions (job_id);
CREATE INDEX idx_predictions_verdict   ON predictions (final_verdict);
CREATE INDEX idx_predictions_predicted_at ON predictions (predicted_at);

-- ============================================================================
-- 9. REPORTS
-- Community-driven flagging. reported_by -> Users (any logged-in user can
-- report), reviewed_by -> Admins (nullable until an admin acts on it).
-- ============================================================================
CREATE TABLE reports (
    report_id     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id        BIGINT UNSIGNED NOT NULL,
    reported_by   BIGINT UNSIGNED NOT NULL,
    reason        ENUM('fake_job','scam','misleading_salary','spam','other')
                                  NOT NULL,
    description   TEXT           NULL,
    status        ENUM('pending','reviewed','dismissed','action_taken')
                                  NOT NULL DEFAULT 'pending',
    reviewed_by   BIGINT UNSIGNED NULL,
    created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at   TIMESTAMP      NULL,

    CONSTRAINT fk_reports_job
        FOREIGN KEY (job_id) REFERENCES jobs(job_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reports_reporter
        FOREIGN KEY (reported_by) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reports_reviewer
        FOREIGN KEY (reviewed_by) REFERENCES admins(admin_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_reports_job    ON reports (job_id);
CREATE INDEX idx_reports_status ON reports (status);
CREATE INDEX idx_reports_reporter ON reports (reported_by);

SET FOREIGN_KEY_CHECKS = 1;
