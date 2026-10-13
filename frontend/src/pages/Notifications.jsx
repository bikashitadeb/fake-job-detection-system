import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, ShieldAlert, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import API from "../api/API";

export default function Notifications() {
  const [notifications,setNotifications] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await API.get("/notifications");
      setNotifications(Array.isArray(response.data.notifications) ? response.data.notifications : response.data.data?.notifications || []);
    } catch(e) {
      setError(e.response?.data?.message || e.response?.data?.msg || "Notifications could not be loaded. Please sign in and check the backend connection.");
    } finally { setLoading(false); }
  };
  useEffect(()=>{load();},[]);
  const markRead = async (item) => {
    if(item.is_read) return;
    try {
      await API.put(`/notifications/${item.id}/read`);
      setNotifications(current=>current.map(n=>n.id===item.id?{...n,is_read:true}:n));
    } catch(e) { setError(e.response?.data?.message || "Could not mark notification as read."); }
  };
  const iconFor = (item) => {
    const value = `${item.title||""} ${item.message||""}`.toLowerCase();
    if(value.includes("fake")||value.includes("fraud")||value.includes("suspicious")) return <ShieldAlert size={21}/>;
    if(value.includes("verified")||value.includes("success")) return <CheckCircle size={21}/>;
    return <Bell size={21}/>;
  };
  return <div className="mx-auto max-w-5xl space-y-7 text-slate-100">
    <div className="flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[.2em] text-cyan-300">Your activity</p><h1 className="mt-2 text-3xl font-bold">Notifications</h1><p className="mt-2 text-slate-400">Updates from your account and the job verification system.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"><RefreshCw size={16}/> Refresh</button></div>
    {error&&<div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200"><AlertCircle size={18}/>{error}</div>}
    {loading?<div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-slate-400">Loading notifications…</div>:notifications.length===0?<div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-12 text-center"><Bell size={32} className="mx-auto text-slate-500"/><h2 className="mt-4 text-lg font-semibold">You're all caught up</h2><p className="mt-2 text-sm text-slate-400">No notifications were returned for this account.</p></div>:<div className="space-y-3">{notifications.map((item,index)=><motion.button key={item.id??index} onClick={()=>markRead(item)} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${item.is_read?"border-white/10 bg-slate-900/50":"border-cyan-300/20 bg-cyan-300/5 hover:bg-cyan-300/10"}`}><span className={`rounded-xl p-3 ${item.is_read?"bg-white/5 text-slate-400":"bg-cyan-300/10 text-cyan-300"}`}>{iconFor(item)}</span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 font-semibold">{item.title||"Notification"}{!item.is_read&&<span className="rounded-full bg-cyan-300 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-950">New</span>}</span><span className="mt-1 block text-sm text-slate-300">{item.message||"You have an account update."}</span><span className="mt-2 block text-xs text-slate-500">{item.created_at?new Date(item.created_at).toLocaleString():""}</span></span></motion.button>)}</div>}
  </div>;
}
