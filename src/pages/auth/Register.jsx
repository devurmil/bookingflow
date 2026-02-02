import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await setDoc(doc(db, "users", res.user.uid), {
                name,
                email: res.user.email,
                role: "user",
                isActive: true,
                createdAt: new Date(),
            });
            toast.success("Account created successfully");
            navigate("/login");

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                toast.warning("Email already registered. Please login.");
            } else {
                toast.error(error.message);
            }
            console.error(error);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleRegister} className="card auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Account</button>

                <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Already have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
                </p>
            </form>
        </div>
    );
};

export default Register;
