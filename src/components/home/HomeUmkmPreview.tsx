"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchUmkmItems } from "@/lib/umkm-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { UmkmItem } from "@/types/umkm";

type HomeUmkmPreviewProps = {
  fallbackItems: UmkmItem[];
};

export default function HomeUmkmPreview({ fallbackItems }: HomeUmkmPreviewProps) {
  const [items, setItems] = useState<UmkmItem[]>(() =>
    isFirebaseConfigured ? [] : fallbackItems.slice(0, 4),
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadUmkm = async () => {
      try {
        const remoteItems = await fetchUmkmItems();

        if (isCancelled) {
          return;
        }

        setItems(remoteItems.slice(0, 4));
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setItems(fallbackItems.slice(0, 4));
          setSyncError(
            "Preview UMKM dari Firebase belum bisa dimuat. Menampilkan data cadangan.",
          );
        }
      }
    };

    void loadUmkm();

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

      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/umkm/${item.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-[#f8faf8] transition hover:border-emerald-200 hover:bg-white"
            >
              <div
                className="h-40 w-full bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center shrink-0"
                style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
              />
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Produk Lokal
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-zinc-900 group-hover:text-emerald-700 transition sm:text-lg">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    Pemilik: {item.owner}
                  </p>
                </div>
                <p className="mt-4 text-sm font-semibold text-emerald-700">Lihat detail</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-[#f8faf8] px-5 py-8 text-sm text-zinc-500 sm:px-6 sm:py-10">
          Belum ada data UMKM yang tersedia untuk ditampilkan di beranda.
        </div>
      )}
    </>
  );
}
