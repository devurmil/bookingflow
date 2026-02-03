import { motion } from "framer-motion";
import { Lock, LogOut, ShieldAlert, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";

const Locked = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
            toast.info("Session terminated.");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg z-10 text-center"
            >
                <div className="glass-card p-12 rounded-[3rem] border border-rose-500/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />

                    <motion.div
                        initial={{ rotate: -20, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                        }}
                        className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.2)]"
                    >
                        <Lock className="w-12 h-12 text-rose-500" />
                    </motion.div>

                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Access <span className="text-rose-500">Restricted</span></h1>
                    <h2 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-[0.3em]">Identity Authentication Required</h2>

                    <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 mb-10">
                        <p className="text-slate-400 font-medium leading-relaxed text-sm">
                            Your security clearance has been temporarily suspended by a System Administrator. Please contact the headquarters to reinstate your operational status.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-rose-600/20 active:scale-95 group"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Terminate Session
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-slate-800 active:scale-95"
                        >
                            <Home className="w-4 h-4" />
                            Return to Portal
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-center items-center gap-3 opacity-20">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Security Protocol 403-B ACTIVE</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Locked;
