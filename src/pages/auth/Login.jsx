import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);

            // Check user role
            const userDoc = await getDoc(doc(db, "users", res.user.uid));
            if (userDoc.exists() && userDoc.data().role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

            toast.success("Welcome back!");
        } catch (error) {
            toast.error("Login failed: " + error.message);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleLogin} className="card auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>

                <div className="form-group">
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button className="btn-primary" style={{ width: '100%' }}>Login</button>

                <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Don't have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span>
                </p>
            </form>
        </div>
    );
};

export default Login;