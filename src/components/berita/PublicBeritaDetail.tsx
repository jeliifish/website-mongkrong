"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBeritaItemById } from "@/lib/berita-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { BeritaItem } from "@/types/berita";

type PublicBeritaDetailProps = {
  id: string;
  fallbackItem: BeritaItem | null;
};

export default function PublicBeritaDetail({
  id,
  fallbackItem,
}: PublicBeritaDetailProps) {
  const [item, setItem] = useState<BeritaItem | null>(() =>
    isFirebaseConfigured ? null : fallbackItem,
  );
  const [isLoading, setIsLoading] = useState(() => isFirebaseConfigured);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadBerita = async () => {
      setIsLoading(true);

      try {
        const remoteItem = await fetchBeritaItemById(id);

        if (isCancelled) {
          return;
        }

        setItem(remoteItem ?? fallbackItem);
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setSyncError(
            "Detail berita dari Firebase belum bisa dimuat. Menampilkan data yang tersedia.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadBerita();

    return () => {
      isCancelled = true;
    };
  }, [fallbackItem, id]);

  if (isLoading) {
    return (
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Berita Desa
        </p>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Memuat detail berita...
        </p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
          Berita tidak ditemukan
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Artikel yang kamu cari belum tersedia
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
          Bisa jadi artikel sudah dihapus, ID tidak cocok, atau Firestore belum
          berhasil mengirim data ke halaman publik.
        </p>
        <Link
          href="/berita"
          className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Kembali ke daftar berita
        </Link>
      </section>
    );
  }

  const visibleContent = item.content.filter(
    (paragraph) => paragraph.trim().length > 0 && !isDuplicateSummary(paragraph, item.description),
  );

  return (
    <>
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-8 shadow-sm sm:px-10 sm:py-10">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          <span aria-hidden="true">&larr;</span>
          Kembali ke daftar berita
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
            {item.category}
          </span>
          <span className="text-zinc-400">&middot;</span>
          <span className="text-zinc-500">{item.date}</span>
          <span className="text-zinc-400">&middot;</span>
          <span className="text-zinc-500">{item.author}</span>
        </div>

        <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          {item.title}
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-600 sm:text-lg">
          {item.description}
        </p>
      </section>

      {syncError ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {syncError}
        </div>
      ) : null}

      {visibleContent.length > 0 ? (
        <section className="mt-8">
          <article className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-8 shadow-sm sm:px-10">
            <div className="space-y-6">
              {visibleContent.map((paragraph, index) => (
                <p
                  key={`${item.id}-paragraph-${index}`}
                  className="text-base leading-8 text-zinc-700"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </section>
      ) : null}
    </>
  );
}

function isDuplicateSummary(content: string, description: string) {
  return normalizeText(content) === normalizeText(description);
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}
