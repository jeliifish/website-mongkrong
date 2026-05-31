"use client";

import { useEffect, useState } from "react";

import { fetchBeritaItems } from "@/lib/berita-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { fetchGaleriItems } from "@/lib/galeri-firestore";
import { fetchUmkmItems } from "@/lib/umkm-firestore";

type HomeHighlightsProps = {
  fallbackBeritaCount: number;
  fallbackGaleriCount: number;
  fallbackUmkmCount: number;
};

type HighlightCard = {
  label: string;
  value: string;
  detail: string;
};

function createHighlightCards({
  beritaCount,
  galeriCount,
  umkmCount,
}: {
  beritaCount: number;
  galeriCount: number;
  umkmCount: number;
}): HighlightCard[] {
  return [
    { label: "Penduduk", value: "3.250+", detail: "Warga terdata" },
    { label: "UMKM", value: String(umkmCount), detail: "Usaha terdaftar" },
    { label: "Berita", value: String(beritaCount), detail: "Berita tersedia" },
    { label: "Galeri", value: String(galeriCount), detail: "Dokumentasi tersedia" },
  ];
}

export default function HomeHighlights({
  fallbackBeritaCount,
  fallbackGaleriCount,
  fallbackUmkmCount,
}: HomeHighlightsProps) {
  const [cards, setCards] = useState<HighlightCard[]>(() =>
    createHighlightCards({
      beritaCount: fallbackBeritaCount,
      galeriCount: fallbackGaleriCount,
      umkmCount: fallbackUmkmCount,
    }),
  );

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadCounts = async () => {
      try {
        const [umkmItems, beritaItems, galeriItems] = await Promise.all([
          fetchUmkmItems(),
          fetchBeritaItems(),
          fetchGaleriItems(),
        ]);

        if (!isCancelled) {
          setCards(
            createHighlightCards({
              beritaCount: beritaItems.length,
              galeriCount: galeriItems.length,
              umkmCount: umkmItems.length,
            }),
          );
        }
      } catch {
        if (!isCancelled) {
          setCards(
            createHighlightCards({
              beritaCount: fallbackBeritaCount,
              galeriCount: fallbackGaleriCount,
              umkmCount: fallbackUmkmCount,
            }),
          );
        }
      }
    };

    void loadCounts();

    return () => {
      isCancelled = true;
    };
  }, [fallbackBeritaCount, fallbackGaleriCount, fallbackUmkmCount]);

  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2 xl:grid-cols-4 lg:px-8">
        {cards.map((item) => (
          <div key={item.label} className="rounded-xl border border-zinc-200 px-5 py-5">
            <p className="text-sm text-zinc-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-700">{item.value}</p>
            <p className="mt-1 text-sm text-zinc-600">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
