import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../app/context/AuthContext";
import UserLayout from "../../components/layout/UserLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Clock, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { toast } from "react-toastify";
import { openRazorpay } from "../../utils/razorpayPayment";

const Home = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchServices = async () => {
        setFetching(true);
        try {
            const snap = await getDocs(collection(db, "services"));
            const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setServices(list.filter(s => s.active !== false));
        } catch (error) {
            console.error(error);
            toast.error("Failed to sync service catalog.");
        } finally {
            setFetching(false);
        }
    };

    const bookAppointment = (service) => {
        if (!user) {
            toast.error("Please login to continue.");
            return;
        }

        openRazorpay({
            amount: service.price,
            serviceName: service.title,

            onSuccess: async (payment) => {
                setLoading(true);
                try {
                    await addDoc(collection(db, "appointments"), {
                        userId: user.uid,
                        userEmail: user.email,

                        serviceId: service.id,
                        serviceName: service.title,
                        price: service.price,

                        payment: {
                            provider: "razorpay",
                            paymentId: payment.razorpay_payment_id,
                            orderId: payment.razorpay_order_id || null,
                            signature: payment.razorpay_signature || null,
                            mode: "test",
                        },

                        status: "confirmed",
                        createdAt: Timestamp.now(),
                    });

                    toast.success(`✅ ${service.title} booked successfully!`);
                } catch (e) {
                    console.error(e);
                    toast.error("Payment done, but booking failed.");
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <UserLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="flex items-center justify-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.3em] mb-4">
                    <Sparkles className="w-4 h-4" />
                    Premium Experience
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
                    Professional <span className="text-gradient">Services</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    Select from our curated list of high-performance services.
                    Each session is handled by top-tier professionals in the ecosystem.
                </p>
            </motion.div>

            {fetching ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Zap className="w-12 h-12 text-indigo-500 animate-pulse mb-4" />
                    <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Catalog...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {services.map((s, idx) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className="glass-card p-8 rounded-[2.5rem] h-full flex flex-col border-white/5 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Zap className="w-7 h-7" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black text-white">${s.price}</span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Starting Rate</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{s.title}</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                    {s.description || "High-performance service optimized for maximum results within our integrated workflow ecosystem."}
                                </p>

                                <div className="space-y-3 mb-8 mt-auto">
                                    <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
                                        <MapPin className="w-4 h-4 text-indigo-500" />
                                        {s.location || "Remote Access"}
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
                                        <Clock className="w-4 h-4 text-indigo-500" />
                                        Estimated: 60-90 min
                                    </div>
                                </div>

                                <button
                                    onClick={() => bookAppointment(s)}
                                    disabled={loading}
                                    className="w-full py-4 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    Initialize Booking
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </UserLayout>
    );
};

export default Home;