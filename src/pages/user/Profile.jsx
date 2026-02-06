import React, { useState, useEffect } from "react";
import { useAuth } from "../../app/context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import {
    User,
    Mail,
    Shield,
    Calendar,
    LogOut,
    ArrowRight,
    Settings,
    CheckCircle2,
    Lock,
    ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut, updatePassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const UserProfile = () => {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalOrders: 0 });
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        newPassword: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                // Fetch stats
                const q = query(collection(db, "appointments"), where("userId", "==", user.uid));
                const snap = await getDocs(q);
                setStats({ totalOrders: snap.size });

                // Fetch name from firestore
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setFormData(prev => ({ ...prev, name: userSnap.data().name || "" }));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
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

            toast.success("Profile system updated successfully");
        } catch (error) {
            console.error("Update error:", error);
            if (error.code === "auth/requires-recent-login") {
                toast.error("Please re-login to update sensitive data");
                await signOut(auth);
                navigate("/login");
            } else {
                toast.error(error.message || "Failed to update profile");
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
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Sidebar: Brief Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="dark:bg-gray-900 bg-gray-200 p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors" />

                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-6 shadow-xl shadow-indigo-500/20">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </div>

                                <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight mb-1 truncate">
                                    {formData.name || user?.displayName || user?.email?.split('@')[0]}
                                </h2>
                                <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                                    {role === 'admin' ? 'Administrator' : 'Verified Client'}
                                </p>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bookings</span>
                                        <span className="text-sm font-black text-gray-800 dark:text-white">{stats.totalOrders}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black text-emerald-500">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-rose-500/10 dark:bg-rose-500/20 p-6 rounded-[2rem] border-white/5 flex items-center justify-between text-rose-500 hover:bg-rose-500/10 transition-all group active:scale-95"
                        >
                            <span className="text-xs font-black uppercase tracking-widest">Sign Out System</span>
                            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Right Content: Settings */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="dark:bg-gray-900 bg-gray-200 p-10 rounded-[3rem] border-white/5"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                    <Settings className="w-6 h-6 text-indigo-800 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">Account Settings</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="group">
                                    <label className="text-[10px] font-black text-gray-800 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Registered Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            readOnly
                                            value={user?.email || ""}
                                            className="w-full dark:bg-slate-950/50 bg-slate-400/50 border border-white/5 rounded-2xl p-4 pl-12 text-sm dark:text-slate-300 text-slate-900 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div className="p-6 dark:bg-slate-900/40 bg-slate-400/50 border border-white/5 rounded-[2rem] space-y-4">
                                        <div className="w-10 h-10 dark:bg-indigo-500/10 bg-indigo-500/30 rounded-xl flex items-center justify-center dark:text-indigo-400 text-indigo-900 mb-2">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-sm font-black dark:text-white text-slate-900">Identity Update</h4>
                                        <div className="space-y-3">
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-slate-500 text-slate-900 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="Verification Name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full dark:bg-slate-950/50 bg-slate-400/50 border border-white/5 focus:border-indigo-400/30 rounded-xl p-3 pl-12 text-xs dark:text-white text-slate-900 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-slate-500 text-slate-900 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="password"
                                                    placeholder="New Security Key (Optional)"
                                                    value={formData.newPassword}
                                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                    className="w-full dark:bg-slate-950/50 bg-slate-400/50 border border-white/5 focus:border-indigo-400/30 rounded-xl p-3 pl-12 text-xs dark:text-white text-slate-900 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleUpdate}
                                            disabled={isUpdating}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                        >
                                            {isUpdating ? "Synchronizing..." : "Commit Changes"}
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="p-6 dark:bg-slate-900/40 bg-slate-400/50 border border-white/5 rounded-[2rem] space-y-3">
                                        <div className="w-10 h-10 dark:bg-emerald-500/10 bg-emerald-500/30 rounded-xl flex items-center justify-center dark:text-emerald-400 text-emerald-900 mb-2">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-sm font-black dark:text-white text-slate-900">Booking History</h4>
                                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-4">View and manage all your past and upcoming sessions.</p>
                                        <button
                                            onClick={() => navigate('/my-appointments')}
                                            className="text-[10px] font-black dark:text-emerald-400 text-emerald-900 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-300 transition-colors"
                                        >
                                            View Logs <ExternalLink className="w-3 h-3" />
                                        </button>
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

export default UserProfile;
