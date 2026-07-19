"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { fetchProfilItems, type ProfilItem, fallbackProfilItems } from "@/lib/profil-firestore";
import HomeStatistik from "@/components/home/HomeStatistik";

export default function ProfilPage() {
  const [items, setItems] = useState<ProfilItem[]>(fallbackProfilItems);

  useEffect(() => {
    const loadProfil = async () => {
      const data = await fetchProfilItems();
      setItems(data);
    };
    void loadProfil();
  }, []);

  const sekilas = items.find((x) => x.id === "sekilas") || fallbackProfilItems[0];

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <Header variant="solid" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Profil Padukuhan Mongkrong
          </h1>
          <p className="mt-3 text-sm text-zinc-500 flex items-center justify-center gap-1.5">
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Terakhir diperbarui: 10 Juli 2026
          </p>
        </div>

        {/* Sekilas Tentang Mongkrong Card */}
        <section className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
            {sekilas.title}
          </h2>
          <p className="mt-6 text-base leading-8 text-zinc-600 whitespace-pre-wrap">
            {sekilas.description}
          </p>
        </section>

        {/* Statistik Padukuhan */}
        <HomeStatistik noPadding />
      </main>

      <Footer />
    </div>
  );
}
