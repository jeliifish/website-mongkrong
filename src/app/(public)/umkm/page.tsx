import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { umkmProducts } from "@/data/site-content";

export default function UmkmPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            UMKM Desa
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Produk dan usaha lokal warga desa.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600">
            Halaman ini bisa menampilkan daftar UMKM, deskripsi usaha, foto
            produk, alamat, dan kontak pemilik usaha secara lebih lengkap.
          </p>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {umkmProducts.map((item) => (
            <article
              key={item}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Produk Lokal
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-900">
                {item}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                Tambahkan foto produk, deskripsi singkat, harga, dan kontak
                pelaku usaha dari dashboard admin.
              </p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
