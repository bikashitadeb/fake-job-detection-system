# FakeGuard AI — Fake Job Detection System

FakeGuard AI is a recruitment portal with an NLP/ML-backed job-posting risk assessment. The frontend calls the Flask API for job listings, recruiter submissions, AI prediction fields, trust scores, notifications, and analytics.

## Prerequisites

- Python 3.10+ (use the Python version supported by the installed scikit-learn/joblib model artifacts)
- Node.js 20+ and npm
- MySQL configured for the backend, unless `DATABASE_URL` is set to another supported SQLAlchemy database

## 1. Configure the backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env` locally (never commit this file) and set at least:

```dotenv
DATABASE_URL=mysql+pymysql://USER:PASSWORD@localhost:3306/fake_job_detection_db
SECRET_KEY=replace-with-a-long-random-secret
JWT_SECRET_KEY=replace-with-another-long-random-secret
FLASK_HOST=127.0.0.1
PORT=5000
FLASK_DEBUG=False
```

Make sure the database exists and the schema/migrations have been applied. Start the API:

```bash
python run.py
```

The API base URL is `http://127.0.0.1:5000/api`. The saved model artifacts are loaded from the paths configured in the backend source; keep the model and vectorizer files together as expected by the loader.

## 2. Configure the frontend

In another terminal:

```bash
cd frontend
npm install
```

Optionally copy `.env.example` to `.env` and set `VITE_API_URL` to the API base URL. Then start the app:

```bash
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Integration notes

- Flask responses can use a `{ success, message, data: {...} }` envelope. The frontend API client supports both nested and flattened payload access so pages can consume the same API consistently.
- Posting a job requires a logged-in recruiter. Job listing pages are public in the current backend; recruiter analytics, personal job listings, and notifications require a valid access token.
- Dashboard cards are populated from backend endpoints. They do not fabricate model accuracy/precision/recall values.
- A high trust score is a model estimate, not a guarantee that a posting is legitimate. Users should verify employers independently.

## Quick verification

1. Start Flask and confirm the server starts without model-load or database errors.
2. Start Vite and sign in as a recruiter.
3. Submit a job with a title, company, numeric annual salary, and description.
4. Confirm the response shows the model prediction, estimated fake-job probability, and trust score.
5. Open **My Jobs** and verify the posted job appears with its saved values.
6. Open **Recruitment Analytics** and verify counts reflect your database.
7. Sign in as an employee and confirm **Browse Jobs** loads the same saved listing.
