import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, ShieldAlert, ShieldCheck, Users, Briefcase, RefreshCw } from "lucide-react";
import API from "../../api/API";

export default function Analytics() {
  const [analytics,setAnalytics] = useState(null);
  const [risk,setRisk] = useState(null);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(true);
  const load = async () => {
    setLoading(true); setError("");
    try {
      const [a,r] = await Promise.all([API.get("/analytics/admin"),API.get("/analytics/risk")]);
      setAnalytics(a.data.analytics || a.data.data?.analytics || null);
      setRisk(r.data.risk_analysis || r.data.data?.risk_analysis || null);
    } catch(e) { setError(e.response?.data?.message || "Unable to load live analytics. Check admin permissions and backend availability."); }
    finally { setLoading(false); }
  };
  useEffect(()=>{load();},[]);
  const Stat=({label,value,Icon})=><div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-400">{label}</p><Icon size={22} className="text-cyan-300"/></div><p className="mt-3 text-3xl font-bold">{value}</p></div>;
  return <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-7 text-slate-100"><div className="flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[.2em] text-cyan-300">Reporting</p><h1 className="mt-2 text-3xl font-bold">Platform analytics</h1><p className="mt-2 text-slate-400">Live aggregate data from the Flask analytics endpoints.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"><RefreshCw size={16}/> Refresh</button></div>
  {error&&<div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-rose-200">{error}</div>}
  {loading?<div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-slate-400">Loading analytics…</div>:analytics&&<><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Users" value={analytics.users??0} Icon={Users}/><Stat label="Jobs" value={analytics.jobs??0} Icon={Briefcase}/><Stat label="Applications" value={analytics.applications??0} Icon={BarChart3}/><Stat label="Average trust score" value={`${analytics.platform_trust_score??0}%`} Icon={ShieldCheck}/></div><section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"><h2 className="flex items-center gap-2 text-lg font-semibold"><ShieldAlert className="text-rose-300"/> Risk analysis</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{[["High risk",risk?.high??0,"text-rose-300"],["Medium risk",risk?.medium??0,"text-amber-300"],["Low risk",risk?.low??0,"text-emerald-300"]].map(([label,value,color])=><div key={label} className="rounded-xl bg-white/5 p-4"><p className="text-sm text-slate-400">{label}</p><p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p></div>)}</div><p className="mt-5 text-xs text-slate-500">These counts are live backend results. No placeholder model accuracy metrics are shown.</p></section></>}
  </motion.div>;
}
