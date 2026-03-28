"use client";

import { GoogleAuthProvider, onAuthStateChanged, signOut, signInWithPopup, User as FirebaseUser } from "firebase/auth";
import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase";
import { ReactNode } from "react";

interface AuthContextType {
  User: FirebaseUser | null;
  isloading: boolean;
  error: string | null;
  handleSignInWithGoogle: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [User, setUser] = useState<FirebaseUser | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        User,
        isloading,
        error,
        handleSignInWithGoogle,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return context;
};