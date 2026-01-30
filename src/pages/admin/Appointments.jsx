import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        const snap = await getDocs(collection(db, "appointments"));
        const list = snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
        }));
        setAppointments(list);
    };

    const updateStatus = async (id, status) => {
        await updateDoc(doc(db, "appointments", id), { status });
        fetchAppointments();
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Appointment Requests</h3>

            {appointments.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No appointments found.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {appointments.map(a => (
                        <div key={a.id} style={{
                            borderBottom: '1px solid var(--border)',
                            paddingBottom: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div className="flex-between">
                                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{a.serviceName || "Service"}</span>
                                <span className={`badge badge-${a.status}`}>{a.status}</span>
                            </div>

                            <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}> User: {a.userEmail || a.userId}</span>

                                {a.status === "pending" && (
                                    <div className="flex-gap">
                                        <button className="btn-success btn-sm" onClick={() => updateStatus(a.id, "approved")}>
                                            Approve
                                        </button>
                                        <button className="btn-danger btn-sm" onClick={() => updateStatus(a.id, "rejected")}>
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Appointments;