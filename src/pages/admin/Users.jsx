import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import Navbar from "../../components/layout/Navbar";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const currentUid = auth.currentUser.uid;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const snap = await getDocs(collection(db, "users"));
                const usersList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setUsers(usersList);
                console.log("Fetched users:", usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, "users", id), { isActive: !currentStatus });
            setUsers(users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
            toast.success(`User ${!currentStatus ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user status");
        }
    };

    const toggleRole = async (id, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        try {
            await updateDoc(doc(db, "users", id), { role: newRole });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            toast.success(`User is now ${newRole}`);
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Failed to update user role");
        }
    };

    const deleteUser = async (id) => {
        if (!confirm("Delete this user? This action cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, "users", id));
            setUsers(users.filter(u => u.id !== id));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    if (loading) {
        return (
            <div className="container">
                <Navbar />
                <h2 style={{ marginBottom: '2rem' }}>User Management</h2>
                <div className="card">
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Navbar />
            <h2 style={{ marginBottom: '2rem' }}>User Management</h2>
            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Registered Users</h3>
                {users.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>
                        No users found. Note that only newly registered users will appear here properly.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {users.map(u => (
                            <div key={u.id} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '1rem',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '1rem'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{u.name || 'No Name'}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {u.email} <span style={{ opacity: 0.5 }}>|</span>
                                        <span className={`badge badge-${u.role === 'admin' ? 'primary' : 'secondary'}`} style={{ marginLeft: '0.5rem' }}>
                                            {u.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-gap">
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                        onClick={() => toggleRole(u.id, u.role)}
                                    >
                                        Make {u.role === "admin" ? "User" : "Admin"}
                                    </button>
                                    <button
                                        className={u.isActive ? "btn-warning" : "btn-success"}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                        onClick={() => toggleStatus(u.id, u.isActive)}
                                    >
                                        {u.isActive ? "Disable" : "Enable"}
                                    </button>
                                    <button
                                        className="btn-danger"
                                        disabled={u.id === currentUid}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                        onClick={() => deleteUser(u.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}