import Link from "next/link";

const quickLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil Desa", href: "/profil" },
  { label: "Berita Desa", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
  { label: "UMKM", href: "/umkm" },
  { label: "Pemetaan Desa", href: "/pemetaan" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-emerald-900 bg-[#14261b] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold tracking-[0.18em] text-white">
              DM
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                Desa Mongkrong
              </p>
              <p className="text-sm text-emerald-100/75">
                Kalurahan Sampang
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-md text-sm leading-7 text-emerald-50/75">
            Website informasi desa untuk profil wilayah, berita kegiatan,
            galeri, dan promosi UMKM warga.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Navigasi
          </h2>
          <div className="mt-5 flex flex-col gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-emerald-50/75 transition hover:text-emerald-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div id="kontak">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Kontak
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-emerald-50/75">
            <p>
              Balai Desa Mongkrong
              <br />
              Jl. Raya Desa No. 1
              <br />
              Isi alamat lengkap sesuai data desa
            </p>
            <p>
              Email: halo@desamongkrong.id
              <br />
              Telepon: (000) 0000-0000
              <br />
              Jam layanan: Senin - Jumat, 08.00 - 15.00 WIB
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-emerald-50/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {year} Desa Mongkrong. Seluruh hak cipta dilindungi.</p>
          <p>Dikelola oleh admin desa.</p>
        </div>
      </div>
    </footer>
  );
}
