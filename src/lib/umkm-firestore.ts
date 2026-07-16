import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { NewUmkmInput, UmkmItem } from "@/types/umkm";

const UMKM_COLLECTION = "umkm";

type UmkmDocument = {
  name?: string;
  owner?: string;
  description?: string;
  address?: string;
  phone?: string;
  imageUrl?: string;
  imagePublicId?: string;
  fileName?: string;
  mapUrl?: string;
  createdAt?: number;
  updatedAt?: number;
};

function getUmkmCollection() {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  return collection(db, UMKM_COLLECTION);
}

function toUmkmItem(id: string, data: UmkmDocument): UmkmItem {
  return {
    id,
    name: data.name?.trim() ?? "",
    owner: data.owner?.trim() ?? "",
    description: data.description?.trim() || undefined,
    address: data.address?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    imageUrl: data.imageUrl?.trim() || undefined,
    imagePublicId: data.imagePublicId?.trim() || undefined,
    fileName: data.fileName?.trim() || undefined,
    mapUrl: data.mapUrl?.trim() || undefined,
  };
}

function toUmkmPayload(input: NewUmkmInput | UmkmItem) {
  return {
    name: input.name.trim(),
    owner: input.owner.trim(),
    description: input.description?.trim() || "",
    address: input.address?.trim() || "",
    phone: input.phone?.trim() || "",
    imageUrl: input.imageUrl?.trim() || "",
    imagePublicId: input.imagePublicId?.trim() || "",
    fileName: input.fileName?.trim() || "",
    mapUrl: input.mapUrl?.trim() || "",
    updatedAt: Date.now(),
  };
}

export async function fetchUmkmItems() {
  const snapshot = await getDocs(query(getUmkmCollection(), orderBy("createdAt", "desc")));

  return snapshot.docs.map((item) => toUmkmItem(item.id, item.data() as UmkmDocument));
}

export async function fetchUmkmItemById(id: string) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  const snapshot = await getDoc(doc(db, UMKM_COLLECTION, id));

  if (!snapshot.exists()) {
    return null;
  }

  return toUmkmItem(snapshot.id, snapshot.data() as UmkmDocument);
}

export async function createUmkmItem(input: NewUmkmInput) {
  const payload = {
    ...toUmkmPayload(input),
    createdAt: Date.now(),
  };

  const result = await addDoc(getUmkmCollection(), payload);

  return toUmkmItem(result.id, payload);
}

export async function updateUmkmItem(input: UmkmItem) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  const payload = toUmkmPayload(input);

  await updateDoc(doc(db, UMKM_COLLECTION, input.id), payload);

  return toUmkmItem(input.id, payload);
}

export async function removeUmkmItem(id: string) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  await deleteDoc(doc(db, UMKM_COLLECTION, id));
}
