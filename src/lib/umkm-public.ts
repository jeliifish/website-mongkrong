import { umkmProducts } from "@/data/site-content";
import type { UmkmItem } from "@/types/umkm";

const fallbackOwners = [
  "Bu Sari",
  "Pak Rono",
  "Bu Tini",
  "Pak Darto",
];

const fallbackDescriptions = [
  "Memproduksi keripik singkong renyah dengan rasa gurih alami tanpa bahan pengawet.",
  "Menyediakan aneka kerajinan anyaman bambu tradisional yang estetis untuk kebutuhan rumah tangga.",
  "Melayani pesanan nasi kotak, tumpeng, dan katering untuk berbagai acara warga desa.",
  "Menyediakan bibit buah-buahan unggul serta pupuk kandang organik untuk pertanian ramah lingkungan."
];

const fallbackAddresses = [
  "RT 02 / RW 01, Dusun Mongkrong",
  "RT 04 / RW 02, Dusun Mongkrong",
  "RT 01 / RW 01, Dusun Mongkrong",
  "RT 03 / RW 02, Dusun Mongkrong"
];

const fallbackPhones = [
  "081234567890",
  "082345678901",
  "083456789012",
  "085678901234"
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800", // Kripik singkong rumahan
  "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800", // Kerajinan anyaman bambu
  "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800", // Jasa katering
  "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800", // Bibit tanaman
];

export function getFallbackUmkmItems(): UmkmItem[] {
  return umkmProducts.map((name, index) => ({
    id: `fallback-umkm-${index + 1}`,
    name,
    owner: fallbackOwners[index] ?? "Pelaku usaha desa",
    description: fallbackDescriptions[index],
    address: fallbackAddresses[index],
    phone: fallbackPhones[index],
    imageUrl: fallbackImages[index],
  }));
}

export function getFallbackUmkmItem(id: string) {
  return getFallbackUmkmItems().find((item) => item.id === id) ?? null;
}
