import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicUmkmGrid from "@/components/umkm/PublicUmkmGrid";
import { getFallbackUmkmItems } from "@/lib/umkm-public";

export const metadata: Metadata = {
  title: "UMKM Lokal",
  description: "Daftar usaha mikro, kecil, menengah, potensi produk lokal warga, dan kerajinan kreatif khas Desa Mongkrong.",
};

export default function UmkmPage() {
  const fallbackItems = getFallbackUmkmItems();

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            UMKM & Potensi Usaha Lokal
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto">
            Produk unggulan, kerajinan kreatif, dan potensi ekonomi warga Padukuhan Mongkrong
          </p>
        </div>

        <PublicUmkmGrid fallbackItems={fallbackItems} />
      </main>

      <Footer />
    </div>
  );
}
