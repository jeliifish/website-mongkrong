import { featuredNews } from "@/data/site-content";
import type { BeritaItem } from "@/types/berita";

const fallbackCategories = ["Kegiatan Warga", "UMKM", "Kesehatan"];
const fallbackAuthors = ["Ketua RW 03", "Sekretariat Desa", "Kader Kesehatan"];
const fallbackImages = [
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
];

export function getFallbackBeritaItems(): BeritaItem[] {
  return featuredNews.map((item, index) => ({
    id: `featured-news-${index + 1}`,
    title: item.title,
    description: item.excerpt,
    date: item.date,
    category: fallbackCategories[index] ?? "Berita Desa",
    author: fallbackAuthors[index] ?? "Admin Desa",
    content: [
      item.excerpt,
      `Ini adalah kelanjutan berita mengenai ${item.title.toLowerCase()}. Seluruh warga sangat antusias berpartisipasi aktif dalam menyukseskan agenda yang dikoordinasikan oleh pihak desa demi kemajuan bersama dan peningkatan kesejahteraan lingkungan setempat.`,
      "Diharapkan kegiatan semacam ini dapat diselenggarakan secara rutin berkala guna mempererat tali silaturahmi antarwarga serta menjaga komitmen pembangunan Desa Mongkrong ke depan."
    ],
    imageUrl: fallbackImages[index],
    fileName: `berita-thumbnail-${index + 1}.jpg`,
  }));
}

export function getFallbackBeritaItem(id: string) {
  return getFallbackBeritaItems().find((item) => item.id === id) ?? null;
}
