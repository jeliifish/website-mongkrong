"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchBeritaItems } from "@/lib/berita-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { BeritaItem } from "@/types/berita";

type HomeBeritaPreviewProps = {
  fallbackItems: BeritaItem[];
};

export default function HomeBeritaPreview({
  fallbackItems,
}: HomeBeritaPreviewProps) {
  const [items, setItems] = useState<BeritaItem[]>(() =>
    isFirebaseConfigured ? [] : fallbackItems.slice(0, 3),
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
        const remoteItems = await fetchBeritaItems();

        if (isCancelled) {
          return;
        }

        setItems(remoteItems.slice(0, 3));
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setItems(fallbackItems.slice(0, 3));
          setSyncError(
            "Preview berita dari Firebase belum bisa dimuat. Menampilkan data cadangan.",
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
  }, [fallbackItems]);

  return (
    <>
      {syncError ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {syncError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-sm text-zinc-500">
          Memuat preview berita...
        </div>
      ) : items.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                {item.category}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{item.date}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-zinc-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {item.description}
              </p>
              <Link
                href={`/berita/${item.id}`}
                className="mt-5 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Baca detail
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-sm text-zinc-500">
          Belum ada berita di Firestore untuk ditampilkan di beranda.
        </div>
      )}
    </>
  );
}
