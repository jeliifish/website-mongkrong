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

const KONTAK_DOC_PATH = "kontak/info";
const PESAN_COLLECTION = "pesan";

export const fallbackKontakInfo: KontakInfo = {
  alamat:
    "Dusun Mongkrong, Kalurahan Sampang, Kapanewon Gedangsari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta",
  telepon: "",
  email: "",
};

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
  if (!db || !isFirebaseConfigured) {
    return [];
  }

  try {
    const snapshot = await getDocs(
      query(collection(db, PESAN_COLLECTION), orderBy("createdAt", "desc"))
    );
    return snapshot.docs.map((d) => {
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
  } catch (error) {
    console.error("Gagal memuat pesan masuk:", error);
    return [];
  }
}

export async function createPesan(input: NewPesanInput): Promise<void> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi.");
  }

  await addDoc(collection(db, PESAN_COLLECTION), {
    nama: input.nama.trim(),
    email: input.email.trim(),
    subjek: input.subjek.trim(),
    pesan: input.pesan.trim(),
    createdAt: Date.now(),
  });
}

export async function deletePesan(id: string): Promise<void> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi.");
  }

  await deleteDoc(doc(db, PESAN_COLLECTION, id));
}
