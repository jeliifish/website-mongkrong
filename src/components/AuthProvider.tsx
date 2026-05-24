"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => isFirebaseConfigured);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser: User | null) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isConfigured: isFirebaseConfigured }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
