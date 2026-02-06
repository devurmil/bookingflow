import { motion } from "framer-motion";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 blur-[150px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg z-10 text-center"
            >
                <div className="glass-card p-12 rounded-[3rem] border border-rose-500/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />

                    <motion.div
                        initial={{ rotate: -10, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.2)]"
                    >
                        <ShieldAlert className="w-12 h-12 text-rose-500" />
                    </motion.div>

                    <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">403</h1>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest">Protocol Breach</h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                        Validation failed. Your current identity token lacks the necessary clearance for this restricted sector.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-slate-200 dark:border-slate-800 active:scale-95 group"
                        >
                            <Home className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                            Return Base
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-rose-500/20 active:scale-95 shadow-lg shadow-rose-500/5 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Previous Node
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-center items-center gap-3 opacity-40 dark:opacity-30">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Restricted Zone</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Unauthorized;

