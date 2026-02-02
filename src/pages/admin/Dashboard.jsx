import { useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="container">
            <Navbar />
            <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>

            <div className="grid">
                <Link to="/admin/services" className="card nav-link" style={{ display: 'block' }}>
                    <h3>Manage Services</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Add, remove or update available services.</p>
                </Link>

                <Link to="/admin/appointments" className="card nav-link" style={{ display: 'block' }}>
                    <h3>View Appointments</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Approve or reject booking requests.</p>
                </Link>

                <Link to="/admin/users" className="card nav-link" style={{ display: 'block' }}>
                    <h3>Manage Users</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>View users, change roles, or delete accounts.</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;