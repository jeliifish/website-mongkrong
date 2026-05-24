import { umkmProducts } from "@/data/site-content";
import type { UmkmItem } from "@/types/umkm";

const fallbackOwners = [
  "Bu Sari",
  "Pak Rono",
  "Bu Tini",
  "Pak Darto",
];

export function getFallbackUmkmItems(): UmkmItem[] {
  return umkmProducts.map((name, index) => ({
    id: `fallback-umkm-${index + 1}`,
    name,
    owner: fallbackOwners[index] ?? "Pelaku usaha desa",
  }));
}

export function getFallbackUmkmItem(id: string) {
  return getFallbackUmkmItems().find((item) => item.id === id) ?? null;
}
