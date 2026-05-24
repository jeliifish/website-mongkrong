import { featuredNews } from "@/data/site-content";
import type { BeritaItem } from "@/types/berita";

export function getFallbackBeritaItems(): BeritaItem[] {
  return featuredNews.map((item, index) => ({
    id: `featured-news-${index + 1}`,
    title: item.title,
    description: item.excerpt,
    date: item.date,
    category: "Berita Desa",
    author: "Admin Desa",
    content: [item.excerpt],
  }));
}

export function getFallbackBeritaItem(id: string) {
  return getFallbackBeritaItems().find((item) => item.id === id) ?? null;
}
