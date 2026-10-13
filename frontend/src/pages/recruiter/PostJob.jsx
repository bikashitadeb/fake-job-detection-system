
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  BriefcaseBusiness,
  Building2,
  MapPin,
  IndianRupee,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import API from "../../api/API";

const initialForm = {
  title: "",
  company: "",
  location: "",
  salary: "",
  experience: "",
  skills: "",
  description: "",
  website: "",
  official_email: "",
  linkedin_url: "",
};

const fields = [
  { name: "title", label: "Job title", placeholder: "e.g. Python Developer Intern", required: true },
  { name: "company", label: "Company", placeholder: "Company name", required: true },
  { name: "location", label: "Location", placeholder: "e.g. Bengaluru, India", required: true },
  { name: "salary", label: "Salary / stipend", placeholder: "e.g. 20000 per month" },
  { name: "experience", label: "Experience", placeholder: "e.g. Fresher / 0–1 years" },
  { name: "skills", label: "Required skills", placeholder: "e.g. Python, SQL, Flask" },
  { name: "website", label: "Company website", placeholder: "https://company.example" },
  { name: "official_email", label: "Official email", placeholder: "careers@company.example" },
  { name: "linkedin_url", label: "Company LinkedIn URL", placeholder: "https://linkedin.com/company/..." },
];

const inputClass =
  "w-full min-w-0 rounded-xl border border-white/10 bg-[#090D19]/80 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/10";

