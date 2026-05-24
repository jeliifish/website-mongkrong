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
import type { GaleriItem, NewGaleriInput } from "@/types/galeri";

const GALERI_COLLECTION = "galeri";

type GaleriDocument = {
  title?: string;
  imageUrl?: string;
  imagePublicId?: string;
  fileName?: string;
  updated?: string;
  photos?: string;
  createdAt?: number;
  updatedAt?: number;
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function getGaleriCollection() {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  return collection(db, GALERI_COLLECTION);
}

function toGaleriItem(id: string, data: GaleriDocument): GaleriItem {
  return {
    id,
    title: data.title?.trim() ?? "",
    photos: data.photos?.trim() || "1 foto",
    updated: data.updated?.trim() || "",
    imageUrl: data.imageUrl?.trim() || undefined,
    imagePublicId: data.imagePublicId?.trim() || undefined,
    fileName: data.fileName?.trim() || undefined,
  };
}

function toGaleriPayload(input: NewGaleriInput | GaleriItem) {
  return {
    title: input.title.trim(),
    photos: "photos" in input ? input.photos.trim() : "1 foto",
    updated:
      "updated" in input && input.updated.trim()
        ? input.updated.trim()
        : dateFormatter.format(new Date()),
    imageUrl: input.imageUrl?.trim() || "",
    imagePublicId: input.imagePublicId?.trim() || "",
    fileName: input.fileName?.trim() || "",
    updatedAt: Date.now(),
  };
}

export async function fetchGaleriItems() {
  const snapshot = await getDocs(query(getGaleriCollection(), orderBy("createdAt", "desc")));

  return snapshot.docs.map((item) => toGaleriItem(item.id, item.data() as GaleriDocument));
}

export async function fetchGaleriItemById(id: string) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  const snapshot = await getDoc(doc(db, GALERI_COLLECTION, id));

  if (!snapshot.exists()) {
    return null;
  }

  return toGaleriItem(snapshot.id, snapshot.data() as GaleriDocument);
}

export async function createGaleriItem(input: NewGaleriInput) {
  const payload = {
    ...toGaleriPayload(input),
    createdAt: Date.now(),
  };

  const result = await addDoc(getGaleriCollection(), payload);

  return toGaleriItem(result.id, payload);
}

export async function updateGaleriItem(input: GaleriItem) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  const payload = toGaleriPayload(input);

  await updateDoc(doc(db, GALERI_COLLECTION, input.id), payload);

  return toGaleriItem(input.id, payload);
}

export async function removeGaleriItem(id: string) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  await deleteDoc(doc(db, GALERI_COLLECTION, id));
}
