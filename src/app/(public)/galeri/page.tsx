import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { galleryMoments } from "@/data/site-content";

export default function GaleriPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Galeri Desa
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Dokumentasi kegiatan dan suasana desa.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600">
            Nanti bagian ini bisa diisi foto-foto kegiatan warga, acara desa,
            pembangunan, maupun potret lingkungan desa dari dashboard admin.
          </p>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {galleryMoments.map((item, index) => (
            <article
              key={item}
              className="flex min-h-64 items-end rounded-xl border border-zinc-200 bg-[linear-gradient(180deg,#dfe8df_0%,#bccbbd_100%)] p-5"
            >
              <div>
                <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Foto {index + 1}
                </span>
                <h2 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900">
                  {item}
                </h2>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
