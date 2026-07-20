"use client";

import { useEffect, useState } from "react";
import { fetchStatistik } from "@/lib/statistik-firestore";
import type { StatistikItem } from "@/types/statistik";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomeStatistik({ noPadding }: { noPadding?: boolean }) {
  const [statistik, setStatistik] = useState<StatistikItem | null>(null);

  useEffect(() => {
    const loadStat = async () => {
      const data = await fetchStatistik();
      setStatistik(data);
    };
    void loadStat();
  }, []);

  if (!statistik) {
    return (
      <div className={noPadding ? "py-8 text-center text-zinc-500" : "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center text-zinc-500"}>
        Memuat statistik padukuhan...
      </div>
    );
  }

  const statCards = [
    {
      label: "Jumlah Penduduk",
      value: statistik.jumlahPenduduk,
      icon: (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      label: "Jumlah KK",
      value: statistik.jumlahKK,
      icon: (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: "Luas Wilayah",
      value: statistik.luasWilayah,
      icon: (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      label: "Jumlah RT",
      value: statistik.jumlahRT,
      icon: (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
  ];

  const borderCards = [
    {
      label: "Batas Utara",
      value: statistik.batasUtara,
      icon: (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      )
    },
    {
      label: "Batas Timur",
      value: statistik.batasTimur,
      icon: (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      )
    },
    {
      label: "Batas Selatan",
      value: statistik.batasSelatan,
      icon: (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      )
    },
    {
      label: "Batas Barat",
      value: statistik.batasBarat,
      icon: (
        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      )
    },
  ];

  const customCards = (statistik.customStats || []).map((cs) => ({
    label: cs.label,
    value: cs.value,
    icon: (
      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }));

  const allCards = [...statCards, ...customCards, ...borderCards];

  return (
    <section className={noPadding ? "py-12" : "mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"}>
      <div className="mb-10 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Infografis
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-700 sm:text-4xl">
          Statistik Padukuhan
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {allCards.map((card, i) => (
          <ScrollReveal key={card.label} animation="fade-up" delay={i * 80} duration={600} distance={25} className="h-full">
            <div
              className="flex h-full items-center gap-4 rounded-2xl border border-zinc-200 bg-[#f8faf8] p-5 transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-[0_12px_30px_rgba(16,185,129,0.04)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e6f7ec]">
                {card.icon}
              </div>
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  {card.label}
                </span>
                <p className="mt-1 text-base font-semibold text-zinc-900 sm:text-lg whitespace-pre-wrap leading-tight">
                  {card.value}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
