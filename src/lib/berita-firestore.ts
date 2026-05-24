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
import type { BeritaItem, NewBeritaInput } from "@/types/berita";

const BERITA_COLLECTION = "berita";
const DEFAULT_CATEGORY = "Informasi Desa";
const DEFAULT_AUTHOR = "Admin Desa";

type BeritaDocument = {
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  author?: string;
  content?: string[];
  createdAt?: number;
  updatedAt?: number;
};

function getBeritaCollection() {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  return collection(db, BERITA_COLLECTION);
}

function toBeritaItem(id: string, data: BeritaDocument): BeritaItem {
  const description = data.description?.trim() ?? "";

  return {
    id,
    title: data.title?.trim() ?? "",
    description,
    date: data.date?.trim() ?? "",
    category: data.category?.trim() ?? DEFAULT_CATEGORY,
    author: data.author?.trim() ?? DEFAULT_AUTHOR,
    content:
      data.content?.filter((paragraph) => paragraph.trim().length > 0) ?? [description],
  };
}

function toBeritaPayload(input: NewBeritaInput | BeritaItem) {
  const title = input.title.trim();
  const description = input.description.trim();
  const date = input.date.trim();
  const content =
    "content" in input && input.content.length > 0
      ? input.content
      : [description].filter(Boolean);
  const category = "category" in input ? input.category.trim() : DEFAULT_CATEGORY;
  const author = "author" in input ? input.author.trim() : DEFAULT_AUTHOR;

  return {
    title,
    description,
    date,
    category,
    author,
    content,
    updatedAt: Date.now(),
  };
}

export async function fetchBeritaItems() {
  const snapshot = await getDocs(query(getBeritaCollection(), orderBy("createdAt", "desc")));

  return snapshot.docs.map((item) => toBeritaItem(item.id, item.data() as BeritaDocument));
}

export async function fetchBeritaItemById(id: string) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  const snapshot = await getDoc(doc(db, BERITA_COLLECTION, id));

  if (!snapshot.exists()) {
    return null;
  }

  return toBeritaItem(snapshot.id, snapshot.data() as BeritaDocument);
}

export async function createBeritaItem(input: NewBeritaInput) {
  const payload = {
    ...toBeritaPayload(input),
    createdAt: Date.now(),
  };

  const result = await addDoc(getBeritaCollection(), payload);

  return toBeritaItem(result.id, payload);
}

export async function updateBeritaItem(input: BeritaItem) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  const payload = toBeritaPayload(input);

  await updateDoc(doc(db, BERITA_COLLECTION, input.id), payload);

  return toBeritaItem(input.id, payload);
}

export async function removeBeritaItem(id: string) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase belum dikonfigurasi di project ini.");
  }

  await deleteDoc(doc(db, BERITA_COLLECTION, id));
}
