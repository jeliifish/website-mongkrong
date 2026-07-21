import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicBeritaGrid from "@/components/berita/PublicBeritaGrid";
import { getFallbackBeritaItems } from "@/lib/berita-public";

export const metadata: Metadata = {
  title: "Berita & Pengumuman",
  description: "Ikuti terus kabar terbaru, agenda kegiatan, pengumuman publik, dan informasi resmi dari perangkat desa Mongkrong.",
};

export default function BeritaPage() {
  const fallbackItems = getFallbackBeritaItems();

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Berita & Pengumuman Padukuhan
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto">
            Kabar terbaru, agenda kegiatan warga, dan informasi resmi Padukuhan Mongkrong
          </p>
        </div>

        <PublicBeritaGrid fallbackItems={fallbackItems} />
      </main>

      <Footer />
    </div>
  );
}
