"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBeritaItems } from "@/lib/berita-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { BeritaItem } from "@/types/berita";

type PublicBeritaGridProps = {
  fallbackItems: BeritaItem[];
};

export default function PublicBeritaGrid({
  fallbackItems,
}: PublicBeritaGridProps) {
  const [items, setItems] = useState<BeritaItem[]>(() =>
    isFirebaseConfigured ? [] : fallbackItems.filter((item) => item.status !== "Draft"),
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

        setItems(remoteItems.filter((item) => item.status !== "Draft"));
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setItems(fallbackItems.filter((item) => item.status !== "Draft"));
          setSyncError(
            "Berita dari Firebase belum bisa dimuat. Sementara menampilkan data cadangan.",
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
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {syncError}
        </div>
      ) : null}

      <section className="mt-10 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-5 py-5 sm:px-8 sm:py-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Daftar Berita
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
            Pilih berita yang ingin dibaca
          </h2>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-sm text-zinc-500 sm:px-8">
            Memuat daftar berita...
          </div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {items.map((item, index) => (
              <Link
                key={item.id}
                href={`/berita/${item.id}`}
                className="group block px-5 py-5 transition hover:bg-[#f8faf8] sm:px-8 sm:py-6"
              >
                <article className="grid gap-4 lg:grid-cols-[10rem_minmax(0,1fr)_11rem] lg:items-start">
                  <div className="space-y-2">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {item.category || "Berita Desa"}
                    </span>
                    <p className="text-sm text-zinc-500">{item.date}</p>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-sm font-semibold text-emerald-700 shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 flex flex-col sm:flex-row gap-5 min-w-0">
                        {item.imageUrl && (
                          <div
                            className="h-20 w-32 shrink-0 rounded-xl bg-cover bg-center border border-zinc-100 hidden sm:block"
                            style={{ backgroundImage: `url(${item.imageUrl})` }}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-semibold tracking-tight text-zinc-900 transition group-hover:text-emerald-800 sm:text-2xl">
                            {item.title}
                          </h3>
                          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-start pt-1 lg:justify-end lg:pt-0">
                    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition group-hover:border-emerald-300 group-hover:text-emerald-800">
                      Baca berita
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-sm text-zinc-500 sm:px-8 sm:py-10">
            Belum ada berita yang tersedia saat ini.
          </div>
        )}
      </section>
    </>
  );
}
