import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, ShieldAlert, ShieldCheck, RefreshCw, Activity } from "lucide-react";
import API from "../../api/API";

const Stat = ({label,value,icon:Icon,tone}) => <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-400">{label}</p><span className={`rounded-xl bg-white/5 p-3 ${tone}`}><Icon size={22}/></span></div><p className="mt-4 text-3xl font-bold text-white">{value}</p></div>;

export default function AdminDashboard() {
  const [analytics,setAnalytics] = useState(null);
  const [risk,setRisk] = useState(null);
  const [jobs,setJobs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const load = async () => {
    setLoading(true); setError("");
    try {
      const [a,r,j] = await Promise.all([
        API.get("/analytics/admin"),
        API.get("/analytics/risk"),
        API.get("/jobs?limit=100")
      ]);
      setAnalytics(a.data.analytics || a.data.data?.analytics || null);
      setRisk(r.data.risk_analysis || r.data.data?.risk_analysis || null);
      setJobs(j.data.jobs || j.data.data?.jobs || []);
    } catch(e) {
      setError(e.response?.data?.message || e.response?.data?.msg || "Could not load live admin data. Sign in with an admin account and check the backend.");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const flagged = jobs.filter(j => j.is_fake_predicted || Number(j.fake_probability || 0) >= 70).slice(0,6);
  return <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-8 text-slate-100">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-cyan-300">Platform oversight</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">AI security dashboard</h1><p className="mt-2 text-slate-400">Live platform totals and model flags from backend APIs, not demo metrics.</p></div><button onClick={load} className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"><RefreshCw size={16}/> Refresh</button></div>
    {error && <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-rose-200">{error}</div>}
    {loading ? <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-slate-400">Loading live platform metrics…</div> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Registered users" value={analytics?.users ?? "—"} icon={Users} tone="text-violet-300"/><Stat label="Total job postings" value={analytics?.jobs ?? jobs.length} icon={Briefcase} tone="text-cyan-300"/><Stat label="AI-flagged jobs" value={analytics?.fake_jobs_detected ?? jobs.filter(j=>j.is_fake_predicted).length} icon={ShieldAlert} tone="text-rose-300"/><Stat label="Platform average trust" value={`${analytics?.platform_trust_score ?? 0}%`} icon={ShieldCheck} tone="text-emerald-300"/></div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"><h2 className="flex items-center gap-2 text-lg font-semibold"><Activity size={20} className="text-cyan-300"/> Current risk distribution</h2><p className="mt-1 text-sm text-slate-400">Computed from the backend risk analytics endpoint.</p><div className="mt-6 space-y-5">{[["High risk",risk?.high ?? 0,"bg-rose-400"],["Medium risk",risk?.medium ?? 0,"bg-amber-400"],["Low risk",risk?.low ?? 0,"bg-emerald-400"]].map(([label,value,color])=>{const total=Number(risk?.high||0)+Number(risk?.medium||0)+Number(risk?.low||0);return <div key={label}><div className="mb-2 flex justify-between text-sm"><span>{label}</span><span>{value}</span></div><div className="h-2 rounded-full bg-white/10"><div className={`h-2 rounded-full ${color}`} style={{width:`${total?Number(value)/total*100:0}%`}}/></div></div>})}</div></section>
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"><h2 className="text-lg font-semibold">Recently flagged postings</h2><p className="mt-1 text-sm text-slate-400">Jobs returned by the listings endpoint with high-risk prediction fields.</p>{flagged.length ? <div className="mt-4 divide-y divide-white/10">{flagged.map(job=><div key={job.id} className="py-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{job.title || "Untitled job"}</p><p className="mt-1 text-sm text-slate-400">{job.company_name || job.company || "Company not supplied"}</p></div><span className="shrink-0 rounded-full bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300">{Math.round(Number(job.fake_probability || 0))}% fraud probability</span></div><p className="mt-2 text-xs text-slate-500">Trust score: {Math.round(Number(job.trust_score || 0))}% · Job #{job.id}</p></div>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-slate-400">No flagged jobs were returned by the current job listing API.</div>}</section>
      </div>
      <p className="text-xs text-slate-500">Model accuracy, precision and recall are intentionally not displayed as live metrics unless evaluation results are provided by the backend.</p>
    </>}
  </motion.div>;
}
