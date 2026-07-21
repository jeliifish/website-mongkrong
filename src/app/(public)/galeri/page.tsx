import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicGaleriGrid from "@/components/galeri/PublicGaleriGrid";
import { getFallbackGaleriItems } from "@/lib/galeri-public";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description: "Dokumentasi foto dan dokumentasi kegiatan sosial, budaya, keagamaan, serta pembangunan fisik di Desa Mongkrong.",
};

export default function GaleriPage() {
  const fallbackItems = getFallbackGaleriItems();

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Galeri & Dokumentasi Kegiatan
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto">
            Dokumentasi foto kegiatan warga, acara kemasyarakatan, dan suasana Padukuhan Mongkrong
          </p>
        </div>

        <PublicGaleriGrid fallbackItems={fallbackItems} />
      </main>

      <Footer />
    </div>
  );
}
