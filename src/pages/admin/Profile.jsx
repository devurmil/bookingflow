import React, { useState, useEffect } from "react";
import { useAuth } from "../../app/context/AuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import {
    Shield,
    Mail,
    Lock,
    Settings,
    LogOut,
    ArrowRight,
    Users,
    User,
    Activity,
    Database,
    Bell
} from "lucide-react";
import { motion } from "framer-motion";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { signOut, updatePassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AdminProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalServices: 0
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        newPassword: ""
    });

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user) return;
            try {
                // Fetch Stats
                const usersSnap = await getDocs(collection(db, "users"));
                const servicesSnap = await getDocs(collection(db, "services"));
                setStats({
                    totalUsers: usersSnap.size,
                    totalServices: servicesSnap.size
                });

                // Fetch name from firestore
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setFormData(prev => ({ ...prev, name: userSnap.data().name || "" }));
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };
        fetchAdminData();
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!user) return;
        setIsUpdating(true);

        try {
            // Update Name in Firestore
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                name: formData.name
            });

            // Update Auth Profile
            await updateProfile(user, {
                displayName: formData.name
            });

            // Update Password if provided
            if (formData.newPassword) {
                if (formData.newPassword.length < 6) {
                    throw new Error("Password must be at least 6 characters");
                }
                await updatePassword(user, formData.newPassword);
                setFormData(prev => ({ ...prev, newPassword: "" }));
            }

            toast.success("Administrative identity updated");
        } catch (error) {
            console.error("Update error:", error);
            if (error.code === "auth/requires-recent-login") {
                toast.error("Critical update requires fresh re-authentication");
                await signOut(auth);
                navigate("/login");
            } else {
                toast.error(error.message || "Failed to sync identity");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
            toast.info("Logged out successfully");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-white">
            <AdminSidebar />

            <main className="flex-1 ml-72 p-12">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-white mb-2">Account Control</h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Administrator Terminal</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Admin Identity Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden group h-full flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl -mr-32 -mt-32" />

                            <div>
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center text-4xl font-black mb-8 border border-white/10 shadow-2xl relative">
                                    {user?.email?.charAt(0).toUpperCase()}
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-slate-950 shadow-lg">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black tracking-tight mb-2">
                                    {formData.name || user?.displayName || user?.email?.split('@')[0]}
                                </h3>
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-10">{user?.email}</p>

                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Status</p>
                                        <p className="text-sm font-black text-emerald-400">Authenticated Admin</p>
                                    </div>
                                    <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-1">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Security Level</p>
                                        <p className="text-sm font-black text-amber-400">High Protection</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="mt-8 w-full py-4 px-6 bg-slate-900/60 hover:bg-rose-600/20 text-slate-400 hover:text-rose-500 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/5 group"
                            >
                                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Terminate Session
                            </button>
                        </div>
                    </motion.div>

                    {/* Performance & Global Settings */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-slate-900/30"
                            >
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Users</h4>
                                <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-slate-900/30"
                            >
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                                    <Database className="w-5 h-5" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Live Services</h4>
                                <p className="text-3xl font-black text-white">{stats.totalServices}</p>
                            </motion.div>
                        </div>

                        {/* Quick Settings Form */}
                        <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-slate-900/40 space-y-6">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Identity Sync</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Admin Display Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1">Universal Key Update</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                            >
                                {isUpdating ? "Processing..." : "Commit Administrative Updates"}
                            </button>
                        </div>

                        {/* System Preference Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-10 rounded-[3rem] border-white/5 bg-slate-900/20"
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight">Security & Preferences</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-8 bg-slate-950/40 rounded-[2rem] border border-white/5 flex flex-col items-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white">Security Protocol</h4>
                                        <p className="text-[11px] font-medium text-slate-500 max-w-xs mx-auto mt-1">Updates to these credentials take immediate effect across all administrative entry points.</p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                        <Activity className="w-3 h-3 text-amber-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Admin Protection Active</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminProfile;
