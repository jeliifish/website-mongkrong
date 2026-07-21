"use client";

import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import ModalPortal from "@/components/ModalPortal";
import type { StatistikItem } from "@/types/statistik";

type EditStatistikModalProps = {
  item: StatistikItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: StatistikItem) => void;
};

export default function EditStatistikModal({
  item,
  isOpen,
  onClose,
  onSave,
}: EditStatistikModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) {
    return null;
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 sm:p-6 backdrop-blur-sm">
        <button
          type="button"
          aria-label="Tutup modal"
          className="fixed inset-0 cursor-default"
          onClick={onClose}
        />
        <EditStatistikForm key={item.id} item={item} onClose={onClose} onSave={onSave} />
      </div>
    </ModalPortal>
  );
}

function EditStatistikForm({
  item,
  onClose,
  onSave,
}: {
  item: StatistikItem;
  onClose: () => void;
  onSave: (item: StatistikItem) => void;
}) {
  const [jumlahPenduduk, setJumlahPenduduk] = useState(item.jumlahPenduduk);
  const [jumlahKK, setJumlahKK] = useState(item.jumlahKK);
  const [luasWilayah, setLuasWilayah] = useState(item.luasWilayah);
  const [jumlahRT, setJumlahRT] = useState(item.jumlahRT);
  const [batasUtara, setBatasUtara] = useState(item.batasUtara);
  const [batasSelatan, setBatasSelatan] = useState(item.batasSelatan);
  const [batasBarat, setBatasBarat] = useState(item.batasBarat);
  const [batasTimur, setBatasTimur] = useState(item.batasTimur);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      onSave({
        id: item.id,
        jumlahPenduduk,
        jumlahKK,
        luasWilayah,
        jumlahRT,
        batasUtara,
        batasSelatan,
        batasBarat,
        batasTimur,
      });
      onClose();
    } catch (err) {
      setError("Gagal menyimpan perubahan. Cek koneksi Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] rounded-2xl"
    >
      <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-8 py-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Kelola Profil
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Edit Statistik Padukuhan
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900"
        >
          <span className="sr-only">Tutup</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M6 6 18 18" />
            <path d="M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto space-y-6 px-8 py-7">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Jumlah Penduduk
            </span>
            <input
              type="text"
              value={jumlahPenduduk}
              onChange={(e) => setJumlahPenduduk(e.target.value)}
              className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
              placeholder="Contoh: 594 Jiwa"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Jumlah KK
            </span>
            <input
              type="text"
              value={jumlahKK}
              onChange={(e) => setJumlahKK(e.target.value)}
              className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
              placeholder="Contoh: 183 KK"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Luas Wilayah
            </span>
            <input
              type="text"
              value={luasWilayah}
              onChange={(e) => setLuasWilayah(e.target.value)}
              className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
              placeholder="Contoh: 112,1 Ha"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Jumlah RT
            </span>
            <input
              type="text"
              value={jumlahRT}
              onChange={(e) => setJumlahRT(e.target.value)}
              className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
              placeholder="Contoh: 4 RT"
              required
            />
          </label>
        </div>

        <div className="border-t border-zinc-100 pt-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-700">Batas Wilayah</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Batas Utara
              </span>
              <input
                type="text"
                value={batasUtara}
                onChange={(e) => setBatasUtara(e.target.value)}
                className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
                placeholder="Contoh: Sengon kerep dan Kayen"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Batas Timur
              </span>
              <input
                type="text"
                value={batasTimur}
                onChange={(e) => setBatasTimur(e.target.value)}
                className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
                placeholder="Contoh: Sidomulyo"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Batas Selatan
              </span>
              <input
                type="text"
                value={batasSelatan}
                onChange={(e) => setBatasSelatan(e.target.value)}
                className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
                placeholder="Contoh: Desa Terbah"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Batas Barat
              </span>
              <input
                type="text"
                value={batasBarat}
                onChange={(e) => setBatasBarat(e.target.value)}
                className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
                placeholder="Contoh: Desa Serut"
                required
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-8 py-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 items-center justify-center border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 rounded-lg"
        >
          Batal
        </button>
        <Button type="submit" disabled={isSubmitting} className="h-12 px-8 shadow-none hover:translate-y-0 rounded-lg">
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
