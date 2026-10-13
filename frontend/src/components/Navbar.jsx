
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    UserCircle,
    ChevronDown,
    LogOut,
    UserRound,
    Settings,
    ShieldCheck,
    CheckCheck,
    ShieldAlert,
    BriefcaseBusiness,
    Info,
    RefreshCw,
    Check,
    X,
} from "lucide-react";

import { getCurrentUser } from "../api/auth";
import API from "../api/API";

export default function Navbar() {
    const user = getCurrentUser();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [notificationError, setNotificationError] = useState("");

    const menuRef = useRef(null);
    const notificationRef = useRef(null);

    // Load real notifications from Flask.
    const loadNotifications = useCallback(async () => {
        setLoading(true);
        setNotificationError("");

        try {
            const response = await API.get("/notifications");
            const payload = response.data || {};

            const items = Array.isArray(payload.notifications)
                ? payload.notifications
                : Array.isArray(payload.data?.notifications)
                    ? payload.data.notifications
                    : Array.isArray(payload.data)
                        ? payload.data
                        : [];

            setNotifications(items);

            const serverUnreadCount =
                payload.unread_count ?? payload.data?.unread_count;

            setUnreadCount(
                typeof serverUnreadCount === "number"
                    ? serverUnreadCount
                    : items.filter(
                        item =>
                            item.is_read !== true &&
                            item.is_read !== 1
                    ).length
            );
        } catch (error) {
            // Do not clear authentication data or navigate away.
            setNotificationError(
                error.response?.data?.message ||
                "Could not load notifications. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleOutsideClick = event => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationsOpen(false);
            }
        };

        const handleEscape = event => {
            if (event.key === "Escape") {
                setMenuOpen(false);
                setNotificationsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const toggleNotifications = () => {
        const opening = !notificationsOpen;

        setNotificationsOpen(opening);
        setMenuOpen(false);

        if (opening) {
            loadNotifications();
        }
    };

    const markAsRead = async notification => {
        if (
            notification.is_read === true ||
            notification.is_read === 1
        ) {
            return;
        }

        try {
            await API.put(
                `/notifications/${notification.id}/read`
            );

            setNotifications(current =>
                current.map(item =>
                    item.id === notification.id
                        ? { ...item, is_read: true }
                        : item
                )
            );

            setUnreadCount(count => Math.max(0, count - 1));
            setNotificationError("");
        } catch (error) {
            setNotificationError(
                error.response?.data?.message ||
                "Could not mark notification as read."
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            await API.put("/notifications/read-all");

            setNotifications(current =>
                current.map(item => ({
                    ...item,
                    is_read: true,
                }))
            );

            setUnreadCount(0);
            setNotificationError("");
        } catch (error) {
            setNotificationError(
                error.response?.data?.message ||
                "Could not mark notifications as read."
            );
        }
    };

    const handleLogout = () => {
        setMenuOpen(false);

        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("access_token");

        navigate("/login", { replace: true });
    };

    const displayName =
        user?.name ||
        user?.full_name ||
        user?.username ||
        "Recruiter";

    const displayRole = user?.role || "Recruiter";

    const iconFor = notification => {
        const text = (
            `${notification.title || ""} ${notification.message || ""}`
        ).toLowerCase();

        if (/fraud|fake|suspicious|risk|flagged/.test(text)) {
            return (
                <ShieldAlert
                    size={19}
                    className="text-rose-500"
                />
            );
        }

        if (/application|applicant|candidate/.test(text)) {
            return (
                <BriefcaseBusiness
                    size={19}
                    className="text-indigo-500"
                />
            );
        }

        if (/verified|verification|success|trust score/.test(text)) {
            return (
                <ShieldCheck
                    size={19}
                    className="text-emerald-500"
                />
            );
        }

        return (
            <Info
                size={19}
                className="text-blue-500"
            />
        );
    };

    const isRead = notification =>
        notification.is_read === true ||
        notification.is_read === 1;

    return (
        <header className="relative z-40 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-xl sm:px-6 md:px-10">

            {/* BRAND */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20 sm:h-12 sm:w-12">
                    <ShieldCheck
                        size={27}
                        className="text-white"
                    />
                </div>

                <div>
                    <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-black tracking-tight text-transparent sm:text-2xl">
                        FakeGuard AI
                    </h1>
                    <p className="text-xs text-slate-500">
                        AI Job Verification
                    </p>
                </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-5">

                {/* NOTIFICATIONS */}
                <div
                    className="relative"
                    ref={notificationRef}
                >
                    <button
                        type="button"
                        aria-label={`Notifications, ${unreadCount} unread`}
                        aria-expanded={notificationsOpen}
                        onClick={toggleNotifications}
                        className={`relative rounded-xl p-2.5 transition ${
                            notificationsOpen
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                        }`}
                    >
                        <Bell size={25} />

                        {unreadCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationsOpen && (
                        <div className="absolute right-0 top-full mt-3 w-[min(390px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">

                            {/* PANEL HEADER */}
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Notifications
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {unreadCount} unread · Account activity
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        aria-label="Refresh notifications"
                                        title="Refresh"
                                        onClick={loadNotifications}
                                        disabled={loading}
                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        <RefreshCw
                                            size={17}
                                            className={
                                                loading
                                                    ? "animate-spin"
                                                    : ""
                                            }
                                        />
                                    </button>

                                    {unreadCount > 0 && (
                                        <button
                                            type="button"
                                            title="Mark all as read"
                                            onClick={markAllAsRead}
                                            className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50"
                                        >
                                            <CheckCheck size={18} />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        aria-label="Close notifications"
                                        onClick={() =>
                                            setNotificationsOpen(false)
                                        }
                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>
                            </div>

                            {/* ERROR */}
                            {notificationError && (
                                <div
                                    role="alert"
                                    className="border-b border-rose-100 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-700"
                                >
                                    {notificationError}
                                </div>
                            )}

                            {/* NOTIFICATION LIST */}
                            <div className="max-h-[380px] overflow-y-auto">
                                {loading && notifications.length === 0 ? (
                                    <p className="p-8 text-center text-sm text-slate-500">
                                        Loading notifications…
                                    </p>
                                ) : notifications.length === 0 ? (
                                    <div className="px-5 py-10 text-center">
                                        <Bell
                                            size={28}
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-3 font-semibold text-slate-700">
                                            {notificationError
                                                ? "Notifications unavailable"
                                                : "You're all caught up"}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {notificationError
                                                ? "Check your connection and try again."
                                                : "New application updates and AI alerts will appear here."}
                                        </p>

                                        {notificationError && (
                                            <button
                                                type="button"
                                                onClick={loadNotifications}
                                                disabled={loading}
                                                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                Try again
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    notifications.map(item => (
                                        <div
                                            key={item.id}
                                            className={`flex gap-3 border-b border-slate-100 px-4 py-4 transition ${
                                                isRead(item)
                                                    ? "bg-white"
                                                    : "bg-indigo-50/60"
                                            }`}
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                                {iconFor(item)}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {item.title ||
                                                            "Account update"}
                                                    </p>

                                                    {!isRead(item) && (
                                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                                                    )}
                                                </div>

                                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                                    {item.message ||
                                                        "You have a new account update."}
                                                </p>

                                                <div className="mt-2 flex items-center justify-between gap-2">
                                                    <span className="text-[11px] text-slate-400">
                                                        {item.created_at
                                                            ? new Date(
                                                                item.created_at
                                                            ).toLocaleString()
                                                            : "Recent"}
                                                    </span>

                                                    {!isRead(item) && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                markAsRead(item)
                                                            }
                                                            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            <Check size={13} />
                                                            Mark read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* FOOTER: STAY ON CURRENT PAGE */}
                            <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                                <button
                                    type="button"
                                    onClick={loadNotifications}
                                    disabled={loading}
                                    className="w-full text-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Refreshing notifications..."
                                        : "Refresh notifications ↻"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* PROFILE MENU */}
                <div
                    className="relative"
                    ref={menuRef}
                >
                    <button
                        type="button"
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                        onClick={() => {
                            setMenuOpen(open => !open);
                            setNotificationsOpen(false);
                        }}
                        className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-slate-100 sm:gap-3 sm:px-3"
                    >
                        <UserCircle
                            size={38}
                            className="shrink-0 text-slate-700 sm:h-[42px] sm:w-[42px]"
                        />

                        <div className="hidden text-left sm:block">
                            <p className="max-w-40 truncate font-bold text-slate-800">
                                {displayName}
                            </p>
                            <p className="text-xs capitalize text-slate-500">
                                {displayRole}
                            </p>
                        </div>

                        <ChevronDown
                            size={17}
                            className={`text-slate-500 transition-transform ${
                                menuOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {menuOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
                        >
                            <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                                <p className="truncate font-semibold text-slate-800">
                                    {displayName}
                                </p>

                                <p className="mt-1 text-sm capitalize text-slate-500">
                                    {displayRole} account
                                </p>

                                {user?.email && (
                                    <p className="mt-1 truncate text-xs text-slate-400">
                                        {user.email}
                                    </p>
                                )}
                            </div>

                            <div className="p-2">
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate("/profile");
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <UserRound
                                        size={18}
                                        className="text-slate-500"
                                    />
                                    My Profile
                                </button>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate("/settings");
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <Settings
                                        size={18}
                                        className="text-slate-500"
                                    />
                                    Settings
                                </button>
                            </div>

                            <div className="border-t border-slate-100 p-2">
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
