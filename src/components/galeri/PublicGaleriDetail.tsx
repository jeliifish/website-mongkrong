"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchGaleriItemById } from "@/lib/galeri-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { GaleriItem } from "@/types/galeri";

type PublicGaleriDetailProps = {
  id: string;
  fallbackItem: GaleriItem | null;
};

export default function PublicGaleriDetail({
  id,
  fallbackItem,
}: PublicGaleriDetailProps) {
  const [item, setItem] = useState<GaleriItem | null>(() =>
    isFirebaseConfigured ? null : fallbackItem,
  );
  const [isLoading, setIsLoading] = useState(() => isFirebaseConfigured);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadGaleri = async () => {
      setIsLoading(true);

      try {
        const remoteItem = await fetchGaleriItemById(id);

        if (isCancelled) {
          return;
        }

        setItem(remoteItem ?? fallbackItem);
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setSyncError(
            "Detail galeri dari Firebase belum bisa dimuat. Menampilkan data yang tersedia.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadGaleri();

    return () => {
      isCancelled = true;
    };
  }, [fallbackItem, id]);

  if (isLoading) {
    return (
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Galeri Desa
        </p>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Memuat detail galeri...
        </p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
          Galeri tidak ditemukan
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Foto yang kamu cari belum tersedia
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
          Bisa jadi item sudah dihapus, ID tidak cocok, atau Firestore belum
          berhasil mengirim data ke halaman publik.
        </p>
        <Link
          href="/galeri"
          className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Kembali ke galeri
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-8 shadow-sm sm:px-10 sm:py-10">
        <Link
          href="/galeri"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          <span aria-hidden="true">&larr;</span>
          Kembali ke galeri
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
            Dokumentasi Desa
          </span>
          <span className="text-zinc-400">&middot;</span>
          <span className="text-zinc-500">{item.updated}</span>
        </div>

        <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          {item.title}
        </h1>
      </section>

      {syncError ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {syncError}
        </div>
      ) : null}

      <section className="mt-8">
        <article className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div
            className="min-h-[30rem] bg-[linear-gradient(180deg,#dfe8df_0%,#bccbbd_100%)] bg-cover bg-center"
            style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
          />
        </article>
      </section>
    </>
  );
}
