import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicBeritaDetail from "@/components/berita/PublicBeritaDetail";
import { getFallbackBeritaItem } from "@/lib/berita-public";
import { fetchBeritaItemById } from "@/lib/berita-firestore";

type BeritaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: BeritaDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const item = await fetchBeritaItemById(id);
    if (item && item.status !== "Draft") {
      return {
        title: item.title,
        description: item.description || (item.content?.[0] || "").substring(0, 160),
      };
    }
  } catch (error) {
    // Ignore error, fallback to fallbackItem below
  }

  const fallbackItem = getFallbackBeritaItem(id);
  return {
    title: fallbackItem?.title || "Detail Berita",
    description: fallbackItem?.description || "Detail berita kegiatan warga Desa Mongkrong.",
  };
}

export default async function BeritaDetailPage({
  params,
}: BeritaDetailPageProps) {
  const { id } = await params;
  const fallbackItem = getFallbackBeritaItem(id);

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <PublicBeritaDetail id={id} fallbackItem={fallbackItem} />
      </main>

      <Footer />
    </div>
  );
}
