import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomeBeritaPreview from "@/components/home/HomeBeritaPreview";
import HomeGaleriPreview from "@/components/home/HomeGaleriPreview";
import HomeUmkmPreview from "@/components/home/HomeUmkmPreview";
import { getFallbackBeritaItems } from "@/lib/berita-public";
import { getFallbackGaleriItems } from "@/lib/galeri-public";
import { getFallbackUmkmItems } from "@/lib/umkm-public";
import {
  highlights,
  profileCards,
} from "@/data/site-content";

export default function Home() {
  const fallbackBeritaItems = getFallbackBeritaItems();
  const fallbackGaleriItems = getFallbackGaleriItems();
  const fallbackUmkmItems = getFallbackUmkmItems();

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <main>
        <section className="relative min-h-[88vh] overflow-hidden bg-[#223127] text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-desa.svg')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,20,0.28)_0%,rgba(18,24,20,0.4)_36%,rgba(18,24,20,0.58)_100%)]" />
          <Header />

          <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center justify-center px-4 pb-20 pt-32 text-center sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                Selamat Datang
              </h1>
              <p className="mt-4 text-2xl font-medium text-white/95 sm:text-3xl">
                Website Informasi Desa Mongkrong
              </p>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
                Sumber informasi terbaru tentang profil desa, berita kegiatan,
                galeri, dan potensi UMKM warga.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/profil"
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Lihat Profil
                </Link>
                <Link
                  href="/berita"
                  className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Baca Berita
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-4 bg-emerald-700" />
        </section>

        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-xl border border-zinc-200 px-5 py-5">
                <p className="text-sm text-zinc-500">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-700">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-zinc-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="profil" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Jelajahi Desa
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-emerald-700 sm:text-5xl">
              Profil singkat dan informasi utama.
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-600">
              Melalui website ini warga dan pengunjung dapat melihat gambaran
              desa, kegiatan terbaru, galeri dokumentasi, serta potensi UMKM
              lokal dalam tampilan yang sederhana dan mudah diakses.
            </p>
            <Link
              href="/profil"
              className="mt-7 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Lihat selengkapnya
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {profileCards.map((item) => (
              <article key={item.title} className="rounded-xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-semibold text-emerald-700">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="berita" className="border-y border-zinc-200 bg-[#f8faf8]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Berita
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                  Kabar terbaru dari desa.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-zinc-600">
                Bagian ini nanti bisa diisi dari dashboard admin agar berita
                dan pengumuman lebih mudah diperbarui.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/berita"
                className="inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Lihat selengkapnya
              </Link>
            </div>

            <HomeBeritaPreview fallbackItems={fallbackBeritaItems} />
          </div>
        </section>

        <section id="galeri" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Galeri
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                Dokumentasi kegiatan warga.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-600">
              Jika nanti foto kegiatan sudah siap, bagian ini tinggal diisi
              gambar asli dari admin.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/galeri"
              className="inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Lihat selengkapnya
            </Link>
          </div>

          <HomeGaleriPreview fallbackItems={fallbackGaleriItems} />
        </section>

        <section id="umkm" className="border-t border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  UMKM
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                  Produk dan usaha lokal warga.
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-600">
                  Bagian ini cocok untuk menampilkan makanan khas, kerajinan,
                  jasa, atau hasil produksi warga desa.
                </p>
                <Link
                  href="/umkm"
                  className="mt-7 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Lihat selengkapnya
                </Link>
              </div>
              <HomeUmkmPreview fallbackItems={fallbackUmkmItems} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
