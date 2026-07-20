import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { StatistikItem } from "@/types/statistik";

export const fallbackStatistik: StatistikItem = {
  id: "main",
  jumlahPenduduk: "732 Jiwa",
  jumlahKK: "183 KK",
  luasWilayah: "112,1 Ha",
  jumlahRT: "4 RT",
  batasUtara: "Sengon kerep dan Kayen",
  batasSelatan: "Desa Terbah",
  batasBarat: "Desa Serut",
  batasTimur: "Sidomulyo",
  customStats: [
    { id: "laki-laki", label: "Penduduk Laki-laki", value: "358 Jiwa" },
    { id: "perempuan", label: "Penduduk Perempuan", value: "374 Jiwa" },
    { id: "pekerjaan", label: "Mata Pencaharian Utama", value: "Petani & Buruh Tani" }
  ]
};

export async function fetchStatistik(): Promise<StatistikItem> {
  if (!db || !isFirebaseConfigured) {
    return fallbackStatistik;
  }

  try {
    const docRef = doc(db, "statistik", "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: "main",
        jumlahPenduduk: data.jumlahPenduduk || fallbackStatistik.jumlahPenduduk,
        jumlahKK: data.jumlahKK || fallbackStatistik.jumlahKK,
        luasWilayah: data.luasWilayah || fallbackStatistik.luasWilayah,
        jumlahRT: data.jumlahRT || fallbackStatistik.jumlahRT,
        batasUtara: data.batasUtara || fallbackStatistik.batasUtara,
        batasSelatan: data.batasSelatan || fallbackStatistik.batasSelatan,
        batasBarat: data.batasBarat || fallbackStatistik.batasBarat,
        batasTimur: data.batasTimur || fallbackStatistik.batasTimur,
        customStats: data.customStats || fallbackStatistik.customStats || [],
      };
    }
    return fallbackStatistik;
  } catch (error) {
    console.error("Gagal memuat statistik dari Firestore:", error);
    return fallbackStatistik;
  }
}

export async function updateStatistik(data: Omit<StatistikItem, "id">): Promise<StatistikItem> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  const docRef = doc(db, "statistik", "main");
  const payload = {
    jumlahPenduduk: data.jumlahPenduduk.trim(),
    jumlahKK: data.jumlahKK.trim(),
    luasWilayah: data.luasWilayah.trim(),
    jumlahRT: data.jumlahRT.trim(),
    batasUtara: data.batasUtara.trim(),
    batasSelatan: data.batasSelatan.trim(),
    batasBarat: data.batasBarat.trim(),
    batasTimur: data.batasTimur.trim(),
    customStats: data.customStats || [],
    updatedAt: Date.now(),
  };

  await setDoc(docRef, payload, { merge: true });

  return {
    id: "main",
    ...payload,
  };
}
