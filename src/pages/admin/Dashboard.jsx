import { useEffect, useState } from "react";
import { collection, getDocs, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminLayout from "../../components/layout/AdminLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Wrench,
    CalendarClock,
    Users as UsersIcon,
    Hourglass,
    TrendingUp,
    ShieldCheck,
    Database,
    ChevronRight,
    ArrowUpRight,
    Zap
} from "lucide-react";

const Dashboard = () => {
    const [stats, setStats] = useState({
        services: 0,
        appointments: 0,
        users: 0,
        pending: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const servicesRef = collection(db, "services");
                const appointmentsRef = collection(db, "appointments");
                const usersRef = collection(db, "users");

                const [
                    servicesCount,
                    appointmentsCount,
                    usersCount,
                    pendingSnap
                ] = await Promise.all([
                    getCountFromServer(servicesRef),
                    getCountFromServer(appointmentsRef),
                    getCountFromServer(usersRef),
                    getDocs(query(appointmentsRef, where("status", "==", "pending")))
                ]);

                setStats({
                    services: servicesCount.data().count,
                    appointments: appointmentsCount.data().count,
                    users: usersCount.data().count,
                    pending: pendingSnap.size
                });
            } catch (err) {
                console.error("Dashboard stats error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statItems = [
        {
            label: "Active Services",
            value: stats.services,
            icon: Wrench,
            color: "indigo",
            description: "Services in catalog"
        },
        {
            label: "Total Bookings",
            value: stats.appointments,
            icon: CalendarClock,
            color: "emerald",
            description: "Successful sessions"
        },
        {
            label: "Critical Pending",
            value: stats.pending,
            icon: Hourglass,
            color: "amber",
            description: "Awaiting confirmation"
        },
        {
            label: "User Base",
            value: stats.users,
            icon: UsersIcon,
            color: "rose",
            description: "Registered clients"
        },
    ];

    const quickActions = [
        { to: "/admin/services", label: "Inventory control", sub: "Manage your services", icon: Wrench, color: "indigo" },
        { to: "/admin/appointments", label: "Session Feed", sub: "Review all bookings", icon: CalendarClock, color: "emerald" },
        { to: "/admin/users", label: "Client Directory", sub: "User management", icon: UsersIcon, color: "rose" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <AdminLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-20 text-center flex flex-col items-center"
            >
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                    <TrendingUp className="w-4 h-4" />
                    Real-time Metrics
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
                    Workspace <span className="text-gray-400 dark:text-gradient">Intelligence</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
                    Monitor system performance, manage service availability, and oversee user interactions from a centralized command center.
                </p>
            </motion.div>

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-400 font-semibold"
                >
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                        ⚠️
                    </div>
                    Data synchronization failed. Connectivity issues detected.
                </motion.div>
            )}

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 justify-center"
            >
                {statItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="relative group overflow-hidden"
                        >
                            <div className="glass-card p-7 rounded-[2.5rem] relative z-10 h-full flex flex-col">
                                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    <Icon className={`w-7 h-7 text-${item.color}-400`} />
                                </div>

                                <span className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">
                                    {item.label}
                                </span>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                                        {loading ? "..." : item.value}
                                    </h3>
                                    <span className="text-emerald-500 text-xs font-bold">+12%</span>
                                </div>
                                <p className="text-slate-500 text-[11px] font-bold mt-auto italic">
                                    {item.description}
                                </p>

                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-600/5 blur-[50px] -mr-16 -mt-16 rounded-full group-hover:bg-${item.color}-600/10 transition-colors`} />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-7"
                >
                    <div className="glass-card p-10 rounded-[3rem] h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <Zap className="w-6 h-6 text-amber-400" />
                                Core Operations
                            </h3>
                            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest bg-indigo-500/5 px-4 py-2 rounded-full border border-indigo-500/10">
                                View Logs
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quickActions.map((action, idx) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={idx}
                                        to={action.to}
                                        className="group p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-500 flex flex-col gap-4"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-${action.color}-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-bold mb-1 flex items-center gap-2">
                                                {action.label}
                                                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                                            </p>
                                            <p className="text-slate-500 text-xs font-medium">{action.sub}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* System Health */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-5"
                >
                    <div className="glass-card p-10 rounded-[3rem] h-full border-indigo-500/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                System Integrity
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: "Cloud Firestore", status: "Operational", color: "emerald", icon: Database },
                                { name: "Firebase Auth", status: "Active", color: "indigo", icon: ShieldCheck },
                                { name: "Internal API", status: "Stable", color: "blue", icon: Zap },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/40 hover:bg-white dark:hover:bg-slate-900/60 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800/50">
                                                <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-bold text-sm tracking-wide">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-400 animate-pulse`} />
                                            <span className={`text-${item.color}-400 text-[10px] font-black uppercase tracking-widest`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-8 p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-slate-900 dark:text-white font-bold text-sm mb-1 italic">Optimization Recommendation</p>
                                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">Consider indexing the 'appointments' collection for faster query performance.</p>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
                                <Zap className="w-8 h-8 text-indigo-400" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;

