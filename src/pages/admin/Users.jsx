import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import AdminLayout from "../../components/layout/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users as UsersIcon,
    Search,
    RefreshCw,
    Shield,
    UserCheck,
    UserX,
    Trash2,
    Mail,
    ShieldAlert,
    Filter,
    ShieldCheck,
    MoreVertical,
    Lock,
    Unlock,
    UserCircle,
    Edit2,
    X,
    Check
} from "lucide-react";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        role: "user",
        isActive: true
    });

    const auth = getAuth();
    const currentUid = auth.currentUser?.uid;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, "users"));
            setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Registry access failed");
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        if (!editFormData.name.trim()) return toast.warn("Name cannot be empty");
        if (!editFormData.email.trim()) return toast.warn("Email cannot be empty");

        try {
            const userRef = doc(db, "users", editingUser.id);
            await updateDoc(userRef, {
                name: editFormData.name,
                email: editFormData.email,
                role: editFormData.role,
                isActive: editFormData.isActive
            });
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editFormData } : u));
            setEditingUser(null);
            toast.success("Identity records updated successfully");
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Operation failed");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, "users", id), { isActive: !currentStatus });
            setUsers(users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
            toast.success(`Access ${!currentStatus ? 'reinstated' : 'revoked'}`);
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Operation failed");
        }
    };

    const toggleRole = async (id, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        try {
            await updateDoc(doc(db, "users", id), { role: newRole });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            toast.success(`Permissions elevated to ${newRole}`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Elevation failed");
        }
    };

    const deleteUser = async (id) => {
        if (!confirm("Permanently erase this identity from database records? You must still manually delete from Firebase Auth.")) return;
        try {
            await deleteDoc(doc(db, "users", id));
            setUsers(users.filter(u => u.id !== id));
            toast.success("Database record purged");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Operation failed");
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        let matchesFilter = true;
        if (filter === 'admin') matchesFilter = u.role === 'admin';
        else if (filter === 'user') matchesFilter = u.role === 'user';
        else if (filter === 'inactive') matchesFilter = u.isActive === false;
        return matchesSearch && matchesFilter;
    });

    return (
        <AdminLayout>
            {/* Header section */}
            <div className="flex flex-col items-center text-center mb-16">
                <div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4">Identity <span className="text-indigo-500">Registry</span></h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">Coordinate user permissions and verify system access privileges from this security hub.</p>
                </div>
                <div className="mt-8">
                    <button
                        onClick={fetchUsers}
                        className="p-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                        Sync Identities
                    </button>
                </div>
            </div>

            {/* Filtering Stack */}
            <div className="glass-card p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800/60 mb-16 flex flex-col items-center gap-8 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-center gap-6 w-full justify-center">
                    <div className="relative w-full lg:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            placeholder="Search identities by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-indigo-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
                        />
                    </div>

                    <div className="h-8 w-px bg-slate-800 hidden lg:block" />

                    <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap pb-2 lg:pb-0 w-full lg:w-auto scrollbar-none justify-center">
                        <Filter className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
                        {['all', 'admin', 'user', 'inactive'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 scale-105"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32"
                    >
                        <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-4" />
                        <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
                    </motion.div>
                ) : filteredUsers.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 glass-card border-dashed p-10 rounded-[3rem] border-slate-800"
                    >
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <UserX className="w-8 h-8 text-slate-400 dark:text-slate-700" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Zero matches found</h3>
                        <p className="text-slate-500 text-sm font-medium">Adjust your criteria or re-sync the registry.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredUsers.map((u, idx) => (
                            <motion.div
                                layout
                                key={u.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className={`group relative glass-card p-6 rounded-[2.5rem] border-2 transition-all duration-300 flex flex-col ${u.isActive ? 'border-transparent hover:border-indigo-500/20' : 'border-rose-500/10 opacity-60'}`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="relative">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-500 ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                                            {u.name?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase() || <UserCircle className="w-8 h-8" />}
                                        </div>
                                        {u.isActive && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#020617] rounded-full shadow-lg" />}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] border ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20' : 'bg-slate-100 dark:bg-slate-950/80 text-slate-500 border-slate-200 dark:border-slate-800'}`}>
                                            {u.role}
                                        </div>
                                        {!u.isActive && (
                                            <div className="px-2.5 py-1 rounded-lg text-[8px] font-black uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                                LOCKED
                                            </div>
                                        )}
                                        <button
                                            onClick={() => {
                                                setEditingUser(u);
                                                setEditFormData({
                                                    name: u.name || "",
                                                    email: u.email || "",
                                                    role: u.role || "user",
                                                    isActive: u.isActive !== false
                                                });
                                            }}
                                            className="mt-2 p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all border border-slate-200 dark:border-slate-800"
                                            title="Edit identity"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                <div className="min-w-0 mb-8">
                                    <h4 className="text-slate-900 dark:text-white font-bold truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors uppercase tracking-tight text-[15px] mb-1">
                                        {u.name || 'Incognito User'}
                                    </h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">
                                        <Mail className="w-3 h-3 text-slate-600" />
                                        {u.email}
                                    </div>
                                </div>

                                <div className="mt-auto space-y-3 pt-6 border-t border-slate-800/60">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => toggleRole(u.id, u.role)}
                                            className="flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-950/60 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-slate-800/80 group/btn"
                                        >
                                            <Shield className="w-3.5 h-3.5" />
                                            Role
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(u.id, u.isActive)}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${u.isActive ? 'border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10'}`}
                                        >
                                            {u.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                            {u.isActive ? 'Lock' : 'Grant'}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => deleteUser(u.id)}
                                        disabled={u.id === currentUid}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/5 hover:bg-rose-500 text-rose-500/60 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-rose-500/10 disabled:opacity-10 group/del"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 group-hover/del:scale-110 transition-transform" />
                                        Purge Identity
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Edit User Modal */}
            <AnimatePresence>
                {editingUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingUser(null)}
                            className="absolute inset-0 bg-white/60 dark:bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-lg relative"
                        >
                            <div className="glass-card p-10 rounded-[3rem] border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.1)] overflow-hidden relative">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16" />

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-500 shadow-lg shadow-indigo-500/20 rounded-2xl flex items-center justify-center text-white">
                                            <Edit2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Modify <span className="text-indigo-500">Identity</span></h3>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Refining Profile Protocol</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEditingUser(null)}
                                        className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all border border-slate-200 dark:border-slate-800"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={updateUser} className="space-y-5 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Identity</label>
                                        <div className="relative group">
                                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                value={editFormData.name}
                                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                                placeholder="Name"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Communication Channel</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="email"
                                                value={editFormData.email}
                                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                                placeholder="Email"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">System Role</label>
                                            <div className="relative">
                                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <select
                                                    value={editFormData.role}
                                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-slate-900 dark:text-white outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="user" className="bg-white dark:bg-slate-900">User</option>
                                                    <option value="admin" className="bg-white dark:bg-slate-900">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Access Status</label>
                                            <div
                                                onClick={() => setEditFormData({ ...editFormData, isActive: !editFormData.isActive })}
                                                className={`flex items-center justify-between py-4 px-6 rounded-2xl border cursor-pointer transition-all ${editFormData.isActive ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest">{editFormData.isActive ? 'Active' : 'Locked'}</span>
                                                {editFormData.isActive ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditingUser(null)}
                                            className="flex-1 py-4 bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-slate-200 dark:border-slate-800"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
                                        >
                                            Confirm Update
                                            <Check className="w-4 h-4 group-hover:scale-125 transition-transform" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}