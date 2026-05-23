import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { profileCards } from "@/data/site-content";

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Profil Desa
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Mengenal Desa Mongkrong lebih dekat.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600">
            Halaman ini bisa dipakai untuk menampilkan sejarah desa, visi misi,
            potensi unggulan, sambutan kepala desa, dan informasi umum lainnya
            secara lebih lengkap dibanding ringkasan di beranda.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {profileCards.map((item) => (
            <article key={item.title} className="rounded-xl border border-zinc-200 bg-white p-6">
              <p className="text-sm font-semibold text-emerald-700">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-200 bg-[#f8faf8] p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-zinc-900">Sambutan Singkat</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-zinc-600">
            Selamat datang di website resmi desa. Media ini diharapkan menjadi
            ruang informasi yang mudah diakses warga untuk mengetahui kegiatan,
            pelayanan, dan potensi yang ada di desa.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Kembali ke beranda
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
