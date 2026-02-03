import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import AdminLayout from "../../components/layout/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    RefreshCw,
    Trash2,
    Eye,
    EyeOff,
    MapPin,
    DollarSign,
    Tag,
    Search,
    Type,
    FileText,
    Grid,
    Edit2,
    X
} from "lucide-react";

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        category: "General",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, "services"));
            setServices(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching services: ", error);
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleServiceStatus = async (id, currentStatus) => {
        try {
            const serviceRef = doc(db, "services", id);
            await updateDoc(serviceRef, { active: !currentStatus });
            setServices(services.map(s => s.id === id ? { ...s, active: !currentStatus } : s));
            toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error("Error toggling status: ", error);
            toast.error("Update failed");
        }
    };

    const addService = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return toast.warn("Service title required");
        if (!formData.price) return toast.warn("Service price required");

        try {
            if (isEditing) {
                const serviceRef = doc(db, "services", editingId);
                await updateDoc(serviceRef, {
                    ...formData,
                    price: parseFloat(formData.price)
                });
                toast.success("Service intelligence updated");
                setIsEditing(false);
                setEditingId(null);
            } else {
                await addDoc(collection(db, "services"), {
                    ...formData,
                    price: parseFloat(formData.price),
                    active: true,
                    createdAt: Timestamp.now()
                });
                toast.success("New service deployed");
            }
            setFormData({ title: "", description: "", price: "", location: "", category: "General" });
            fetchServices();
        } catch (error) {
            console.error("Error saving service: ", error);
            toast.error("Operation failed");
        }
    };

    const handleEdit = (service) => {
        setFormData({
            title: service.title || "",
            description: service.description || "",
            price: service.price || "",
            location: service.location || "",
            category: service.category || "General"
        });
        setIsEditing(true);
        setEditingId(service.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ title: "", description: "", price: "", location: "", category: "General" });
    };

    const deleteService = async (id) => {
        if (!confirm("Permanently delete this service?")) return;
        try {
            await deleteDoc(doc(db, "services", id));
            fetchServices();
            toast.success("Service purged");
        } catch (error) {
            console.error("Error deleting service: ", error);
            toast.error("Cleanup failed");
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const filteredServices = services.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            {/* Header Area */}
            {/* Header section */}
            <div className="flex flex-col items-center text-center mb-16">
                <div>
                    <h2 className="text-5xl font-black text-white mb-4">Service <span className="text-indigo-500">Catalog</span></h2>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto">Configure and manage your service offerings and availability meticulously from this command center.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Find services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-900/50 border border-slate-800 focus:border-indigo-500/50 py-4 pl-12 pr-6 rounded-2xl text-sm text-white outline-none w-full transition-all focus:bg-slate-900 shadow-xl"
                    />
                </div>
                <button
                    onClick={fetchServices}
                    className="p-4 bg-slate-900 text-slate-400 rounded-2xl hover:bg-slate-800 hover:text-white transition-all border border-slate-800 shadow-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                    title="Sync Database"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                    Sync
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form Side */}
                <div className="lg:col-span-4">
                    <div className="glass-card p-8 rounded-[2.5rem] sticky top-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEditing ? 'bg-amber-500/10' : 'bg-indigo-500/10'}`}>
                                    {isEditing ? <Edit2 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{isEditing ? 'Edit Service' : 'Add Service'}</h3>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={cancelEdit}
                                    className="p-2 bg-slate-900 text-slate-500 hover:text-white rounded-lg border border-slate-800 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={addService} className="space-y-5">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                    <Type className="w-3 h-3" /> Service Name
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Executive Strategy Session"
                                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/50 p-4 rounded-2xl text-white text-sm outline-none transition-all placeholder:text-slate-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                        <DollarSign className="w-3 h-3" /> Rate
                                    </label>
                                    <input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/50 p-4 rounded-2xl text-white text-sm outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                        <MapPin className="w-3 h-3" /> Locale
                                    </label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Remote|OnSite"
                                        className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/50 p-4 rounded-2xl text-white text-sm outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                    <Grid className="w-3 h-3" /> Department
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-indigo-500/50 text-sm transition-all cursor-pointer appearance-none"
                                >
                                    {["General", "Consulting", "Maintenance", "Design", "Technical"].map(cat => (
                                        <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                    <FileText className="w-3 h-3" /> Full Breakdown
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Highlight the key benefits..."
                                    className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl text-white text-sm focus:border-indigo-500/50 outline-none transition-all h-32 resize-none placeholder:text-slate-600"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-5 text-white rounded-2xl font-bold transition-all active:scale-[0.97] shadow-lg mt-4 flex items-center justify-center gap-3 ${isEditing ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'}`}
                            >
                                {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {isEditing ? 'Update Intelligence' : 'Deploy Service'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Side */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-32"
                            >
                                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Catalog...</p>
                            </motion.div>
                        ) : filteredServices.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-24 glass-card border-dashed p-10 rounded-[3rem] border-slate-800"
                            >
                                <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Tag className="w-10 h-10 text-slate-700" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                                <p className="text-slate-500 font-medium italic">Adjust your filters or add a new service to get started.</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredServices.map((s) => (
                                    <motion.div
                                        layout
                                        key={s.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`group relative glass-card p-6 rounded-[2rem] border-2 transition-all duration-300 ${s.active ? 'border-transparent hover:border-indigo-500/30' : 'border-red-500/20 opacity-60'}`}
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/10 w-fit">
                                                    {s.category}
                                                </span>
                                                <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mt-2">{s.title}</h4>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(s)}
                                                    className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                                    title="Edit Service"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteService(s.id)}
                                                    className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                                    title="Delete Service"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                            {s.description || "No description provided for this catalog entry."}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 border-t border-slate-800/60 mb-8 pt-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Price Point</span>
                                                <span className="text-emerald-400 font-black text-2xl tracking-tight">${s.price}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Availability</span>
                                                <div className="flex items-center gap-1.5 text-slate-300 text-sm font-bold">
                                                    <MapPin className="w-3 h-3 text-indigo-400" />
                                                    {s.location || 'HQ Only'}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleServiceStatus(s.id, s.active)}
                                            className={`w-full py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${s.active ?
                                                'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white' :
                                                'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                        >
                                            {s.active ? <><EyeOff className="w-4 h-4" /> Deactivate Card</> : <><Eye className="w-4 h-4" /> Activate Card</>}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Services;

