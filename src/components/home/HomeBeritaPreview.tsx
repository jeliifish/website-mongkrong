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
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white px-5 py-8 text-sm text-zinc-500 sm:px-6 sm:py-10">
          Memuat preview berita...
        </div>
      ) : items.length > 0 ? (
        <div
          className={`mt-8 grid gap-5 ${
            items.length === 1
              ? "grid-cols-1"
              : items.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-3"
          }`}
        >
          {items.map((item) => (
            <article
              key={item.id}
              className={`overflow-hidden rounded-[2rem] border border-zinc-200 bg-white flex flex-col ${
                items.length === 1 ? "max-w-none" : ""
              }`}
            >
              {item.imageUrl && (
                <div
                  className="h-48 w-full bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
              )}
              <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    {item.category}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">{item.date}</p>
                  <h3
                    className={`mt-3 font-semibold tracking-tight text-zinc-900 line-clamp-2 ${
                      items.length === 1 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-3 text-zinc-600 line-clamp-3 ${
                      items.length === 1 ? "max-w-4xl text-base leading-8" : "text-sm leading-7"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
                <div className="mt-5">
                  <Link
                    href={`/berita/${item.id}`}
                    className="inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    Baca detail
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-8 text-sm text-zinc-500 sm:px-6 sm:py-10">
          Belum ada berita yang tersedia untuk ditampilkan di beranda.
        </div>
      )}
    </>
  );
}
