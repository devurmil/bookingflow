import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../app/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Wrench,
    CalendarCheck,
    Users,
    LogOut,
    ChevronRight,
    CircleDot
} from "lucide-react";

const AdminSidebar = () => {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(`${path}/`);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const navItems = [
        { path: "/admin", label: "Dashboard", icon: LayoutDashboard, gradient: "from-indigo-500 to-blue-600" },
        { path: "/admin/services", label: "Services", icon: Wrench, gradient: "from-emerald-500 to-teal-600" },
        { path: "/admin/appointments", label: "Appointments", icon: CalendarCheck, gradient: "from-amber-500 to-orange-600" },
        { path: "/admin/users", label: "Users", icon: Users, gradient: "from-rose-500 to-pink-600" },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-slate-800/60 z-50 flex flex-col shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="p-8 pb-10">
                <div className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
                            B
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#020617] rounded-full shadow-lg" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white leading-none mb-1">
                            Booking<span className="text-indigo-500">Flow</span>
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <CircleDot className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Admin System
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 scrollbar-none overflow-y-auto">
                <p className="px-5 mb-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-px bg-slate-800 flex-1" />
                    Main Menu
                    <span className="w-1.5 h-px bg-slate-800 flex-1" />
                </p>

                {navItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="block relative group"
                        >
                            <div className={`
                                flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 relative z-10
                                ${active
                                    ? "text-white"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                                }
                            `}>
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                    ${active
                                        ? `bg-gradient-to-br ${item.gradient} shadow-lg shadow-indigo-500/20`
                                        : "bg-slate-900 shadow-inner group-hover:bg-slate-800"
                                    }
                                `}>
                                    <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
                                </div>
                                <span className={`text-[13px] font-semibold tracking-wide ${active ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}>
                                    {item.label}
                                </span>
                                {active && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="ml-auto"
                                    >
                                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                                    </motion.div>
                                )}
                            </div>

                            {active && (
                                <motion.div
                                    layoutId="nav-bg"
                                    className="absolute inset-0 bg-slate-800/40 rounded-2xl border border-slate-700/30 -z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Profile Section */}
            <div className="p-6 mt-auto">
                <div className="p-5 rounded-[2rem] bg-slate-900/60 border border-slate-800/50 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                                {user?.email?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-bold text-white truncate">
                                {user?.email?.split("@")[0]}
                            </p>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                Administrator
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-xs font-bold transition-all duration-300 border border-red-500/20 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Sign Out System
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;

