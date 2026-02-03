import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../app/context/AuthContext";
import { useEffect, useState } from "react";
import UserLayout from "../../components/layout/UserLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, XCircle, Hourglass, Search, RefreshCw, Archive } from "lucide-react";

const MyAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyAppointments = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, "appointments"),
                where("userId", "==", user.uid)
            );
            const snap = await getDocs(q);
            setAppointments(
                snap.docs.map(d => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())
            );
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyAppointments();
    }, [user]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'approved': return {
                icon: CheckCircle2,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                label: 'Verified'
            };
            case 'rejected': return {
                icon: XCircle,
                color: 'text-rose-400',
                bg: 'bg-rose-500/10',
                border: 'border-rose-500/20',
                label: 'Dismissed'
            };
            default: return {
                icon: Hourglass,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
                label: 'Moderating'
            };
        }
    };

    return (
        <UserLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.3em] mb-4">
                        <Archive className="w-4 h-4" />
                        Engagement History
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight leading-none">
                        My <span className="text-gradient">Bookings</span>
                    </h1>
                </div>
                <button
                    onClick={fetchMyAppointments}
                    className="p-4 bg-slate-900 text-slate-400 rounded-2xl hover:bg-slate-800 hover:text-white transition-all border border-slate-800 shadow-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest active:scale-95"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Sync Bookings
                </button>
            </motion.div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <Hourglass className="w-12 h-12 text-indigo-500 animate-pulse mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Retrieving Records...</p>
                </div>
            ) : appointments.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-20 rounded-[3rem] text-center border-dashed border-slate-800"
                >
                    <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-slate-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-500 mb-2">No Service Records Found</h3>
                    <p className="text-slate-600 font-medium">Your booking history is currently empty in this sector.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                    {appointments.map((a, idx) => {
                        const status = getStatusStyles(a.status);
                        return (
                            <motion.div
                                key={a.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group"
                            >
                                <div className="glass-card p-7 rounded-[2.5rem] border-white/5 hover:border-indigo-500/20 transition-all duration-500 shadow-2xl h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${status.bg} ${status.color} ${status.border}`}>
                                            <status.icon className="w-3 h-3" />
                                            {status.label}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            #{a.id.substring(0, 8)}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">
                                        {a.serviceName || "Service Session"}
                                    </h3>

                                    <div className="mt-auto pt-6 border-t border-slate-800/40 space-y-3">
                                        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                                            <Calendar className="w-3.5 h-3.5 text-indigo-500/50" />
                                            Request Sent: {a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString() : 'Pending Sync'}
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                                            <Clock className="w-3.5 h-3.5 text-indigo-500/50" />
                                            Transmission: {a.createdAt?.toDate ? a.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </UserLayout>
    );
};

export default MyAppointments;