export default function PostJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submitJob = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await API.post("/jobs", {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        salary: form.salary.trim(),
        requirements: [
          form.experience.trim(),
          form.skills.trim(),
        ]
          .filter(Boolean)
          .join(" | "),
        description: form.description.trim(),
        website: form.website.trim(),
        official_email: form.official_email.trim(),
        linkedin_url: form.linkedin_url.trim(),
      });

      const payload = response.data?.data ?? response.data;
      const savedJob = payload?.job;

      // Do not show success unless the backend confirms a saved job ID.
      if (
        response.data?.success === false ||
        !savedJob ||
        savedJob.id == null
      ) {
        throw new Error(
          response.data?.message ||
            "The server did not confirm that the job was saved."
        );
      }

      setResult({
        ...savedJob,
        ...(payload.ai_result || {}),
        ...(payload.linkedin_result || {}),
        job: savedJob,
        is_fake:
          payload.ai_result?.is_fake ??
          savedJob.is_fake_predicted ??
          null,
        fake_probability:
          payload.ai_result?.fake_probability ??
          savedJob.fake_probability ??
          null,
        trust_score:
          savedJob.trust_score ??
          payload.ai_result?.trust_score ??
          null,
        ai_confidence:
          payload.ai_result?.ai_confidence ??
          payload.ai_result?.confidence ??
          savedJob.ai_confidence ??
          null,
        explanation:
          payload.ai_result?.ai_explanation ||
          savedJob.ai_explanation ||
          "The backend returned no explanation.",
        status: savedJob.status || "pending",
        published: true,
      });

      // Clear the form after the server confirms that it saved the job.
      setForm(initialForm);
    } catch (err) {
      console.error("Post job error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          err.message ||
          "Job creation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate min-w-0 space-y-8 overflow-x-clip pb-10 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-10 -z-10 h-64 w-64 rounded-full bg-violet-600/[0.10] blur-[100px]"
      />

      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.06] px-3 py-1.5 text-xs font-semibold text-violet-200">
            <Sparkles size={14} />
            RECRUITER WORKSPACE
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Post a new job
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Create a listing and review its AI-generated risk assessment.
            Your job is saved when the server confirms successful creation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/recruiter/jobs")}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07]"
        >
          <BriefcaseBusiness size={16} />
          My job postings
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-4"
        >
          <AlertTriangle className="mt-0.5 shrink-0 text-rose-300" size={20} />
          <div className="min-w-0">
            <p className="font-semibold text-rose-200">
              Unable to create job
            </p>
            <p className="mt-1 break-words text-sm leading-6 text-rose-200/80">
              {error}
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={submitJob}
        className="min-w-0 space-y-6 rounded-3xl border border-white/[0.09] bg-[#111827]/85 p-5 shadow-2xl shadow-black/20 sm:p-8 lg:p-10"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.07] pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-300">
            <BriefcaseBusiness size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Job information
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Fields marked with * are required.
            </p>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <label
              key={field.name}
              className="block min-w-0 space-y-2"
            >
              <span className="text-sm font-medium text-slate-300">
                {field.label}
                {field.required && (
                  <span className="ml-1 text-violet-300">*</span>
                )}
              </span>

              <input
                name={field.name}
                type={
                  field.name === "official_email"
                    ? "email"
                    : field.name === "website" ||
                        field.name === "linkedin_url"
                      ? "url"
                      : "text"
                }
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={Boolean(field.required)}
                autoComplete="off"
                className={inputClass}
              />
            </label>
          ))}
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">
            Detailed job description
            <span className="ml-1 text-violet-300">*</span>
          </span>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={7}
            required
            minLength={20}
            placeholder="Describe the responsibilities, qualifications, working arrangements, and application process..."
            className={`${inputClass} resize-y leading-6`}
          />
          <span className="block text-xs text-slate-500">
            Include enough detail for candidates and the screening model to
            assess the listing.
          </span>
        </label>

        <div className="flex items-start gap-3 rounded-xl border border-violet-300/10 bg-violet-400/[0.045] p-4">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-violet-300" />
          <div>
            <p className="text-sm font-semibold text-slate-200">
              AI-powered job screening
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              The server will evaluate the submitted listing and return its
              prediction and verification details. AI results are signals,
              not proof that a listing is genuine or fraudulent.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-4 font-bold text-white shadow-lg shadow-violet-950/25 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving and verifying job...
            </>
          ) : (
            <>
              <ShieldCheck size={20} />
              Post job & verify with AI
            </>
          )}
        </button>
      </form>

      {result && (
        <VerificationResult
          result={result}
          onViewJobs={() => navigate("/recruiter/jobs")}
          onViewEmployeeJobs={() => navigate("/employee/jobs")}
          onPostAnother={() => {
            setResult(null);
            setError("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}

function VerificationResult({
  result,
  onViewJobs,
  onViewEmployeeJobs,
  onPostAnother,
}) {
  const job = result.job || result;

  const trustValue = Number(result.trust_score);
  const trust = Number.isFinite(trustValue)
    ? Math.max(0, Math.min(100, trustValue))
    : null;

  const probabilityValue = Number(result.fake_probability);
  const probability = Number.isFinite(probabilityValue)
    ? Math.max(0, Math.min(100, probabilityValue))
    : null;

  const confidenceValue = Number(result.ai_confidence ?? result.confidence);
  const confidence = Number.isFinite(confidenceValue)
    ? Math.max(0, Math.min(100, confidenceValue))
    : null;

  const isFake =
    result.is_fake ??
    result.is_fake_predicted ??
    job.is_fake_predicted ??
    null;

  const verified = String(result.status || job.status || "").toLowerCase();

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-w-0 space-y-5"
    >
      {/* Publishing confirmation */}
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-400/10 text-emerald-300">
            <CheckCircle size={25} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-white">
              Job saved successfully
            </h2>
            <p className="mt-1 break-words text-sm leading-6 text-slate-300">
              {job.title || "Your job listing"} has been saved by the server.
              Its visibility on the employee Jobs page depends on the
              backend's active/publication settings.
            </p>
            <p className="mt-2 break-all text-xs text-slate-500">
              Job ID: {job.id}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onViewJobs}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            View my job postings <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onViewEmployeeJobs}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.05]"
          >
            Check employee Jobs page <ExternalLink size={15} />
          </button>

          <button
            type="button"
            onClick={onPostAnother}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05]"
          >
            Post another job
          </button>
        </div>
      </div>

      {/* AI verification */}
      <div className="rounded-3xl border border-white/[0.09] bg-[#111827]/85 p-5 sm:p-8">
        <div className="flex items-center gap-3">
          {isFake === true ? (
            <ShieldAlert className="shrink-0 text-rose-300" size={30} />
          ) : isFake === false ? (
            <ShieldCheck className="shrink-0 text-emerald-300" size={30} />
          ) : (
            <AlertTriangle className="shrink-0 text-amber-300" size={30} />
          )}

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              AI verification result
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Prediction for job ID {job.id}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <span
            className={`inline-flex max-w-full rounded-full px-3 py-2 text-xs font-bold ${
              isFake === true
                ? "bg-rose-400/10 text-rose-300"
                : isFake === false
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-amber-400/10 text-amber-300"
            }`}
          >
            {isFake === true
              ? "MODEL PREDICTION: FLAGGED"
              : isFake === false
                ? "MODEL PREDICTION: NOT FLAGGED"
                : "MODEL PREDICTION: INCONCLUSIVE"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.07] bg-black/10 p-4">
            <p className="text-xs text-slate-400">
              Estimated fake-job probability
            </p>
            <p className="mt-2 text-xl font-bold text-white">
              {probability === null ? "Not supplied" : `${probability.toFixed(2)}%`}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-black/10 p-4">
            <p className="text-xs text-slate-400">Model confidence</p>
            <p className="mt-2 text-xl font-bold text-white">
              {confidence === null ? "Not supplied" : `${confidence.toFixed(2)}%`}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-sm font-medium text-slate-400">
              AI Trust Score
            </p>
            <p className="text-4xl font-bold tracking-tight text-white">
              {trust === null ? "—" : `${Math.round(trust)}%`}
            </p>
          </div>

          <div
            className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="AI trust score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={trust ?? 0}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 transition-all duration-700"
              style={{ width: `${trust ?? 0}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          {verified === "verified" ? (
            <CheckCircle className="mt-0.5 shrink-0 text-emerald-300" size={20} />
          ) : verified === "flagged" ? (
            <AlertTriangle className="mt-0.5 shrink-0 text-rose-300" size={20} />
          ) : (
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-300" size={20} />
          )}

          <div>
            <p className="font-semibold capitalize text-white">
              {verified || "Pending verification"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {Array.isArray(result.explanation)
                ? result.explanation.join(" · ")
                : result.explanation || "No additional model explanation supplied."}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
