import { galleryMoments } from "@/data/site-content";
import type { GaleriItem } from "@/types/galeri";

const todayFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function getFallbackGaleriItems(): GaleriItem[] {
  return galleryMoments.map((title, index) => ({
    id: `fallback-galeri-${index + 1}`,
    title,
    photos: "1 foto",
    updated: todayFormatter.format(new Date(Date.UTC(2026, 4, 25 - index))),
  }));
}

export function getFallbackGaleriItem(id: string) {
  return getFallbackGaleriItems().find((item) => item.id === id) ?? null;
}
