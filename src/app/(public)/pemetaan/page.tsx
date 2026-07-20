import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicPemetaanGrid from "@/components/pemetaan/PublicPemetaanGrid";
import { getPemetaanItems } from "@/lib/pemetaan";

export const metadata: Metadata = {
  title: "Peta & Pemetaan Lahan",
  description: "Cakupan wilayah administrasi, batas wilayah RT/RW, dan persebaran peta tata guna lahan serta tutupan lahan Desa Mongkrong.",
};

export default function PemetaanPage() {
  const items = getPemetaanItems();

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Pemetaan Desa
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Peta wilayah dan tutupan lahan Desa Mongkrong.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600">
            Jelajahi peta batas wilayah administrasi serta peta tutupan lahan
            Desa Mongkrong untuk memahami cakupan wilayah dan pemanfaatan
            lahan secara lebih jelas.
          </p>
        </section>

        <PublicPemetaanGrid items={items} />
      </main>

      <Footer />
    </div>
  );
}
