
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Activity,
  AlertCircle,
  ArrowUpRight,
  Clock3,
  LayoutDashboard,
} from "lucide-react";
import API from "../../api/API";

const Stat = ({ label, value, icon: Icon, tone, description }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-black/10"
  >
    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.025] transition-transform duration-300 group-hover:scale-125" />

    <div className="relative flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <p className="mt-4 break-words text-3xl font-bold tracking-tight text-white">
          {value}
        </p>
      </div>

      <span
        className={`rounded-xl border border-white/10 bg-white/[0.04] p-3 ${tone}`}
      >
        <Icon size={22} />
      </span>
    </div>

    <p className="relative mt-4 text-xs text-slate-500">{description}</p>
  </motion.div>
);

const RiskBar = ({ label, value, total, color, textColor }) => {
  const count = Number(value) || 0;
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
          <span className="text-sm text-slate-300">{label}</span>
        </div>

        <div className="text-right">
          <span className={`font-semibold ${textColor}`}>{count}</span>
          <span className="ml-2 text-xs text-slate-500">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-label={`${label} distribution`}
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

const getData = (response, primaryKey, nestedKey) =>
  response?.data?.[primaryKey] ??
  response?.data?.data?.[nestedKey] ??
  null;

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [risk, setRisk] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [analyticsResponse, riskResponse, jobsResponse] =
        await Promise.all([
          API.get("/analytics/admin"),
          API.get("/analytics/risk"),
          API.get("/jobs?limit=100"),
        ]);

      const analyticsData = getData(
        analyticsResponse,
        "analytics",
        "analytics"
      );

      const riskData = getData(
        riskResponse,
        "risk_analysis",
        "risk_analysis"
      );

      const jobsData = getData(jobsResponse, "jobs", "jobs");

      if (!Array.isArray(jobsData)) {
        throw new Error("The jobs API returned an unexpected response.");
      }

      setAnalytics(analyticsData);
      setRisk(riskData);
      setJobs(jobsData);
      setLastUpdated(new Date());
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.response?.data?.msg ||
          e.message ||
          "Could not load live admin data. Check your login and backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flagged = jobs
    .filter(
      (job) =>
        job.is_fake_predicted ||
        Number(job.fake_probability || 0) >= 70
    )
    .slice(0, 6);

  const riskTotal =
    Number(risk?.high || 0) +
    Number(risk?.medium || 0) +
    Number(risk?.low || 0);

  const formatUpdated = (date) =>
    date
      ? date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Not updated yet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-full space-y-7 text-slate-100"
    >
      {/* Page heading */}
      <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-semibold tracking-wide text-cyan-300">
            <LayoutDashboard size={14} />
            ADMINISTRATION
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Security overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Monitor platform activity, job risk, and recruitment security
            from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/[0.12] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh data"}
        </button>
      </header>

      {/* Live status */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span
            className={`h-2 w-2 rounded-full ${
              error ? "bg-rose-400" : loading ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
          {error
            ? "Unable to refresh platform data"
            : loading
              ? "Loading platform data..."
              : "Dashboard connected to API"}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock3 size={14} />
          Last updated: {formatUpdated(lastUpdated)}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-4 text-sm text-rose-200"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Could not update dashboard</p>
            <p className="mt-1 leading-6 text-rose-200/80">{error}</p>
            <button
              type="button"
              onClick={() => load(true)}
              className="mt-3 font-semibold underline underline-offset-4 hover:text-white"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-white/[0.07] bg-slate-900/70"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Metric cards */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white">
                Platform metrics
              </h2>
              <span className="text-xs text-slate-500">
                Current API data
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat
                label="Registered users"
                value={analytics?.users ?? "—"}
                icon={Users}
                tone="text-violet-300"
                description="Accounts registered on the platform"
              />

              <Stat
                label="Job postings"
                value={analytics?.jobs ?? jobs.length}
                icon={Briefcase}
                tone="text-cyan-300"
                description="Listings reported by the platform API"
              />

              <Stat
                label="AI-flagged jobs"
                value={
                  analytics?.fake_jobs_detected ??
                  jobs.filter((job) => job.is_fake_predicted).length
                }
                icon={ShieldAlert}
                tone="text-rose-300"
                description="Reported by the analytics API"
              />

              <Stat
                label="Average trust score"
                value={
                  analytics?.platform_trust_score != null
                    ? `${analytics.platform_trust_score}%`
                    : "—"
                }
                icon={ShieldCheck}
                tone="text-emerald-300"
                description="Platform-wide score from the backend"
              />
            </div>
          </section>

          {/* Analytics panels */}
          <section className="grid gap-5 xl:grid-cols-2">
            {/* Risk distribution */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/70 p-5 shadow-lg shadow-black/10 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity size={19} className="text-cyan-300" />
                    <h2 className="text-lg font-semibold text-white">
                      Risk distribution
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-400">
                    Breakdown returned by the risk analytics API.
                  </p>
                </div>

                <span className="rounded-xl bg-cyan-400/[0.08] p-2.5 text-cyan-300">
                  <ShieldCheck size={20} />
                </span>
              </div>

              <div className="mt-7 rounded-xl border border-white/[0.06] bg-black/10 p-4">
                <p className="text-sm text-slate-400">
                  Jobs included in risk analysis
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {risk ? riskTotal : "—"}
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <RiskBar
                  label="High risk"
                  value={risk?.high ?? 0}
                  total={riskTotal}
                  color="bg-rose-400"
                  textColor="text-rose-300"
                />

                <RiskBar
                  label="Medium risk"
                  value={risk?.medium ?? 0}
                  total={riskTotal}
                  color="bg-amber-400"
                  textColor="text-amber-300"
                />

                <RiskBar
                  label="Low risk"
                  value={risk?.low ?? 0}
                  total={riskTotal}
                  color="bg-emerald-400"
                  textColor="text-emerald-300"
                />
              </div>

              {risk && riskTotal === 0 && (
                <p className="mt-6 rounded-lg border border-dashed border-white/10 p-3 text-center text-sm text-slate-400">
                  No jobs are currently included in the risk breakdown.
                </p>
              )}
            </div>

            {/* Flagged jobs */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/70 p-5 shadow-lg shadow-black/10 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={19} className="text-rose-300" />
                    <h2 className="text-lg font-semibold text-white">
                      Flagged postings
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-400">
                    Listings matching the current frontend risk filter.
                  </p>
                </div>

                <span className="rounded-xl bg-rose-400/[0.08] p-2.5 text-rose-300">
                  <AlertCircle size={20} />
                </span>
              </div>

              {flagged.length > 0 ? (
                <div className="mt-5 divide-y divide-white/[0.07]">
                  {flagged.map((job) => {
                    const probability = Number(job.fake_probability || 0);

                    return (
                      <div
                        key={job.id}
                        className="rounded-lg py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-words font-semibold text-slate-100">
                              {job.title || "Untitled job"}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {job.company_name ||
                                job.company ||
                                "Company not supplied"}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full border border-rose-400/15 bg-rose-400/[0.08] px-2.5 py-1.5 text-xs font-semibold text-rose-300">
                            {Math.round(probability)}% risk
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span>Job #{job.id}</span>
                          <span>
                            Trust score:{" "}
                            {job.trust_score != null
                              ? `${Math.round(Number(job.trust_score))}%`
                              : "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-white/10 px-5 py-9 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400">
                    <ShieldCheck size={24} />
                  </div>
                  <p className="mt-3 font-medium text-slate-200">
                    No flagged postings found
                  </p>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    No listings matched the current risk filter in the
                    returned jobs.
                  </p>
                </div>
              )}

              {flagged.length > 0 && (
                <div className="mt-5 border-t border-white/[0.07] pt-4">
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <ArrowUpRight size={14} />
                    Showing up to six matching listings from the API response.
                  </p>
                </div>
              )}
            </div>
          </section>

          <p className="pb-2 text-xs leading-5 text-slate-500">
            Predictions and risk summaries depend on backend responses.
            Model accuracy, precision, and recall are not displayed as live
            metrics unless evaluation results are provided by the backend.
          </p>
        </>
      )}
    </motion.div>
  );
}
