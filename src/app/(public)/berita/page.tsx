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
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Berita Desa
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Kabar dan kegiatan terbaru dari desa.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600">
            Halaman ini menampung berita, pengumuman, dan dokumentasi kegiatan
            yang dipublikasikan oleh admin desa untuk warga dan pengunjung.
          </p>
        </section>

        <PublicBeritaGrid fallbackItems={fallbackItems} />
      </main>

      <Footer />
    </div>
  );
}
