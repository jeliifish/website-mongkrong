"use client";

import { useEffect } from "react";
import ModalPortal from "@/components/ModalPortal";
import type { CustomStatistikItem } from "@/types/statistik";

type DeleteCustomStatistikModalProps = {
  item: CustomStatistikItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
};

export default function DeleteCustomStatistikModal({
  item,
  isOpen,
  onClose,
  onConfirm,
}: DeleteCustomStatistikModalProps) {
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

      <div className="relative z-10 w-full max-w-lg overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] rounded-2xl">
        <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-8 py-6">
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-rose-600">
              Hapus Statistik
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Hapus statistik ini?
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

        <div className="space-y-5 px-8 py-7">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Kategori
            </p>
            <p className="mt-2 text-base font-semibold text-zinc-950">{item.label}</p>
          </div>

          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Keterangan / Detail
            </p>
            <p className="mt-2 text-base text-zinc-700">{item.value}</p>
          </div>

          <p className="text-sm leading-7 text-zinc-600">
            Tindakan ini akan menghapus data statistik tambahan ini secara permanen. Pastikan data yang dipilih memang ingin dihapus.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-8 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 rounded-lg"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(item.id);
              onClose();
            }}
            className="inline-flex h-12 items-center justify-center bg-rose-600 px-6 text-sm font-semibold text-white transition hover:bg-rose-700 rounded-lg"
          >
            Hapus Statistik
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
