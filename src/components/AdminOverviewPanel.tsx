"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { fetchBeritaItems } from "@/lib/berita-firestore";
import { isFirebaseConfigured, missingFirebaseConfigKeys } from "@/lib/firebase";
import { fetchGaleriItems } from "@/lib/galeri-firestore";
import { fetchUmkmItems } from "@/lib/umkm-firestore";
import { fetchAdminProfiles } from "@/lib/admin-firestore";

export default function AdminOverviewPanel() {
  const { profile } = useAuth();
  const [beritaCount, setBeritaCount] = useState(0);
  const [galeriCount, setGaleriCount] = useState(0);
  const [umkmCount, setUmkmCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(() => isFirebaseConfigured);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadDashboard = async () => {
      setIsLoading(true);
      setSyncError(null);

      try {
        const [beritaItems, galeriItems, umkmItems, adminItems] = await Promise.all([
          fetchBeritaItems(),
          fetchGaleriItems(),
          fetchUmkmItems(),
          fetchAdminProfiles(),
        ]);

        if (isCancelled) {
          return;
        }

        setBeritaCount(beritaItems.filter((b) => b.status !== "Draft").length);
        setGaleriCount(galeriItems.length);
        setUmkmCount(umkmItems.length);
        setUserCount(adminItems.length);
      } catch {
        if (!isCancelled) {
          setSyncError(
            "Dashboard belum bisa memuat data live dari Firebase. Cek rules Firestore dan env deploy.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Selamat Datang Kembali, {profile?.name || "admin"}!
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500 max-w-3xl">
          Selamat datang di panel pengelolaan informasi Padukuhan Mongkrong. Di sini Anda dapat
          memperbarui data profil desa, galeri kegiatan, UMKM warga, dan menerbitkan berita.
        </p>
      </div>

      {!isFirebaseConfigured ? (
        <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 rounded-2xl">
          Firebase belum aktif untuk dashboard admin.
          {missingFirebaseConfigKeys.length > 0 ? (
            <span className="block pt-1 text-amber-800">
              Key yang belum diisi: {missingFirebaseConfigKeys.join(", ")}
            </span>
          ) : null}
        </div>
      ) : null}

      {syncError ? (
        <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800 rounded-2xl">
          {syncError}
        </div>
      ) : null}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL PENGGUNA CMS */}
        <article className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-zinc-400">
              Total Pengguna CMS
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {isLoading ? "..." : userCount}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </article>

        {/* JUMLAH FOTO GALERI */}
        <article className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-zinc-400">
              Jumlah Foto Galeri
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {isLoading ? "..." : galeriCount}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </article>

        {/* JUMLAH UMKM LOKAL */}
        <article className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-zinc-400">
              Jumlah UMKM Lokal
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {isLoading ? "..." : umkmCount}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </article>

        {/* BERITA TERPUBLIKASI */}
        <article className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-zinc-400">
              Berita Terpublikasi
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
              {isLoading ? "..." : beritaCount}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
        </article>
      </div>

      {/* Lower Section */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Panduan Hak Akses Anda */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg
                viewBox="0 0 24 24"
                className="h-5.5 w-5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Panduan Hak Akses Anda</h3>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-500">
            Sebagai pengguna dengan peran <strong className="text-zinc-800">{profile?.role || "Staff Admin"}</strong>, Anda dapat mengakses menu di sidebar sesuai dengan izin yang diberikan. Izin ini dapat diubah sewaktu-waktu oleh Super Admin.
          </p>

          <ul className="mt-6 space-y-3.5">
            {(profile?.role === "Super Admin" || profile?.permissions.profil) && (
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-sm text-zinc-600">
                  <strong className="text-zinc-800">Kelola Profil</strong>: Mengatur deskripsi, sejarah, visi misi, dan identitas Padukuhan Mongkrong.
                </span>
              </li>
            )}

            {(profile?.role === "Super Admin" || profile?.permissions.galeri) && (
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-sm text-zinc-600">
                  <strong className="text-zinc-800">Kelola Galeri</strong>: Mengunggah dokumentasi foto kegiatan padukuhan beserta judul & albumnya.
                </span>
              </li>
            )}

            {(profile?.role === "Super Admin" || profile?.permissions.umkm) && (
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-sm text-zinc-600">
                  <strong className="text-zinc-800">Kelola UMKM</strong>: Memperbarui data usaha mikro, produk unggulan, nama pemilik, dan deskripsi produk warga.
                </span>
              </li>
            )}

            {(profile?.role === "Super Admin" || profile?.permissions.berita) && (
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-sm text-zinc-600">
                  <strong className="text-zinc-800">Kelola Berita</strong>: Menulis, mengedit, dan menerbitkan artikel berita serta pengumuman penting bagi warga desa.
                </span>
              </li>
            )}

            {profile?.role === "Super Admin" && (
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-sm text-zinc-600">
                  <strong className="text-zinc-800">Kelola Pengguna</strong>: Menambahkan akun admin baru, mengelola profil, dan mengatur hak akses modul admin lainnya.
                </span>
              </li>
            )}
          </ul>
        </section>

        {/* Akses Cepat Publik */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-zinc-900">Akses Cepat Publik</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Buka tab baru untuk melihat hasil tampilan di sisi publik website Padukuhan Mongkrong.
          </p>

          <div className="mt-6 flex-1 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition hover:border-zinc-200 hover:bg-zinc-50 hover:shadow-sm"
            >
              <span className="text-sm font-semibold text-zinc-800">Beranda Publik</span>
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>

            <Link
              href="/profil"
              target="_blank"
              className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition hover:border-zinc-200 hover:bg-zinc-50 hover:shadow-sm"
            >
              <span className="text-sm font-semibold text-zinc-800">Profil Publik</span>
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
