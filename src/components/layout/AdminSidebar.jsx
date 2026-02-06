import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../app/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import {
    LayoutDashboard,
    Wrench,
    CalendarCheck,
    Users,
    LogOut,
    ChevronRight,
    CircleDot,
    Settings,
    Sun,
    Moon
} from "lucide-react";
import { useTheme } from "../../app/context/ThemeContext";

const AdminSidebar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [userName, setUserName] = useState(null);
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

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user) return;
            try {
                const usersSnap = await getDocs(collection(db, "users"));

                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserName(userSnap.data().name);
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };
        fetchAdminData();
    }, [user]);

    const navItems = [
        { path: "/admin", label: "Dashboard", icon: LayoutDashboard, gradient: "from-indigo-500 to-blue-600" },
        { path: "/services", label: "Services", icon: Wrench, gradient: "from-emerald-500 to-teal-600" },
        { path: "/appointments", label: "Appointments", icon: CalendarCheck, gradient: "from-amber-500 to-orange-600" },
        { path: "/users", label: "Users", icon: Users, gradient: "from-rose-500 to-pink-600" },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/60 z-50 flex flex-col shadow-[20px_0_40px_-20px_rgba(0,0,0,0.1)] dark:shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="p-8 pb-10">
                <Link to="/admin/profile" className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
                            B
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#020617] rounded-full shadow-lg" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Booking<span className="text-indigo-500 group-hover:text-white">Flow</span>
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <CircleDot className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Admin System
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 scrollbar-none overflow-y-auto">
                <p className="px-5 mb-4 text-[10px] font-bold dark:text-slate-600 text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
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
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-800 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                                }
                            `}>
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                    ${active
                                        ? `bg-gradient-to-br ${item.gradient} shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/20`
                                        : "bg-slate-100 dark:bg-slate-900 shadow-inner group-hover:bg-slate-200 dark:group-hover:bg-slate-800"
                                    }
                                `}>
                                    <Icon className={`w-5 h-5 ${active ? "text-white dark:text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
                                </div>
                                <span className={`text-[13px] font-semibold tracking-wide ${active ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}>
                                    {item.label}
                                </span>
                                {active && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="ml-auto"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-900 dark:text-indigo-400" />
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
                <div className="p-5 rounded-[2rem] bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/50 backdrop-blur-md">
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
                            <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                                {userName || "Admin"}
                            </p>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                Administrator
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to="/admin/profile"
                            className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700/50 group active:scale-95"
                            title="Admin Settings"
                        >
                            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 rounded-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700/50 group active:scale-95"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                            ) : (
                                <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
                            )}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-xs font-bold transition-all duration-300 border border-red-500/20 group active:scale-95"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;

