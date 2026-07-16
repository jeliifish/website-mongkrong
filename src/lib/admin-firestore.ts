import { doc, getDoc, getDocs, collection, setDoc, deleteDoc } from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db, firebaseConfig } from "@/lib/firebase";

export type AdminProfile = {
  uid: string;
  name: string;
  email: string;
  role: "Super Admin" | "Staff Admin";
  permissions: {
    profil: boolean;
    galeri: boolean;
    umkm: boolean;
    berita: boolean;
  };
  createdAt: number;
};

export async function fetchAdminProfiles(): Promise<AdminProfile[]> {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, "admins"));
    const items: AdminProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        uid: doc.id,
        name: data.name || "",
        email: data.email || "",
        role: data.role || "Staff Admin",
        permissions: {
          profil: data.permissions?.profil ?? false,
          galeri: data.permissions?.galeri ?? false,
          umkm: data.permissions?.umkm ?? false,
          berita: data.permissions?.berita ?? false,
        },
        createdAt: data.createdAt || 0,
      });
    });
    return items.sort((a, b) => a.createdAt - b.createdAt);
  } catch (error) {
    console.error("Gagal memuat profil admin:", error);
    return [];
  }
}

export async function fetchAdminProfile(uid: string): Promise<AdminProfile | null> {
  if (!db) return null;
  try {
    const docSnap = await getDoc(doc(db, "admins", uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        name: data.name || "",
        email: data.email || "",
        role: data.role || "Staff Admin",
        permissions: {
          profil: data.permissions?.profil ?? false,
          galeri: data.permissions?.galeri ?? false,
          umkm: data.permissions?.umkm ?? false,
          berita: data.permissions?.berita ?? false,
        },
        createdAt: data.createdAt || 0,
      };
    }
    return null;
  } catch (error) {
    console.error("Gagal memuat profil admin:", error);
    return null;
  }
}

export async function saveAdminProfile(profile: AdminProfile): Promise<void> {
  if (!db) return;
  const docRef = doc(db, "admins", profile.uid);
  await setDoc(
    docRef,
    {
      name: profile.name.trim(),
      email: profile.email.trim(),
      role: profile.role,
      permissions: profile.permissions,
      createdAt: profile.createdAt || Date.now(),
    },
    { merge: true }
  );
}

export async function deleteAdminProfile(uid: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "admins", uid));
}

export async function createAuthUserOnClient(email: string, pass: string): Promise<string> {
  if (!firebaseConfig.apiKey) {
    throw new Error("Konfigurasi Firebase belum lengkap.");
  }
  const appName = `secondary-helper-${Date.now()}`;
  const secondaryApp = initializeApp(firebaseConfig, appName);
  const secondaryAuth = getAuth(secondaryApp);
  
  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), pass);
    const uid = userCredential.user.uid;
    await signOut(secondaryAuth);
    return uid;
  } finally {
    await deleteApp(secondaryApp);
  }
}
