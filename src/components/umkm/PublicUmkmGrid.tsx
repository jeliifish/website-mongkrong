"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchUmkmItems } from "@/lib/umkm-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { UmkmItem } from "@/types/umkm";

type PublicUmkmGridProps = {
  fallbackItems: UmkmItem[];
};

export default function PublicUmkmGrid({ fallbackItems }: PublicUmkmGridProps) {
  const [items, setItems] = useState<UmkmItem[]>(() =>
    isFirebaseConfigured ? [] : fallbackItems,
  );
  const [isLoading, setIsLoading] = useState(() => isFirebaseConfigured);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadUmkm = async () => {
      setIsLoading(true);

      try {
        const remoteItems = await fetchUmkmItems();

        if (isCancelled) {
          return;
        }

        setItems(remoteItems);
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setItems(fallbackItems);
          setSyncError(
            "Data UMKM dari Firebase belum bisa dimuat. Menampilkan data yang tersedia.",
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
  }, [fallbackItems]);

  return (
    <>
      {syncError ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {syncError}
        </div>
      ) : null}

      <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm"
          >
            <Link href={`/umkm/${item.id}`} className="block">
              <div
                className="min-h-56 bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center"
                style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
              />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Produk Lokal
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-900">
                  {item.name}
                </h2>
                <p className="mt-2 text-sm text-zinc-500">Pemilik: {item.owner}</p>
                <p className="mt-4 text-sm font-semibold text-emerald-700">
                  Lihat detail
                </p>
              </div>
            </Link>
          </article>
        ))}
      </section>

      {!isLoading && items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          Belum ada data UMKM yang tersedia saat ini.
        </div>
      ) : null}
    </>
  );
}
