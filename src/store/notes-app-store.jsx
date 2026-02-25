import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig/firbase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const notesContext = createContext(null);

export const NotesProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const signup = async ({ name, email, password, monthlyBudget }) => {
    const normalizedEmail = email.toLowerCase();

    const res = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password,
    );

    const user = res.user;

    const profileData = {
      uid: user.uid,
      name,
      email: normalizedEmail,
      monthlyBudget: Number(monthlyBudget) || 0,
      createdAt: Date.now(),
    };

    await setDoc(doc(db, "users", user.uid), profileData);

    setProfile(profileData);
    setUser(user);

    return user;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) setProfile(snap.data());
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <notesContext.Provider value={{ user, profile, signup, login, logout }}>
      {!loading && children}
    </notesContext.Provider>
  );
};

export const useAuth = () => useContext(notesContext);
