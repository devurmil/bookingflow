import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                const ref = doc(db, "users", currentUser.uid);
                const snap = await getDoc(ref);

                if (!snap.exists()) {
                    setRole(null);
                    setIsActive(false);
                } else {
                    const data = snap.data();
                    setRole(data.role);
                    setIsActive(data.isActive !== false);
                }
            } else {
                setUser(null);
                setRole(null);
                setIsActive(true);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    if (loading) return <h3>Loading...</h3>;

    return (
        <AuthContext.Provider value={{ user, role, isActive, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
