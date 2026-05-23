"use client";

import { useEffect } from "react";

type DeleteBerita = {
  id: string;
  title: string;
  date: string;
};

type DeleteBeritaModalProps = {
  berita: DeleteBerita | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
};

export default function DeleteBeritaModal({
  berita,
  isOpen,
  onClose,
  onConfirm,
}: DeleteBeritaModalProps) {
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

  if (!isOpen || !berita) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-6 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Tutup modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="border-b border-zinc-200 px-8 py-6">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-rose-600">
                Hapus Berita
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                Yakin ingin menghapus berita ini?
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
        </div>

        <div className="space-y-5 px-8 py-7">
          <p className="text-sm leading-7 text-zinc-600">
            Tindakan ini akan menghapus berita dari daftar admin. Pastikan data berikut
            memang ingin dihapus.
          </p>

          <div className="border border-zinc-200 bg-zinc-50 px-5 py-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Judul Berita
            </p>
            <p className="mt-2 text-base font-semibold text-zinc-950">{berita.title}</p>
            <p className="mt-1 text-sm text-zinc-500">{berita.date}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-8 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(berita.id);
              onClose();
            }}
            className="inline-flex h-12 items-center justify-center bg-rose-600 px-6 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Hapus Berita
          </button>
        </div>
      </div>
    </div>
  );
}
