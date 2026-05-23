import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { featuredNews } from "@/data/site-content";

export default function BeritaPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredNews.map((item) => (
            <article key={item.title} className="rounded-xl border border-zinc-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Berita Desa
              </p>
              <p className="mt-2 text-sm text-zinc-500">{item.date}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-600">
                {item.excerpt}
              </p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
