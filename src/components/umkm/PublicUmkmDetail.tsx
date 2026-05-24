"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchUmkmItemById } from "@/lib/umkm-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { UmkmItem } from "@/types/umkm";

type PublicUmkmDetailProps = {
  id: string;
  fallbackItem: UmkmItem | null;
};

export default function PublicUmkmDetail({
  id,
  fallbackItem,
}: PublicUmkmDetailProps) {
  const [item, setItem] = useState<UmkmItem | null>(fallbackItem);
  const [isLoading, setIsLoading] = useState(() => isFirebaseConfigured && !fallbackItem);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadUmkm = async () => {
      setIsLoading(true);

      try {
        const remoteItem = await fetchUmkmItemById(id);

        if (isCancelled) {
          return;
        }

        setItem(remoteItem ?? fallbackItem);
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setSyncError(
            "Detail UMKM dari Firebase belum bisa dimuat. Menampilkan data yang tersedia.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadUmkm();

    return () => {
      isCancelled = true;
    };
  }, [fallbackItem, id]);

  if (isLoading) {
    return (
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          UMKM Desa
        </p>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Memuat detail UMKM...
        </p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
          UMKM tidak ditemukan
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Data usaha yang kamu cari belum tersedia
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
          Bisa jadi data sudah dihapus, ID tidak cocok, atau Firestore belum
          berhasil mengirim data ke halaman publik.
        </p>
        <Link
          href="/umkm"
          className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Kembali ke daftar UMKM
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-8 shadow-sm sm:px-10 sm:py-10">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          <span aria-hidden="true">&larr;</span>
          Kembali ke daftar UMKM
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
            Produk Lokal
          </span>
          <span className="text-zinc-400">&middot;</span>
          <span className="text-zinc-500">Pemilik: {item.owner}</span>
        </div>

        <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          {item.name}
        </h1>
      </section>

      {syncError ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {syncError}
        </div>
      ) : null}

      <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_22rem]">
        <article className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div
            className="min-h-[24rem] bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center"
            style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
          />
        </article>

        <aside className="rounded-[2rem] border border-zinc-200 bg-white px-6 py-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Informasi Usaha
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Nama Usaha
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{item.name}</p>
            </div>

            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Pemilik
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{item.owner}</p>
            </div>

            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Nama File
              </p>
              <p className="mt-2 text-sm leading-7 text-zinc-600">
                {item.fileName ?? "Foto produk UMKM desa"}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
