import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../app/context/AuthContext";
import Navbar from "../../components/layout/Navbar";

const Home = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchServices = async () => {
        const snap = await getDocs(collection(db, "services"));
        setServices(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const bookAppointment = async (serviceId) => {
        if (!confirm("Confirm booking?")) return;
        setLoading(true);
        try {
            await addDoc(collection(db, "appointments"), {
                userId: user.uid,
                userEmail: user.email,
                serviceId,
                serviceName: services.find(s => s.id === serviceId)?.title || "Service",
                status: "pending",
                createdAt: new Date(),
            });
            // alert("Appointment booked!"); // Replaced with nicer UI
            // We could show a toast here
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <div className="container">
            <Navbar />
            <h2>Available Services</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Select a service to book an appointment.</p>

            <div className="grid">
                {services.map((s) => (
                    <div key={s.id} className="card">
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{s.title}</h3>
                            <span className="badge badge-pending" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>Active</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            High quality service provided by our professionals.
                        </p>
                        <button
                            className="btn-primary"
                            style={{ width: '100%' }}
                            onClick={() => bookAppointment(s.id)}
                            disabled={loading}
                        >
                            {loading ? "Booking..." : "Book Now"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;