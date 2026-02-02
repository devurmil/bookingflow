import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import Navbar from "../../components/layout/Navbar";

const Services = () => {
    const [services, setServices] = useState([]);
    const [title, setTitle] = useState("");

    const fetchServices = async () => {
        const snap = await getDocs(collection(db, "services"));
        setServices(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const addService = async () => {
        if (!title.trim()) return toast.warn("Please enter a service name");
        try {
            await addDoc(collection(db, "services"), {
                title,
                active: true,
            });
            setTitle("");
            fetchServices();
            toast.success("Service added successfully");
        } catch (error) {
            console.error("Error adding service: ", error);
            toast.error("Failed to add service: " + error.message);
        }
    };

    const deleteService = async (id) => {
        if (!confirm("Delete this service?")) return;
        try {
            await deleteDoc(doc(db, "services", id));
            fetchServices();
            toast.success("Service deleted successfully");
        } catch (error) {
            console.error("Error deleting service: ", error);
            toast.error("Failed to delete service: " + error.message);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <div className="container">
            <Navbar />
            <h2 style={{ marginBottom: '2rem' }}>Service Management</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Add New Service</h3>
                <div className="flex-gap" style={{ marginTop: '1rem' }}>
                    <input
                        placeholder="Service name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ maxWidth: '300px' }}
                    />
                    <button className="btn-primary" onClick={addService}>Add Service</button>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Active Services</h3>
                {services.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No services added.</p> : (
                    <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {services.map((s) => (
                            <li key={s.id} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '1rem',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%', marginRight: '10px' }}></span>
                                    {s.title}
                                </div>
                                <button
                                    className="btn-danger"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                    onClick={() => deleteService(s.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Services;
