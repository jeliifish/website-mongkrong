"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchBeritaItems } from "@/lib/berita-firestore";
import { isFirebaseConfigured, missingFirebaseConfigKeys } from "@/lib/firebase";
import { fetchGaleriItems } from "@/lib/galeri-firestore";
import { fetchUmkmItems } from "@/lib/umkm-firestore";
import type { BeritaItem } from "@/types/berita";
import type { GaleriItem } from "@/types/galeri";
import type { UmkmItem } from "@/types/umkm";

type SummaryCard = {
  label: string;
  value: string;
  detail: string;
};

type ActivityRow = {
  section: string;
  title: string;
  field: string;
  time: string;
};

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

function createSummaryCards(
  beritaItems: BeritaItem[],
  galeriItems: GaleriItem[],
  umkmItems: UmkmItem[],
): SummaryCard[] {
  return [
    {
      label: "Berita",
      value: String(beritaItems.length),
      detail: `${beritaItems.length} judul berita siap dikelola`,
    },
    {
      label: "Galeri",
      value: String(galeriItems.length),
      detail: `${galeriItems.length} item foto tersedia`,
    },
    {
      label: "UMKM",
      value: String(umkmItems.length),
      detail: `${umkmItems.length} data usaha warga aktif`,
    },
    {
      label: "Profil",
      value: "4",
      detail: "4 bagian profil masih memakai data statis",
    },
  ];
}

function createActivityRows(
  beritaItems: BeritaItem[],
  galeriItems: GaleriItem[],
  umkmItems: UmkmItem[],
): ActivityRow[] {
  const rows: ActivityRow[] = [];

  const latestBerita = beritaItems[0];
  const latestGaleri = galeriItems[0];
  const latestUmkm = umkmItems[0];

  if (latestBerita) {
    rows.push({
      section: "Berita",
      title: latestBerita.title,
      field: "Judul, deskripsi, tanggal",
      time: latestBerita.date,
    });
  }

  if (latestGaleri) {
    rows.push({
      section: "Galeri",
      title: latestGaleri.title,
      field: "Judul gambar, upload foto",
      time: latestGaleri.updated,
    });
  }

  if (latestUmkm) {
    rows.push({
      section: "UMKM",
      title: latestUmkm.name,
      field: "Foto, nama usaha, pemilik",
      time: latestUmkm.owner,
    });
  }

  rows.push({
    section: "Profil",
    title: "Sambutan Kepala Desa",
    field: "Judul bagian, deskripsi",
    time: "Data statis",
  });

  return rows;
}

export default function AdminOverviewPanel() {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>(() =>
    createSummaryCards([], [], []),
  );
  const [activityRows, setActivityRows] = useState<ActivityRow[]>(() =>
    createActivityRows([], [], []),
  );
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
        const [beritaItems, galeriItems, umkmItems] = await Promise.all([
          fetchBeritaItems(),
          fetchGaleriItems(),
          fetchUmkmItems(),
        ]);

        if (isCancelled) {
          return;
        }

        setSummaryCards(createSummaryCards(beritaItems, galeriItems, umkmItems));
        setActivityRows(createActivityRows(beritaItems, galeriItems, umkmItems));
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
    <>
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Dashboard
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Ringkasan pengelolaan website desa
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
          Pantau update konten, cek data live dari Firebase, dan buka aksi cepat
          untuk mengelola informasi desa secara efisien.
        </p>
      </div>

      {!isFirebaseConfigured ? (
        <div className="mt-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Firebase belum aktif untuk dashboard admin.
          {missingFirebaseConfigKeys.length > 0 ? (
            <span className="block pt-1 text-amber-800">
              Key yang belum diisi: {missingFirebaseConfigKeys.join(", ")}
            </span>
          ) : null}
        </div>
      ) : null}

      {syncError ? (
        <div className="mt-6 border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {syncError}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-zinc-200 bg-[#f9fbf8] px-5 py-5"
          >
            <p className="text-sm text-zinc-500">{item.label}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-emerald-800">
              {isLoading && isFirebaseConfigured && item.label !== "Profil" ? "..." : item.value}
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-600">{item.detail}</p>
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
                Ringkasan isi terbaru yang sekarang dipakai di dashboard.
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
              <span>Info</span>
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
        </section>
      </div>
    </>
  );
}
