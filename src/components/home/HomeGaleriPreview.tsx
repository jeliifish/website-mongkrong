"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchGaleriItems } from "@/lib/galeri-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { GaleriItem } from "@/types/galeri";

type HomeGaleriPreviewProps = {
  fallbackItems: GaleriItem[];
};

export default function HomeGaleriPreview({
  fallbackItems,
}: HomeGaleriPreviewProps) {
  const [items, setItems] = useState<GaleriItem[]>(() =>
    isFirebaseConfigured ? [] : fallbackItems.slice(0, 4),
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

        setItems(remoteItems.slice(0, 4));
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setItems(fallbackItems.slice(0, 4));
          setSyncError(
            "Preview galeri dari Firebase belum bisa dimuat. Menampilkan data cadangan.",
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
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {syncError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white px-5 py-8 text-sm text-zinc-500 sm:px-6 sm:py-10">
          Memuat preview galeri...
        </div>
      ) : items.length > 0 ? (
        <div
          className={`mt-8 grid gap-4 ${
            items.length === 1
              ? "grid-cols-1"
              : items.length === 2
                ? "sm:grid-cols-2"
                : items.length === 3
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`/galeri/${item.id}`}
              className={`relative flex items-end overflow-hidden rounded-xl border border-zinc-200 bg-[linear-gradient(180deg,#dfe8df_0%,#bccbbd_100%)] bg-cover bg-center p-4 sm:p-5 ${
                items.length === 1 ? "min-h-72 sm:min-h-80" : "min-h-48 sm:min-h-56"
              }`}
              style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.18)_45%,rgba(15,23,42,0.72)_100%)]" />
              <div className="relative z-10 max-w-full rounded-2xl bg-white/14 px-3 py-3 backdrop-blur-[2px]">
                <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Foto {index + 1}
                </span>
                <p
                  className={`mt-3 font-semibold tracking-tight text-white ${
                    items.length === 1 ? "max-w-2xl text-2xl sm:text-3xl" : "max-w-[14rem] text-base sm:text-lg"
                  }`}
                >
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-8 text-sm text-zinc-500 sm:px-6 sm:py-10">
          Belum ada galeri di Firestore untuk ditampilkan di beranda.
        </div>
      )}
    </>
  );
}
