import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Search,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    Mail,
    User,
    Filter,
    ArrowRightLeft,
    Check,
    X,
    RotateCcw,
    MessageSquare
} from "lucide-react";
import { toast } from "react-toastify";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setAppointments(list);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("Discovery failed");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await updateDoc(doc(db, "appointments", id), { status });
            toast.success(`Booking ${status}`);
            fetchAppointments();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Modification failed");
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter(a => {
        const matchesStatus = filter === 'all' || a.status === filter;
        const searchLower = searchTerm.toLowerCase();
        return matchesStatus && (
            (a.serviceName?.toLowerCase() || "").includes(searchLower) ||
            (a.userEmail?.toLowerCase() || "").includes(searchLower)
        );
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return {
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-500',
                border: 'border-emerald-500/20',
                icon: CheckCircle2
            };
            case 'rejected': return {
                bg: 'bg-rose-500/10',
                text: 'text-rose-500',
                border: 'border-rose-500/20',
                icon: XCircle
            };
            default: return {
                bg: 'bg-amber-500/10',
                text: 'text-amber-500',
                border: 'border-amber-500/20',
                icon: Clock
            };
        }
    };

    return (
        <AdminLayout>
            {/* Header section */}
            <div className="flex flex-col items-center text-center mb-16">
                <div>
                    <h2 className="text-5xl font-black text-white mb-4">Booking <span className="text-indigo-500">Pipeline</span></h2>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto">Monitor and moderate incoming service requests meticulously from this centralized ledger.</p>
                </div>
                <div className="mt-8">
                    <button
                        onClick={fetchAppointments}
                        className="p-4 bg-slate-900 text-slate-400 rounded-2xl hover:bg-slate-800 hover:text-white transition-all border border-slate-800 shadow-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                        Refresh Registry
                    </button>
                </div>
            </div>

            {/* Advanced Filtering */}
            <div className="glass-card p-8 rounded-[3rem] border border-slate-800/60 mb-16 flex flex-col items-center gap-8 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-center gap-6 w-full justify-center">
                    <div className="relative w-full lg:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            placeholder="Filter by service or client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-600 shadow-inner"
                        />
                    </div>

                    <div className="h-8 w-px bg-slate-800 hidden lg:block" />

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-none justify-center">
                        <Filter className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
                        {['all', 'pending', 'approved', 'rejected'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === s
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 scale-105"
                                    : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Stream */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32"
                        >
                            <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-4" />
                            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Scanning Pipeline...</p>
                        </motion.div>
                    ) : filteredAppointments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24 glass-card border-dashed p-10 rounded-[3rem] border-slate-800"
                        >
                            <div className="w-16 h-16 bg-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Calendar className="w-8 h-8 text-slate-700" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Queue is empty</h3>
                            <p className="text-slate-500 text-sm font-medium">No appointments match your current filter parameters.</p>
                        </motion.div>
                    ) : (
                        filteredAppointments.map((a, idx) => {
                            const statusStyle = getStatusStyle(a.status);
                            const StatusIcon = statusStyle.icon;

                            return (
                                <motion.div
                                    key={a.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className="group bg-slate-900/40 border border-slate-800/60 p-6 rounded-[2.5rem] flex flex-col lg:flex-row justify-between lg:items-center gap-6 hover:bg-slate-900/60 hover:border-indigo-500/20 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        <div className={`w-14 h-14 rounded-[1.25rem] ${statusStyle.bg} flex items-center justify-center flex-shrink-0 border ${statusStyle.border} group-hover:scale-105 transition-transform`}>
                                            <StatusIcon className={`w-7 h-7 ${statusStyle.text}`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3 mb-1.5 overflow-hidden">
                                                <h4 className="text-[17px] font-bold text-white truncate group-hover:text-indigo-300 transition-colors uppercase tracking-tight">
                                                    {a.serviceName || "Legacy Request"}
                                                </h4>
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border tracking-tighter ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                    {a.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 truncate max-w-[200px]">
                                                    <Mail className="w-3.5 h-3.5 text-indigo-400/60" />
                                                    <span className="truncate">{a.userEmail || "anonymous@client.io"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5 text-emerald-400/60" />
                                                    {a.booking?.date || a.date || "Unscheduled"}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <Clock className="w-3.5 h-3.5 text-indigo-400/60" />
                                                    {a.booking?.time || "Time TBD"}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <User className="w-3.5 h-3.5 text-amber-400/60" />
                                                    ID: {(a.userId || "0000").slice(-4).toUpperCase()}
                                                </div>
                                            </div>
                                            {a.booking?.instructions && (
                                                <div className="mt-3 p-3 bg-slate-950/30 rounded-xl border border-white/5 flex items-start gap-2 max-w-lg">
                                                    <MessageSquare className="w-3.5 h-3.5 text-slate-600 mt-0.5 flex-shrink-0" />
                                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                                                        "{a.booking.instructions}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 lg:pl-10">
                                        {a.status === "pending" ? (
                                            <div className="flex gap-2 w-full lg:w-auto">
                                                <button
                                                    onClick={() => updateStatus(a.id, "approved")}
                                                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-[0.95] border border-emerald-500/20 shadow-lg shadow-emerald-500/5 group/btn"
                                                >
                                                    <Check className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                                    Validate
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(a.id, "rejected")}
                                                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-[0.95] border border-rose-500/20 shadow-lg shadow-rose-500/5 group/btn"
                                                >
                                                    <X className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                                    Dismiss
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => updateStatus(a.id, "pending")}
                                                className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-[0.95] border border-slate-700/50 group/btn"
                                            >
                                                <RotateCcw className="w-4 h-4 group-hover/btn:rotate-[-120deg] transition-transform" />
                                                Reset Status
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
};

export default Appointments;