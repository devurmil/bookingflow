import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await setDoc(doc(db, "users", res.user.uid), {
                name,
                email: res.user.email,
                role: "user",
                isActive: true,
                createdAt: new Date(),
            });
            toast.success("Identity Created. Welcome to the ecosystem.");
            await auth.signOut();
            navigate("/login");

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                toast.warning("Identity already exists. Proceed to login.");
            } else {
                toast.error(error.message);
            }
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full" />
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
                        className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                    >
                        <UserPlus className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">System <span className="text-emerald-500">Registry</span></h1>
                    <p className="text-slate-400 font-medium">Initialize your professional profile within our network.</p>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800/60 shadow-2xl">
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Legal Identity</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-emerald-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Communication Channel</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="operator@nexus.io"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-emerald-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-emerald-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 group active:scale-[0.98] mt-4"
                        >
                            {isSubmitting ? (
                                <Zap className="w-4 h-4 animate-spin text-white/50" />
                            ) : (
                                <>
                                    Initialize Account
                                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-800/60 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Already registered?{" "}
                            <span
                                className="text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors font-bold underline underline-offset-4 decoration-emerald-500/30"
                                onClick={() => navigate('/login')}
                            >
                                Secure Login
                            </span>
                        </p>
                    </div>
                </div>

                <div className="mt-12 flex justify-center gap-8 opacity-20 filter grayscale contrast-125">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                        <ShieldCheck className="w-3 h-3" />
                        GDPR COMPLIANT
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                        <Zap className="w-3 h-3 text-amber-500" />
                        INSTANT PROVISIONING
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

