
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Users,
  ShieldCheck,
  ShieldAlert,
  Plus,
  ArrowRight,
  RefreshCw,
  MapPin,
  Building2,
  Activity,
  Sparkles,
  Search,
  Bell,
  ChevronRight,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import API from "../../api/API";

const card =
  "rounded-2xl border border-white/[0.08] bg-[#111827]/85 shadow-[0_12px_35px_rgba(0,0,0,0.16)]";

function StatCard({ label, value, detail, icon: Icon, color, index }) {
  const palette = {
    blue: "border-blue-400/15 bg-blue-400/10 text-blue-300",
    violet: "border-violet-400/15 bg-violet-400/10 text-violet-300",
    rose: "border-rose-400/15 bg-rose-400/10 text-rose-300",
    emerald: "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className={`${card} group relative min-w-0 overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:border-white/[0.16]`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/[0.035] blur-2xl transition group-hover:bg-violet-500/[0.08]" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${palette[color]}`}
        >
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>

      <p className="relative mt-3 break-words text-xs leading-5 text-slate-500">
        {detail}
      </p>
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
        {title}
      </h2>
      {description && (
        <p className="mt-1.5 text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

function EmptyState({ onPost }) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.015] px-5 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-300">
        <BriefcaseBusiness size={25} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        No job postings yet
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Publish your first opportunity to start managing applications and
        viewing AI-generated screening insights.
      </p>

      <button
        type="button"
        onClick={onPost}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-violet-300"
      >
        <Plus size={17} />
        Create a job posting
      </button>
    </div>
  );
}

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const [jobsResponse, analyticsResponse] = await Promise.all([
        API.get("/jobs/my-jobs"),
        API.get("/analytics/recruiter"),
      ]);

      const fetchedJobs = jobsResponse?.data?.jobs;
      setJobs(Array.isArray(fetchedJobs) ? fetchedJobs : []);

      setAnalytics(
        analyticsResponse?.data?.analytics ??
          analyticsResponse?.data?.data?.analytics ??
          null
      );
    } catch (err) {
      console.error("Recruiter dashboard error:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Could not load dashboard data. Check your backend connection and recruiter login."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isFlagged = (job) =>
    Boolean(job.is_fake_predicted) ||
    Number(job.fake_probability) >= 70;

  const flaggedCount = useMemo(
    () => jobs.filter(isFlagged).length,
    [jobs]
  );

  const averageTrust = useMemo(() => {
    if (!jobs.length) return 0;

    return Math.round(
      jobs.reduce(
        (total, job) =>
          total +
          Math.max(0, Math.min(100, Number(job.trust_score) || 0)),
        0
      ) / jobs.length
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const company =
        job.company_name ||
        (typeof job.company === "string"
          ? job.company
          : job.company?.name) ||
        "";

      const matchesSearch =
        !query ||
        String(job.title || "").toLowerCase().includes(query) ||
        String(company).toLowerCase().includes(query) ||
        String(job.location || "").toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (filter === "flagged") return isFlagged(job);
      if (filter === "review") {
        return !isFlagged(job) && Number(job.trust_score || 0) < 70;
      }

      return true;
    });
  }, [jobs, search, filter]);

  const recentJobs = filteredJobs.slice(0, 5);

  const stats = [
    {
      label: "Job postings",
      value: jobs.length,
      detail: "Listings in your recruiter account",
      icon: BriefcaseBusiness,
      color: "blue",
    },
    {
      label: "Applications",
      value: analytics?.total_applications ?? "—",
      detail: "Applications recorded by the platform",
      icon: Users,
      color: "violet",
    },
    {
      label: "Flagged by AI",
      value: flaggedCount,
      detail: "Listings meeting the current flagging rule",
      icon: ShieldAlert,
      color: "rose",
    },
    {
      label: "Average trust score",
      value: `${averageTrust}%`,
      detail: "Mean score across your posted jobs",
      icon: ShieldCheck,
      color: "emerald",
    },
  ];

  return (
    <div className="relative isolate min-w-0 space-y-8 overflow-x-clip pb-8 text-slate-100 sm:space-y-10">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[12%] -z-10 h-72 w-72 rounded-full bg-violet-600/[0.09] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-80 -z-10 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-[100px]"
      />

      {/* Welcome header */}
      <section className="flex min-w-0 flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.06] px-3 py-1.5">
            <Sparkles size={13} className="text-violet-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-violet-200">
              Recruiter workspace
            </span>
          </div>

          <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px]">
            Overview
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Manage your listings, review screening insights, and keep your
            recruitment activity organized.
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => load(true)}
            disabled={loading || refreshing}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06] disabled:opacity-60 sm:flex-none"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/recruiter/post-job")}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/25 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-violet-300 sm:flex-none"
          >
            <Plus size={18} />
            Post a job
          </button>
        </div>
      </section>

      {/* API error */}
      {error && (
        <div
          role="alert"
          className="flex min-w-0 items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/[0.07] p-4"
        >
          <CircleAlert
            size={19}
            className="mt-0.5 shrink-0 text-rose-300"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-rose-200">
              Unable to load dashboard
            </p>
            <p className="mt-1 break-words text-sm leading-6 text-rose-200/80">
              {error}
            </p>
          </div>
          <button
            type="button"
            onClick={() => load(true)}
            className="shrink-0 text-xs font-semibold text-rose-200 underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <SectionTitle
            eyebrow="Performance snapshot"
            title="Your activity"
            description="A quick view of your recruitment workspace."
          />

          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
            <Activity size={14} className="text-violet-300" />
            {loading ? "Loading data..." : "Latest loaded data"}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="h-40 animate-pulse rounded-2xl border border-white/[0.07] bg-slate-900/70"
              />
            ))}
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <StatCard key={item.label} {...item} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Job listings */}
      <section className={`${card} min-w-0 overflow-hidden`}>
        <div className="border-b border-white/[0.07] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionTitle
              eyebrow="Listing management"
              title="Recent job postings"
              description="Review job details, AI flags, and trust scores."
            />

            <button
              type="button"
              onClick={() => navigate("/recruiter/jobs")}
              className="inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-semibold text-violet-300 transition hover:text-violet-200 sm:self-auto"
            >
              All jobs <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-5 flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, company, or location..."
                aria-label="Search job postings"
                className="h-11 w-full min-w-0 rounded-xl border border-white/[0.1] bg-[#090d19]/70 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-2 focus:ring-violet-300/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "All listings", value: "all" },
                { label: "AI flagged", value: "flagged" },
                { label: "Needs review", value: "review" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`min-h-10 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    filter === item.value
                      ? "border-violet-300/25 bg-violet-400/10 text-violet-200"
                      : "border-white/[0.09] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-sm text-slate-400">
            Loading job postings...
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState onPost={() => navigate("/recruiter/post-job")} />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Search size={27} className="mx-auto text-slate-500" />
            <p className="mt-3 font-semibold text-white">
              No matching listings
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Try a different search or filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-4 text-sm font-semibold text-violet-300 hover:text-violet-200"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.07]">
            {filteredJobs.slice(0, 5).map((job, index) => {
              const flagged = isFlagged(job);
              const trust = Math.max(
                0,
                Math.min(100, Number(job.trust_score) || 0)
              );
              const risk = Math.max(
                0,
                Math.min(100, Number(job.fake_probability) || 0)
              );

              const company =
                job.company_name ||
                (typeof job.company === "string"
                  ? job.company
                  : job.company?.name) ||
                "Company not supplied";

              const trustColor =
                trust >= 70
                  ? "bg-emerald-400"
                  : trust >= 40
                    ? "bg-amber-400"
                    : "bg-rose-400";

              return (
                <motion.article
                  key={job.id ?? `${job.title}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="min-w-0 p-5 transition hover:bg-white/[0.015] sm:p-6"
                >
                  <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/[0.07] text-violet-300">
                        <BriefcaseBusiness size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-base font-semibold text-white">
                          {job.title || "Untitled position"}
                        </h3>

                        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <Building2
                              size={14}
                              className="shrink-0 text-slate-500"
                            />
                            <span className="break-words">{company}</span>
                          </span>

                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <MapPin
                              size={14}
                              className="shrink-0 text-slate-500"
                            />
                            <span className="break-words">
                              {job.location || "Location not supplied"}
                            </span>
                          </span>
                        </div>

                        <p className="mt-2 break-all text-[10px] text-slate-600">
                          Job ID: {job.id ?? "Unavailable"}
                        </p>
                      </div>
                    </div>

                    {/* Separate screening and trust panels prevent overlap */}
                    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[390px] xl:shrink-0">
                      <div className="min-w-0 rounded-xl border border-white/[0.07] bg-black/10 p-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                          AI screening
                        </p>

                        <div className="mt-3">
                          <span
                            className={`inline-flex max-w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                              flagged
                                ? "bg-rose-400/10 text-rose-300"
                                : "bg-emerald-400/10 text-emerald-300"
                            }`}
                          >
                            {flagged ? (
                              <ShieldAlert size={14} className="shrink-0" />
                            ) : (
                              <CheckCircle2 size={14} className="shrink-0" />
                            )}
                            <span className="break-words">
                              {flagged ? "AI flagged" : "Not flagged"}
                            </span>
                          </span>
                        </div>

                        <p className="mt-2 break-words text-[10px] leading-4 text-slate-500">
                          {flagged
                            ? `Reported risk: ${risk}%`
                            : "No high-risk flag returned"}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-xl border border-white/[0.07] bg-black/10 p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                            Trust score
                          </p>
                          <span className="shrink-0 text-sm font-bold text-white">
                            {trust}%
                          </span>
                        </div>

                        <div
                          className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"
                          role="progressbar"
                          aria-label={`Trust score ${trust}%`}
                          aria-valuenow={trust}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className={`h-full rounded-full ${trustColor}`}
                            style={{ width: `${trust}%` }}
                          />
                        </div>

                        <p className="mt-2 text-[10px] leading-4 text-slate-500">
                          {trust >= 70
                            ? "Higher model trust score"
                            : trust >= 40
                              ? "Review details carefully"
                              : "Low score — review listing"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {!loading && filteredJobs.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-4 sm:px-6">
            <p className="text-xs text-slate-500">
              Showing {Math.min(filteredJobs.length, 5)} of{" "}
              {filteredJobs.length} matching listing
              {filteredJobs.length === 1 ? "" : "s"}
            </p>

            <button
              type="button"
              onClick={() => navigate("/recruiter/jobs")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 transition hover:text-violet-200"
            >
              Manage all jobs <ArrowRight size={14} />
            </button>
          </div>
        )}
      </section>

      {/* AI guidance */}
      <section className="flex min-w-0 items-start gap-3 rounded-2xl border border-violet-300/10 bg-gradient-to-r from-violet-400/[0.06] to-transparent p-4 sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/10 text-violet-300">
          <Sparkles size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-200">
            AI screening insights
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Trust scores and risk flags are model-generated signals, not proof
            that a job is genuine or fraudulent. Review the listing details
            before making a decision.
          </p>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
          FakeGuard AI
        </span>
        <span className="text-[10px] text-slate-600">
          Recruiter intelligence workspace
        </span>
      </footer>
    </div>
  );
}
