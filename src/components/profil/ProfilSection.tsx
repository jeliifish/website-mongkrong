"use client";

import { useEffect, useState } from "react";

import EditProfilModal from "@/components/profil/EditProfilModal";
import EditStatistikModal from "@/components/profil/EditStatistikModal";
import { fetchStatistik, updateStatistik } from "@/lib/statistik-firestore";
import { fetchProfilItems, updateProfilItem, type ProfilItem } from "@/lib/profil-firestore";
import type { StatistikItem } from "@/types/statistik";

type ProfilSectionProps = {
  items: ProfilItem[];
};

export default function ProfilSection({ items }: ProfilSectionProps) {
  const [sections, setSections] = useState<ProfilItem[]>([]);
  const [editingItem, setEditingItem] = useState<ProfilItem | null>(null);
  const [statistik, setStatistik] = useState<StatistikItem | null>(null);
  const [isEditingStatistik, setIsEditingStatistik] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [profilData, statData] = await Promise.all([
        fetchProfilItems(),
        fetchStatistik()
      ]);
      setSections(profilData);
      setStatistik(statData);
    };
    void loadData();
  }, []);

  const handleSave = async (updatedItem: ProfilItem) => {
    try {
      await updateProfilItem(updatedItem);
      setSections((current) =>
        current.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
    }
  };

  const handleSaveStatistik = async (updatedStat: StatistikItem) => {
    try {
      const saved = await updateStatistik(updatedStat);
      setStatistik(saved);
    } catch (err) {
      console.error("Gagal menyimpan statistik:", err);
    }
  };

  return (
    <>
      <div className={`grid gap-4 ${sections.length === 1 ? "grid-cols-1" : "md:grid-cols-2"}`}>
        {sections.map((item) => (
          <article
            key={item.id}
            className="group rounded-[2rem] border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-lg font-semibold text-zinc-900">{item.title}</p>
              <button
                type="button"
                aria-label={`Edit ${item.title}`}
                onClick={() => setEditingItem(item)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="m16.5 3.5 4 4L7 21l-4 1 1-4Z" />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h3 className="text-xl font-semibold text-zinc-900">Statistik Padukuhan</h3>
            <p className="text-sm text-zinc-500 mt-1">Data letak geografis, luas wilayah, dan jumlah KK padukuhan.</p>
          </div>
          {statistik && (
            <button
              type="button"
              onClick={() => setIsEditingStatistik(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-zinc-200 rounded-full text-sm font-semibold text-emerald-700 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition shrink-0"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="m16.5 3.5 4 4L7 21l-4 1 1-4Z" />
              </svg>
              Edit Statistik
            </button>
          )}
        </div>

        {statistik ? (
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-100 bg-[#f9fbf8] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Jumlah Penduduk</span>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">{statistik.jumlahPenduduk}</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-[#f9fbf8] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Jumlah KK</span>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">{statistik.jumlahKK}</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-[#f9fbf8] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Luas Wilayah</span>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">{statistik.luasWilayah}</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-[#f9fbf8] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Jumlah RT</span>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">{statistik.jumlahRT}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-white p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 block">Batas Wilayah</span>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="border-l-2 border-emerald-600 pl-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Utara</span>
                  <p className="text-sm font-semibold text-zinc-800 mt-1">{statistik.batasUtara}</p>
                </div>
                <div className="border-l-2 border-emerald-600 pl-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Timur</span>
                  <p className="text-sm font-semibold text-zinc-800 mt-1">{statistik.batasTimur}</p>
                </div>
                <div className="border-l-2 border-emerald-600 pl-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Selatan</span>
                  <p className="text-sm font-semibold text-zinc-800 mt-1">{statistik.batasSelatan}</p>
                </div>
                <div className="border-l-2 border-emerald-600 pl-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Barat</span>
                  <p className="text-sm font-semibold text-zinc-800 mt-1">{statistik.batasBarat}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-zinc-500 bg-[#f8faf8] border border-zinc-200 border-dashed rounded-2xl p-8 text-center">
            Memuat data statistik...
          </div>
        )}
      </div>

      <EditProfilModal
        item={editingItem}
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
      />

      <EditStatistikModal
        item={statistik}
        isOpen={isEditingStatistik}
        onClose={() => setIsEditingStatistik(false)}
        onSave={handleSaveStatistik}
      />
    </>
  );
}
