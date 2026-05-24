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
              className="rounded-xl border border-zinc-200 bg-[#f8faf8] p-4 transition hover:border-emerald-200 hover:bg-white sm:p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Produk Lokal
              </p>
              <h3 className="mt-3 text-base font-semibold text-zinc-900 sm:text-lg">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-600">
                Pemilik: {item.owner}
              </p>
              <p className="mt-4 text-sm font-semibold text-emerald-700">Lihat detail</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-[#f8faf8] px-5 py-8 text-sm text-zinc-500 sm:px-6 sm:py-10">
          Belum ada data UMKM di Firestore untuk ditampilkan di beranda.
        </div>
      )}
    </>
  );
}
