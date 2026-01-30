import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser); // ✅ Set user immediately to allow navigation

                const ref = doc(db, "users", currentUser.uid);
                const snap = await getDoc(ref);

                if (!snap.exists()) {
                    // If checking for a user that was just created, checking role might be needed
                    // But usually Register handles creation. Validating just in case.
                    setRole("user"); // Default fallback
                } else {
                    setRole(snap.data().role);
                }
            } else {
                setUser(null);
                setRole(null);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    if (loading) return <h3>Loading...</h3>;

    return (
        <AuthContext.Provider value={{ user, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
