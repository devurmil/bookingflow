import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../app/context/AuthContext";
import { motion } from "framer-motion";
import { LogOut, User as UserIcon, Calendar, Grid, LayoutDashboard, Settings } from "lucide-react";

const Navbar = () => {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const navItems = role === 'user'
        ? [
            { path: "/", label: "Services", icon: Grid },
            { path: "/my-appointments", label: "My Bookings", icon: Calendar },
        ]
        : [
            { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { path: "/admin/services", label: "Services", icon: Grid },
            { path: "/admin/appointments", label: "Registry", icon: Calendar },
            { path: "/admin/users", label: "Users", icon: UserIcon },
        ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-6 mx-auto max-w-7xl px-6 z-50">
            <div className="px-8 py-4 rounded-[2rem] flex items-center justify-between shadow-2xl dark:shadow-indigo-500/10 backdrop-blur-xl transition-all duration-300 border border-white/20 bg-white/90 dark:bg-slate-900/80 dark:border-white/10">
                <div className="flex items-center gap-10">
                    <Link to={role === 'admin' ? '/admin' : '/'} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                            B
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-800 dark:text-white hidden sm:block">
                            Booking<span className="text-indigo-600 dark:text-indigo-500">Flow</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative group ${isActive(item.path) ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                    }`}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <item.icon className={`w-4 h-4 ${isActive(item.path) ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"}`} />
                                    {item.label}
                                </span>
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute inset-0 bg-indigo-500/10 rounded-xl border border-indigo-500/20"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[11px] font-black text-slate-800 dark:text-white leading-none mb-1 uppercase tracking-wider">
                            {user?.email?.split('@')[0]}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            {role === 'admin' ? 'Super Administrator' : 'Verified Client'}
                        </span>
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

                    <Link
                        to="/profile"
                        className="w-10 h-10 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-500/10 dark:hover:bg-indigo-500 dark:text-indigo-400 dark:hover:text-white rounded-xl transition-all border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center font-black active:scale-95 group relative"
                        title="Account Settings"
                    >
                        {user?.email?.charAt(0).toUpperCase()}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-100 dark:border-slate-900 rounded-full" />
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="p-2.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-rose-500/10 dark:hover:bg-rose-500 dark:text-rose-500 dark:hover:text-white rounded-xl transition-all border border-rose-200 dark:border-rose-500/20 flex items-center gap-2 active:scale-95 group"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Exit</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

