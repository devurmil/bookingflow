import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../app/context/AuthContext";

const Navbar = () => {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

    return (
        <nav className="navbar">
            <h3 style={{ margin: 0 }}>
                <Link to={role === 'admin' ? '/admin' : '/'} style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
                    BookingFlow
                </Link>
            </h3>

            <div className="flex-gap">
                {role === 'user' && (
                    <>
                        <Link to="/" className={isActive('/')}>Services</Link>
                        <Link to="/my-appointments" className={isActive('/my-appointments')}>My Appointments</Link>
                    </>
                )}

                {role === 'admin' && (
                    <>
                        <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
                        <Link to="/admin/services" className={isActive('/admin/services')}>Services</Link>
                        <Link to="/admin/appointments" className={isActive('/admin/appointments')}>Appointments</Link>
                        <Link to="/admin/users" className={isActive('/admin/users')}>Users</Link>
                    </>
                )}

                <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.5rem' }}></div>

                <div className="flex-gap" style={{ fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>
                    <button onClick={handleLogout} className="btn-danger btn-sm">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
