import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../app/context/AuthContext";
import UserLayout from "../../components/layout/UserLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Clock, ArrowRight, ArrowLeft, CheckCircle2, Zap, Calendar, MessageSquare, Info } from "lucide-react";
import { toast } from "react-toastify";
import { openRazorpay } from "../../utils/razorpayPayment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [selectedService, setSelectedService] = useState(null);
    const [step, setStep] = useState(1);

    const [bookingDate, setBookingDate] = useState(null);
    const [instructions, setInstructions] = useState("");

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

                        booking: {
                            date: bookingDate ? bookingDate.toLocaleDateString() : "",
                            time: bookingDate ? bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                            instructions,
                        },

                        payment: {
                            provider: "razorpay",
                            paymentId: payment.razorpay_payment_id,
                            orderId: payment.razorpay_order_id || null,
                            signature: payment.razorpay_signature || null,
                            mode: "test",
                        },

                        status: "pending",
                        createdAt: Timestamp.now(),
                    });

                    toast.success(`💳 Payment successful! Your booking for ${service.title} is now being moderated.`);
                    setSelectedService(null);
                    setStep(1);
                    setBookingDate(null);
                    setInstructions("");
                } catch (e) {
                    console.error(e);
                    toast.error("Payment done, but booking failed.");
                    setSelectedService(null);
                    setStep(1);
                    setBookingDate(null);
                    setInstructions("");
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
                                    onClick={() => {
                                        if (!user) return toast.error("Please login to continue.");
                                        setSelectedService(s);
                                        setStep(1);
                                    }}
                                    disabled={loading}
                                    className="w-full py-4 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    Initialize Booking
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    <AnimatePresence>
                        {selectedService && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="glass-card w-full max-w-xl rounded-[3rem] border-white/10 shadow-2xl overflow-hidden"
                                >
                                    {/* Progress Bar */}
                                    <div className="h-1.5 w-full bg-slate-900 flex">
                                        <motion.div
                                            initial={{ width: "50%" }}
                                            animate={{ width: step === 1 ? "50%" : "100%" }}
                                            className="h-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                                        />
                                    </div>

                                    <div className="p-8 md:p-12">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] block mb-2">Step {step} of 2</span>
                                                <h3 className="text-3xl font-black text-white tracking-tight">
                                                    {step === 1 ? "Customize Session" : "Final Verification"}
                                                </h3>
                                            </div>
                                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                                {step === 1 ? <Calendar className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                                            </div>
                                        </div>

                                        {step === 1 ? (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Select Date</label>
                                                        <div className="relative group">
                                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                                            <DatePicker
                                                                selected={bookingDate}
                                                                onChange={(date) => setBookingDate(date)}
                                                                dateFormat="MMMM d, yyyy"
                                                                placeholderText="Choose date..."
                                                                minDate={new Date()}
                                                                className="w-full bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 rounded-2xl p-4 pl-12 text-sm text-white transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Select Time</label>
                                                        <div className="relative group">
                                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                                            <DatePicker
                                                                selected={bookingDate}
                                                                onChange={(date) => setBookingDate(date)}
                                                                showTimeSelect
                                                                showTimeSelectOnly
                                                                timeIntervals={15}
                                                                timeCaption="Time"
                                                                dateFormat="h:mm aa"
                                                                placeholderText="Choose time..."
                                                                className="w-full bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 rounded-2xl p-4 pl-12 text-sm text-white transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Special Requirements</label>
                                                    <div className="relative group">
                                                        <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                                        <textarea
                                                            placeholder="Detail any specific needs for this session..."
                                                            value={instructions}
                                                            onChange={(e) => setInstructions(e.target.value)}
                                                            className="w-full bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 rounded-2xl p-4 pl-12 text-sm text-white transition-all outline-none min-h-[120px] resize-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-4 pt-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedService(null);
                                                            setStep(1);
                                                            setBookingDate(null);
                                                            setInstructions("");
                                                        }}
                                                        className="flex-1 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5"
                                                    >
                                                        <ArrowLeft className="w-4 h-4" /> Discard
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (!bookingDate)
                                                                return toast.error("Please select date & time");
                                                            setStep(2);
                                                        }}
                                                        className="flex-[2] py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                                                    >
                                                        Review Order <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                <div className="bg-slate-950/40 border border-white/5 rounded-3xl p-6 space-y-4">
                                                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service</span>
                                                        <span className="text-sm font-bold text-white">{selectedService.title}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule</span>
                                                        <span className="text-sm font-bold text-white">
                                                            {bookingDate?.toLocaleDateString()} @ {bookingDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Investment</span>
                                                        <span className="text-xl font-black text-indigo-400">${selectedService.price}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <button
                                                        onClick={() => setStep(1)}
                                                        className="flex-1 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5"
                                                    >
                                                        <ArrowLeft className="w-4 h-4" /> Edit Details
                                                    </button>
                                                    <button
                                                        onClick={() => bookAppointment(selectedService)}
                                                        className="flex-[2] py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                                                    >
                                                        Authorize & Pay <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </UserLayout>
    );
};

export default Home;