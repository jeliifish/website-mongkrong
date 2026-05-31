import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicUmkmGrid from "@/components/umkm/PublicUmkmGrid";
import { getFallbackUmkmItems } from "@/lib/umkm-public";

export default function UmkmPage() {
  const fallbackItems = getFallbackUmkmItems();

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            UMKM Desa
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Produk dan usaha lokal warga desa.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600">
            Temukan beragam produk dan usaha lokal warga Desa Mongkrong,
            lengkap dengan informasi singkat, foto, dan detail usahanya.
          </p>
        </section>

        <PublicUmkmGrid fallbackItems={fallbackItems} />
      </main>

      <Footer />
    </div>
  );
}
