import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Zap } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);

            const userDoc = await getDoc(doc(db, "users", res.user.uid));

            if (!userDoc.exists()) {
                await auth.signOut();
                toast.error("Access Denied: Identity records purged from registry.");
                setIsSubmitting(false);
                return;
            }

            const userData = userDoc.data();

            if (userData.isActive === false) {
                await auth.signOut();
                navigate("/locked");
                return;
            }

            if (userData.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

            toast.success("Identity Verified. Welcome back.");
        } catch (error) {
            toast.error("Access Denied: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                    >
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Portal <span className="text-indigo-500">Access</span></h1>
                    <p className="text-slate-400 font-medium">Secure authentication for Workspace Intelligence.</p>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800/60 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Terminal</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="operator@system.io"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Access Cipher</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 group active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <Zap className="w-4 h-4 animate-spin text-white/50" />
                            ) : (
                                <>
                                    Establish Link
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-800/60 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            New operator?{" "}
                            <span
                                className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors font-bold underline underline-offset-4 decoration-indigo-500/30"
                                onClick={() => navigate('/register')}
                            >
                                Register Identity
                            </span>
                        </p>
                    </div>
                </div>

                <div className="mt-12 flex justify-center gap-8 opacity-20 filter grayscale contrast-125">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                        <ShieldCheck className="w-3 h-3" />
                        AES-256 SECURED
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                        <Zap className="w-3 h-3 text-amber-500" />
                        ULTRA LOW LATENCY
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;