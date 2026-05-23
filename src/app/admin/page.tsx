import Link from "next/link";

const summaryCards = [
  {
    label: "Berita",
    value: "3",
    detail: "3 judul berita siap dikelola",
  },
  {
    label: "Galeri",
    value: "3",
    detail: "3 album foto tersedia",
  },
  {
    label: "UMKM",
    value: "3",
    detail: "3 data usaha warga aktif",
  },
  {
    label: "Profil",
    value: "4",
    detail: "4 bagian profil bisa diedit",
  },
];

const quickActions = [
  {
    title: "Kelola berita desa",
    description: "Tambah atau perbarui judul, deskripsi, dan tanggal berita.",
    href: "/admin/berita",
  },
  {
    title: "Tambah foto galeri",
    description: "Unggah judul gambar dan dokumentasi foto kegiatan terbaru.",
    href: "/admin/galeri",
  },
  {
    title: "Kelola UMKM",
    description: "Perbarui nama usaha, pemilik, dan foto UMKM warga.",
    href: "/admin/umkm",
  },
  {
    title: "Edit profil desa",
    description: "Sesuaikan sejarah desa, visi misi, dan potensi unggulan.",
    href: "/admin/profil",
  },
];

const activityRows = [
  {
    section: "Berita",
    title: "Kerja Bakti Lingkungan RW 03",
    field: "Judul, deskripsi, tanggal",
    time: "24 Mei 2026",
  },
  {
    section: "Galeri",
    title: "Pelatihan UMKM Mei",
    field: "Judul gambar, upload foto",
    time: "23 Mei 2026",
  },
  {
    section: "Profil",
    title: "Sambutan Kepala Desa",
    field: "Judul bagian, deskripsi",
    time: "22 Mei 2026",
  },
  {
    section: "UMKM",
    title: "Kerajinan Anyaman Bambu",
    field: "Foto, nama usaha, pemilik",
    time: "21 Mei 2026",
  },
];

export default function AdminOverviewPage() {
  return (
    <>
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Dashboard
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Ringkasan pengelolaan website desa
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
          Pantau update konten, cek draft, dan buka aksi cepat untuk
          mengelola informasi desa secara efisien.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-zinc-200 bg-[#f9fbf8] px-5 py-5"
          >
            <p className="text-sm text-zinc-500">{item.label}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-emerald-800">
              {item.value}
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              {item.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-zinc-950">
                Aktivitas Konten
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Ringkasan isi yang sekarang dipakai di tiap halaman admin.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Live
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-zinc-200">
            <div className="grid grid-cols-[0.8fr_1.7fr_1.2fr_0.9fr] gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              <span>Bagian</span>
              <span>Konten</span>
              <span>Field</span>
              <span>Tanggal</span>
            </div>
            {activityRows.map((row) => (
              <div
                key={`${row.section}-${row.title}`}
                className="grid grid-cols-[0.8fr_1.7fr_1.2fr_0.9fr] gap-3 border-b border-zinc-100 px-4 py-4 text-sm last:border-b-0"
              >
                <span className="font-semibold text-zinc-700">{row.section}</span>
                <span className="text-zinc-900">{row.title}</span>
                <span className="text-zinc-600">{row.field}</span>
                <span className="text-zinc-500">{row.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-zinc-200 bg-[#f9fbf8] p-5">
            <p className="text-lg font-semibold text-zinc-950">Aksi Cepat</p>
            <div className="mt-4 space-y-4">
              {quickActions.map((action) => (
                <article
                  key={action.title}
                  className="rounded-3xl border border-zinc-200 bg-white p-4"
                >
                  <p className="text-base font-semibold text-zinc-900">
                    {action.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">
                    {action.description}
                  </p>
                  <Link
                    href={action.href}
                    className="mt-4 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    Buka menu
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-5">
            <p className="text-lg font-semibold text-zinc-950">Catatan Admin</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-600">
              <li className="rounded-2xl bg-zinc-50 px-4 py-3">
                Setiap berita sekarang dikelola dengan field judul, deskripsi, dan tanggal.
              </li>
              <li className="rounded-2xl bg-zinc-50 px-4 py-3">
                Data galeri memakai judul gambar dan upload foto sebagai field utama.
              </li>
              <li className="rounded-2xl bg-zinc-50 px-4 py-3">
                UMKM dan profil sudah pakai modal edit langsung dari dashboard masing-masing.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
