"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { PemetaanItem } from "@/lib/pemetaan";
import type { LahanItem, TanamanItem } from "@/lib/lahan";

type PublicPemetaanDetailProps = {
  item: PemetaanItem | undefined;
  lahanItems?: LahanItem[];
  tanamanItems?: TanamanItem[];
};

export default function PublicPemetaanDetail({ item, lahanItems, tanamanItems }: PublicPemetaanDetailProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);
  if (!item) {
    return (
      <section className="rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Peta tidak ditemukan
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Peta yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          href="/pemetaan"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Pemetaan
        </Link>
      </section>
    );
  }

  return (
    <div>
      <Link
        href="/pemetaan"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Kembali ke Pemetaan
      </Link>

      <section className="mt-5 overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {item.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600">
            {item.summary}
          </p>

          {item.lastUpdated ? (
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Data diperbarui {item.lastUpdated}
            </div>
          ) : null}

          {/* Dynamic Land Use Distribution and Yield Estimator for Land Use Page */}
          {isMounted && item.slug === "tutupan-lahan" && lahanItems && lahanItems.length > 0 && (
            <div className="mt-8 border-t border-zinc-100 pt-8">
              <h2 className="text-xl font-semibold text-zinc-900">
                Distribusi Pemanfaatan Lahan (Live Data)
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Berikut adalah data pemanfaatan lahan Desa Mongkrong secara riil dari database. Persentase dihitung otomatis berdasarkan luas wilayah masing-masing kategori.
              </p>

              {/* Distribution Chart / Progress Bars */}
              <div className="mt-6 space-y-4">
                {(() => {
                  const numberFormatter = new Intl.NumberFormat("id-ID");
                  const total = lahanItems.reduce((acc, curr) => acc + curr.area, 0);
                  return lahanItems.map((lahan) => {
                    const pct = total > 0 ? ((lahan.area / total) * 100).toFixed(1) : "0";
                    return (
                      <div key={lahan.id} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-zinc-700">{lahan.name}</span>
                          <span className="font-semibold text-emerald-800">
                            {numberFormatter.format(lahan.area)} Ha ({pct}%)
                          </span>
                        </div>
                        <div className="h-3.5 w-full rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
                {/* Total Area summary */}
                <div className="flex justify-end text-xs font-semibold text-zinc-500 mt-1">
                  <span>Total Luas Wilayah Terpetakan: {new Intl.NumberFormat("id-ID").format(lahanItems.reduce((acc, curr) => acc + curr.area, 0))} Ha</span>
                </div>
              </div>

              {/* Yield Estimation Section */}
              {tanamanItems && tanamanItems.length > 0 && (
                <div className="mt-10 rounded-2xl bg-emerald-50/50 border border-emerald-100 p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-emerald-950">
                        Estimasi Hasil Panen Komoditas Utama
                      </h3>
                      <p className="text-sm leading-6 text-emerald-900/80">
                        Berikut adalah kalkulasi otomatis potensi hasil panen per musim berdasarkan luas lahan riil saat ini.
                      </p>
                    </div>
                  </div>

                  {/* Crop Grid */}
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {tanamanItems.map((tanaman) => {
                      const landCategory = lahanItems.find((l) => l.id === tanaman.landCategoryId);
                      const area = landCategory ? landCategory.area : 0;
                      
                      // Indonesian agricultural correction & crop portion factors:
                      // - Padi (Sawah): 90% (10% pematang sawah / galengan BPS)
                      // - Timun (Tegalan): 20% (porsi penanaman timun)
                      // - Jagung (Tegalan): 40% (porsi penanaman jagung)
                      // - Cabai (Pekarangan): 5% (porsi pemanfaatan pekarangan rumah tangga)
                      const landUseFactor = tanaman.landUseFactor !== undefined ? tanaman.landUseFactor : 1.0;
                      const factorNotes = tanaman.factorNotes || `Porsi Tanam (${(landUseFactor * 100).toFixed(0)}%)`;

                      const effectiveArea = area * landUseFactor;
                      const productivity = tanaman.productivityPerHa;
                      const estimatedHarvest = effectiveArea * productivity;

                      const formattedGrossArea = new Intl.NumberFormat("id-ID", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 4
                      }).format(area);

                      const formattedEffectiveArea = new Intl.NumberFormat("id-ID", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 4
                      }).format(effectiveArea);

                      const formattedHarvest = new Intl.NumberFormat("id-ID", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 4
                      }).format(estimatedHarvest);

                      return (
                        <div
                          key={tanaman.id}
                          className="rounded-2xl bg-white border border-emerald-950/5 p-6 shadow-sm flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[0.65rem] font-bold text-emerald-700 uppercase tracking-widest">Komoditas</span>
                                <h4 className="font-extrabold text-xl text-emerald-950 mt-0.5">{tanaman.name}</h4>
                              </div>
                              <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.7rem] font-semibold text-emerald-700 uppercase tracking-wider">
                                {landCategory?.name || ""}
                              </span>
                            </div>

                            <div className="mt-5 space-y-2.5 text-xs text-zinc-500 border-t border-zinc-50 pt-4">
                              <div className="flex justify-between items-center">
                                <span>Luas Lahan Total ({landCategory?.name || ""}):</span>
                                <span className="font-semibold text-zinc-700">{formattedGrossArea} Ha</span>
                              </div>
                              <div className="flex justify-between items-center text-emerald-800">
                                <span>Faktor Koreksi Lahan:</span>
                                <span className="font-bold">{factorNotes}</span>
                              </div>
                              <div className="flex justify-between items-center bg-emerald-50/40 p-1.5 rounded-lg border border-emerald-100/30">
                                <span className="font-medium text-emerald-900">Luas Panen Efektif:</span>
                                <span className="font-bold text-emerald-950">{formattedEffectiveArea} Ha</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Rata-rata Produktivitas:</span>
                                <span className="font-bold text-zinc-900">{productivity} Ton/Ha</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                             <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Estimasi Hasil:</span>
                            <span className="text-xl font-black text-emerald-950 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-950/5">
                              {formattedHarvest} Ton
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-xl bg-white/70 border border-emerald-950/5 p-4 text-xs leading-6 text-emerald-900/80">
                    <p className="font-semibold text-emerald-950">Catatan Rumus & Koefisien:</p>
                    <p className="mt-1">
                      Estimasi Hasil Panen (Ton) = Luas Lahan Kategori (Ha) &times; Faktor Koreksi Lahan &times; Produktivitas Komoditas (Ton/Ha).
                    </p>
                    <p className="mt-2">
                      * <strong>Faktor Koreksi Lahan</strong> disesuaikan berdasarkan laporan perhitungan standar:
                    </p>
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      <li><strong>Sawah (Padi 90%)</strong>: Dikurangi 10% untuk pematang/galengan sawah sesuai metodologi BPS.</li>
                      <li><strong>Tegalan (Jagung 40%, Timun 20%)</strong>: Disesuaikan dengan porsi riil pembagian jenis tanaman di lapangan.</li>
                      <li><strong>Pekarangan (Cabai 5%)</strong>: Pekarangan didominasi rumah tinggal, sehingga diasumsikan hanya 5% luas lahan pekarangan yang dimanfaatkan aktif untuk budidaya cabai.</li>
                      <li><strong>Komoditas Lainnya</strong>: Faktor koreksi disesuaikan berdasarkan nilai porsi tanam yang ditentukan oleh administrator di panel admin.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 space-y-8 border-t border-zinc-100 pt-8">
            {item.sections
              .filter((section) => !(item.slug === "tutupan-lahan" && section.heading === "Distribusi Pemanfaatan Lahan"))
              .map((section) => (
                <div key={section.heading}>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {section.heading}
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {section.body.map((paragraph, index) => (
                      <li
                        key={index}
                        className="flex gap-2.5 text-sm leading-7 text-zinc-600"
                      >
                        <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-emerald-600" />
                        <span>{paragraph}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
