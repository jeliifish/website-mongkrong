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
import { fetchAdminProfile, saveAdminProfile, type AdminProfile } from "@/lib/admin-firestore";

type AuthContextValue = {
  user: User | null;
  profile: AdminProfile | null;
  loading: boolean;
  isConfigured: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    if (user) {
      try {
        const adminProfile = await fetchAdminProfile(user.uid);
        if (adminProfile) {
          setProfile(adminProfile);
        }
      } catch (error) {
        console.error("Gagal refresh profil admin:", error);
      }
    }
  }

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser: User | null) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          let adminProfile = await fetchAdminProfile(nextUser.uid);
          if (!adminProfile) {
            // Seed a default Super Admin profile if they are logging in but no profile exists
            adminProfile = {
              uid: nextUser.uid,
              name: nextUser.displayName || nextUser.email?.split("@")[0] || "Admin",
              email: nextUser.email || "",
              role: "Super Admin",
              permissions: {
                profil: true,
                galeri: true,
                umkm: true,
                berita: true,
              },
              createdAt: Date.now(),
            };
            await saveAdminProfile(adminProfile);
          }
          setProfile(adminProfile);
        } catch (error) {
          console.error("Gagal mendapatkan profil admin:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: isFirebaseConfigured,
        refreshProfile,
      }}
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
