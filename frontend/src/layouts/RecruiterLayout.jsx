
 // src/layouts/RecruiterLayout.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { Menu, X } from "lucide-react";

export default function RecruiterLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-clip bg-[#070b16] text-white">
      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div className="flex min-h-screen w-full min-w-0 flex-col">
        {/* HEADER */}
        <header className="relative z-30 flex min-h-[84px] w-full min-w-0 items-center gap-3 border-b border-slate-200/10 bg-[#f8fafc] px-4 py-3 text-slate-900 shadow-sm sm:min-h-[92px] sm:gap-4 sm:px-6 lg:px-8">
          {/* Menu button: reserved space prevents overlap */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md shadow-violet-950/20 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 sm:h-12 sm:w-12"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Navbar gets the remaining width */}
          <div className="min-w-0 flex-1">
            <Navbar />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="min-h-0 w-full min-w-0 flex-1 px-4 pb-8 pt-6 sm:px-6 sm:pt-8 lg:px-8 xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-full min-w-0 max-w-none"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* FOOTER */}
        <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
            FakeGuard AI
          </span>
          <span className="text-[10px] text-slate-600">
            AI-powered job verification
          </span>
        </footer>
      </div>
    </div>
  );
}
