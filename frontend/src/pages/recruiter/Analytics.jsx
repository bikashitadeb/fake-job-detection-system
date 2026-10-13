import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, Briefcase, ShieldAlert, ShieldCheck, RefreshCw } from "lucide-react";
import API from "../../api/API";

const Stat = ({title,value,icon:Icon}) => <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"><div className="flex items-center justify-between"><p className="text-sm text-slate-400">{title}</p><Icon className="text-cyan-300" size={23}/></div><p className="mt-4 text-3xl font-bold">{value}</p></div>;

export default function Analytics() {
  const [data,setData] = useState(null);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(true);
  const load = async () => {
    setLoading(true); setError("");
    try { const r = await API.get("/analytics/recruiter"); setData(r.data.analytics || r.data.data?.analytics || null); }
    catch(e) { setError(e.response?.data?.message || "Analytics could not be loaded. Sign in as a recruiter and confirm the backend is running."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const mix = data?.fake_vs_genuine || {};
  const trust = data?.trust_distribution || {};
  return <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-7 text-slate-100">
    <div className="flex items-end justify-between gap-3"><div><p className="text-sm uppercase tracking-[.2em] text-cyan-300">Performance</p><h1 className="mt-2 text-3xl font-bold">Recruitment analytics</h1><p className="mt-2 text-slate-400">Metrics are fetched from the recruiter analytics API; no sample values are used.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"><RefreshCw size={16}/> Refresh</button></div>
    {error && <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-rose-200">{error}</div>}
    {loading ? <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-slate-400">Loading analytics…</div> : data ? <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat title="Total job postings" value={data.total_jobs ?? 0} icon={Briefcase}/><Stat title="Applications" value={data.total_applications ?? 0} icon={Users}/><Stat title="AI-flagged jobs" value={mix.fake ?? 0} icon={ShieldAlert}/><Stat title="Average trust score" value={`${data.average_trust_score ?? 0}%`} icon={ShieldCheck}/></div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"><h2 className="flex items-center gap-2 text-lg font-semibold"><BarChart3 size={20} className="text-cyan-300"/> AI screening outcomes</h2><div className="mt-6 space-y-5">{[["Genuine / not flagged",Number(mix.genuine||0),"bg-emerald-400"],["Flagged as fake",Number(mix.fake||0),"bg-rose-400"]].map(([label,value,color])=>{const total=Number(mix.fake||0)+Number(mix.genuine||0);return <div key={label}><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">{label}</span><span>{value} ({total?Math.round(value/total*100):0}%)</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full ${color}`} style={{width:`${total?value/total*100:0}%`}}/></div></div>})}</div><p className="mt-5 text-xs text-slate-500">“Not flagged” is not a guarantee that a job is genuine.</p></section>
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"><h2 className="text-lg font-semibold">Trust-score distribution</h2><p className="mt-1 text-sm text-slate-400">Counts calculated by the backend.</p><div className="mt-5 grid grid-cols-3 gap-3">{[["High (80–100)",trust.high||0,"text-emerald-300"],["Medium (50–79)",trust.medium||0,"text-amber-300"],["Low (0–49)",trust.low||0,"text-rose-300"]].map(([label,value,color])=><div key={label} className="rounded-xl bg-white/5 p-4"><p className="text-xs text-slate-400">{label}</p><p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p></div>)}</div></section>
      </div>
    </> : <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-slate-400">The API returned no analytics data.</div>}
  </motion.div>;
}
