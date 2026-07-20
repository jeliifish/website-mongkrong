"use client";

import { useEffect } from "react";
import ModalPortal from "@/components/ModalPortal";
import type { PesanMasuk } from "@/types/kontak";

type DetailPesanModalProps = {
  pesan: PesanMasuk | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
};

export default function DetailPesanModal({
  pesan,
  isOpen,
  onClose,
  onDelete,
}: DetailPesanModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pesan) return null;

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const initial = pesan.nama ? pesan.nama.trim().charAt(0).toUpperCase() : "P";

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 sm:p-6 backdrop-blur-sm">
        <button
          type="button"
          aria-label="Tutup modal"
          className="fixed inset-0 cursor-default"
          onClick={onClose}
        />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-950">Detail Pesan Masuk</h2>
              <p className="text-xs text-zinc-500">Pesan dari pengunjung / warga desa</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-700 hover:bg-zinc-50"
          >
            <span className="sr-only">Tutup</span>
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6 18 18" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[65vh] overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Sender Info Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-zinc-50/80 p-4 border border-zinc-100">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-base shadow-sm">
                {initial}
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">{pesan.nama}</p>
                {pesan.email ? (
                  <a
                    href={`mailto:${pesan.email}`}
                    className="text-xs text-emerald-700 hover:underline font-medium"
                  >
                    {pesan.email}
                  </a>
                ) : (
                  <p className="text-xs text-zinc-400">Tidak ada email</p>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block text-[0.68rem] font-semibold uppercase tracking-wider text-zinc-400">
                Waktu Terkirim
              </span>
              <p className="text-xs font-semibold text-zinc-700 mt-0.5">
                {formatDate(pesan.createdAt)}
              </p>
            </div>
          </div>

          {/* Subjek */}
          <div>
            <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-zinc-400">
              Subjek Pesan
            </span>
            <h3 className="mt-1 text-base font-bold text-zinc-900">
              {pesan.subjek || "(Tanpa Subjek)"}
            </h3>
          </div>

          {/* Isi Pesan */}
          <div>
            <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-emerald-700">
              Isi Pesan
            </span>
            <div className="mt-2 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap">
              {pesan.pesan}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-100 px-6 py-4 sm:px-8 bg-zinc-50/50">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(pesan.id);
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Pesan Ini
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
