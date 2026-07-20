import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";

export interface LahanItem {
  id: string;
  name: string;
  area: number;
}

export interface TanamanItem {
  id: string;
  name: string;
  landCategoryId: string; // "sawah" | "tegalan" | "pekarangan"
  productivityPerHa: number;
  landUseFactor?: number; // Porsi lahan yang ditanami (0-1)
  factorNotes?: string;   // Keterangan / penjelasan porsi tanam
}

const LAHAN_COLLECTION = "lahan";
const TANAMAN_COLLECTION = "tanaman";

export const defaultLahan: LahanItem[] = [
  { id: "pekarangan", name: "Pekarangan", area: 38.7375 },
  { id: "sawah", name: "Sawah", area: 24.5735 },
  { id: "tegalan", name: "Tegalan", area: 48.7965 }
];

export const defaultTanaman: TanamanItem[] = [
  { id: "padi", name: "Padi", landCategoryId: "sawah", productivityPerHa: 5.5, landUseFactor: 0.90, factorNotes: "Koefisien Pematang/Galengan BPS (10%)" },
  { id: "timun", name: "Timun", landCategoryId: "tegalan", productivityPerHa: 12.0, landUseFactor: 0.20, factorNotes: "Porsi Tanam Tegalan (20%)" },
  { id: "jagung", name: "Jagung", landCategoryId: "tegalan", productivityPerHa: 4.8, landUseFactor: 0.40, factorNotes: "Porsi Tanam Tegalan (40%)" },
  { id: "cabai", name: "Cabai", landCategoryId: "pekarangan", productivityPerHa: 3.5, landUseFactor: 0.05, factorNotes: "Porsi Pemanfaatan Pekarangan (5%)" }
];

// Fetch Lahan Items
export async function fetchLahanItems(): Promise<LahanItem[]> {
  if (!isFirebaseConfigured || !db) {
    return defaultLahan;
  }

  try {
    const colRef = collection(db, LAHAN_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      // Initialize with default values if Firestore is empty
      for (const item of defaultLahan) {
        await setDoc(doc(db, LAHAN_COLLECTION, item.id), item);
      }
      return defaultLahan;
    }

    const items: LahanItem[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        area: Number(data.area) || 0
      };
    });

    const order = ["pekarangan", "sawah", "tegalan"];
    return items.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  } catch (error) {
    console.error("Failed to fetch lahan items from firestore, using fallback:", error);
    return defaultLahan;
  }
}

// Update Lahan Item
export async function updateLahanItem(id: string, area: number): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase belum dikonfigurasi.");
  }

  const docRef = doc(db, LAHAN_COLLECTION, id);
  await updateDoc(docRef, { area });
}

// Fetch Tanaman Items
export async function fetchTanamanItems(): Promise<TanamanItem[]> {
  if (!isFirebaseConfigured || !db) {
    return defaultTanaman;
  }

  try {
    const colRef = collection(db, TANAMAN_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      // Initialize with default values if Firestore is empty
      for (const item of defaultTanaman) {
        await setDoc(doc(db, TANAMAN_COLLECTION, item.id), item);
      }
      return defaultTanaman;
    }

    const items: TanamanItem[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const defaultItem = defaultTanaman.find((t) => t.id === doc.id);
      return {
        id: doc.id,
        name: data.name || "",
        landCategoryId: data.landCategoryId || "",
        productivityPerHa: Number(data.productivityPerHa) || 0,
        landUseFactor: data.landUseFactor !== undefined
          ? Number(data.landUseFactor)
          : (defaultItem?.landUseFactor ?? 1.0),
        factorNotes: data.factorNotes !== undefined
          ? String(data.factorNotes)
          : (defaultItem?.factorNotes ?? "Porsi Tanam")
      };
    });

    const order = ["padi", "timun", "jagung", "cabai"];
    return items.sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Failed to fetch tanaman items from firestore, using fallback:", error);
    return defaultTanaman;
  }
}

// Update Tanaman Item
export async function updateTanamanItem(id: string, updates: Partial<Omit<TanamanItem, "id">>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase belum dikonfigurasi.");
  }

  const docRef = doc(db, TANAMAN_COLLECTION, id);
  await updateDoc(docRef, updates);
}

// Add Tanaman Item
export async function addTanamanItem(item: Omit<TanamanItem, "id"> & { id?: string }): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    // Local memory fallback doesn't write to DB but returns ID
    return item.id || item.name.toLowerCase().replace(/\s+/g, "-");
  }

  const id = item.id || item.name.toLowerCase().replace(/\s+/g, "-") || Math.random().toString(36).substring(2, 9);
  const docRef = doc(db, TANAMAN_COLLECTION, id);
  await setDoc(docRef, {
    name: item.name,
    landCategoryId: item.landCategoryId,
    productivityPerHa: Number(item.productivityPerHa) || 0,
    landUseFactor: item.landUseFactor !== undefined ? Number(item.landUseFactor) : 1.0,
    factorNotes: item.factorNotes || "Porsi Tanam"
  });
  return id;
}

// Delete Tanaman Item
export async function deleteTanamanItem(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, TANAMAN_COLLECTION, id);
  await deleteDoc(docRef);
}

