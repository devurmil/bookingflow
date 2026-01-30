import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../app/context/AuthContext";
import { useEffect, useState } from "react";

const MyAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchMyAppointments = async () => {
            const q = query(
                collection(db, "appointments"),
                where("userId", "==", user.uid)
            );
            const snap = await getDocs(q);
            setAppointments(
                snap.docs.map(d => ({ id: d.id, ...d.data() }))
            );
        };

        fetchMyAppointments();
    }, [user]);

    const Header = () => (
        <nav className="navbar">
            <h3>BookingFlow</h3>
        </nav>
    );

    return (
        <div className="container">
            <Header />
            <h2>My Appointments</h2>

            <div className="grid">
                {appointments.map(a => (
                    <div className="card" key={a.id}>
                        <div className="flex-between">
                            <h3 style={{ margin: 0 }}>{a.serviceName || "Service Booked"}</h3>
                            <span
                                className={`badge ${a.status === "approved"
                                    ? "badge-approved"
                                    : a.status === "rejected"
                                        ? "badge-rejected"
                                        : "badge-pending"
                                    }`}
                            >
                                {a.status}
                            </span>
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            Appointment ID: <span style={{ fontFamily: 'monospace' }}>{a.id.substring(0, 8)}...</span>
                        </p>
                    </div>
                ))}
            </div>

            {appointments.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>No appointments found.</p>
            )}
        </div>
    );
};

export default MyAppointments;