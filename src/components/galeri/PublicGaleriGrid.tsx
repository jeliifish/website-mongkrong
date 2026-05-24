"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchGaleriItems } from "@/lib/galeri-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { GaleriItem } from "@/types/galeri";

type PublicGaleriGridProps = {
  fallbackItems: GaleriItem[];
};

export default function PublicGaleriGrid({ fallbackItems }: PublicGaleriGridProps) {
  const [items, setItems] = useState<GaleriItem[]>(() =>
    isFirebaseConfigured ? [] : fallbackItems,
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
        const remoteItems = await fetchGaleriItems();

        if (isCancelled) {
          return;
        }

        setItems(remoteItems);
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setItems(fallbackItems);
          setSyncError(
            "Data galeri dari Firebase belum bisa dimuat. Menampilkan data yang tersedia.",
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
  }, [fallbackItems]);

  return (
    <>
      {syncError ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {syncError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          Memuat galeri...
        </div>
      ) : (
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm"
            >
              <Link href={`/galeri/${item.id}`} className="block">
                <div
                  className="flex min-h-64 items-end bg-[linear-gradient(180deg,#dfe8df_0%,#bccbbd_100%)] bg-cover bg-center p-5"
                  style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
                >
                  <span className="inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Foto {index + 1}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500">Update: {item.updated}</p>
                  <p className="mt-4 text-sm font-semibold text-emerald-700">
                    Lihat detail
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </section>
      )}

      {!isLoading && items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          Belum ada foto galeri di Firestore.
        </div>
      ) : null}
    </>
  );
}
