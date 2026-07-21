import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { KontakInfo, PesanMasuk, NewPesanInput } from "@/types/kontak";

const PESAN_COLLECTION = "pesan";
const LOCAL_PESAN_KEY = "mongkrong_pesan_masuk";

export const fallbackKontakInfo: KontakInfo = {
  alamat:
    "Dusun Mongkrong, Kalurahan Sampang, Kapanewon Gedangsari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta",
  telepon: "",
  email: "",
};

function getLocalPesan(): PesanMasuk[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_PESAN_KEY);
    return data ? (JSON.parse(data) as PesanMasuk[]) : [];
  } catch {
    return [];
  }
}

function saveLocalPesan(items: PesanMasuk[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_PESAN_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Gagal menyimpan pesan ke localStorage:", err);
  }
}

// ─── Kontak Info ────────────────────────────────────────────

export async function fetchKontakInfo(): Promise<KontakInfo> {
  if (!db || !isFirebaseConfigured) {
    return fallbackKontakInfo;
  }

  try {
    const docSnap = await getDoc(doc(db, "kontak", "info"));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        alamat: data.alamat?.trim() || fallbackKontakInfo.alamat,
        telepon: data.telepon?.trim() || "",
        email: data.email?.trim() || "",
      };
    }
    return fallbackKontakInfo;
  } catch (error) {
    console.error("Gagal memuat info kontak:", error);
    return fallbackKontakInfo;
  }
}

export async function updateKontakInfo(info: KontakInfo): Promise<void> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi.");
  }

  await setDoc(doc(db, "kontak", "info"), {
    alamat: info.alamat.trim(),
    telepon: info.telepon.trim(),
    email: info.email.trim(),
    updatedAt: Date.now(),
  });
}

// ─── Pesan Masuk ────────────────────────────────────────────

export async function fetchPesanMasuk(): Promise<PesanMasuk[]> {
  const localList = getLocalPesan();
  if (!db || !isFirebaseConfigured) {
    return localList;
  }

  try {
    const snapshot = await getDocs(
      query(collection(db, PESAN_COLLECTION), orderBy("createdAt", "desc"))
    );
    const firestoreList = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        nama: data.nama || "",
        email: data.email || "",
        subjek: data.subjek || "",
        pesan: data.pesan || "",
        createdAt: data.createdAt || 0,
      };
    });

    const combined = [...firestoreList];
    for (const item of localList) {
      if (!combined.some((p) => p.id === item.id)) {
        combined.push(item);
      }
    }
    combined.sort((a, b) => b.createdAt - a.createdAt);
    return combined;
  } catch (error) {
    console.error(
      "Gagal memuat pesan masuk dari Firestore, menggunakan data lokal:",
      error
    );
    return localList;
  }
}

export async function createPesan(input: NewPesanInput): Promise<void> {
  const newPesan: PesanMasuk = {
    id: "local_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    nama: input.nama.trim(),
    email: input.email.trim(),
    subjek: input.subjek.trim(),
    pesan: input.pesan.trim(),
    createdAt: Date.now(),
  };

  if (db && isFirebaseConfigured) {
    try {
      await addDoc(collection(db, PESAN_COLLECTION), {
        nama: newPesan.nama,
        email: newPesan.email,
        subjek: newPesan.subjek,
        pesan: newPesan.pesan,
        createdAt: newPesan.createdAt,
      });
      return;
    } catch (error) {
      console.warn(
        "Gagal menyimpan pesan ke Firestore (Permission error/Network issue), menyimpan ke penyimpanan lokal sebagai fallback:",
        error
      );
    }
  }

  // Fallback to localStorage if Firebase is not configured or permission denied
  const currentLocal = getLocalPesan();
  saveLocalPesan([newPesan, ...currentLocal]);
}

export async function deletePesan(id: string): Promise<void> {
  const currentLocal = getLocalPesan();
  const updatedLocal = currentLocal.filter((p) => p.id !== id);
  saveLocalPesan(updatedLocal);

  if (db && isFirebaseConfigured && !id.startsWith("local_")) {
    try {
      await deleteDoc(doc(db, PESAN_COLLECTION, id));
    } catch (error) {
      console.error("Gagal menghapus pesan dari Firestore:", error);
    }
  }
}
