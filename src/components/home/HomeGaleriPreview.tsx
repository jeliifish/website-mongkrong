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
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-sm text-zinc-500">
          Memuat preview galeri...
        </div>
      ) : items.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`/galeri/${item.id}`}
              className="flex min-h-56 items-end rounded-xl border border-zinc-200 bg-[linear-gradient(180deg,#dfe8df_0%,#bccbbd_100%)] bg-cover bg-center p-5"
              style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
            >
              <div>
                <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Foto {index + 1}
                </span>
                <p className="mt-3 max-w-[12rem] text-lg font-semibold tracking-tight text-zinc-900">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-sm text-zinc-500">
          Belum ada galeri di Firestore untuk ditampilkan di beranda.
        </div>
      )}
    </>
  );
}
