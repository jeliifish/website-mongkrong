"use client";

import { useEffect } from "react";
import ModalPortal from "@/components/ModalPortal";
import type { GaleriItem } from "@/types/galeri";

type DetailGaleriModalProps = {
  galeri: GaleriItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function DetailGaleriModal({
  galeri,
  isOpen,
  onClose,
}: DetailGaleriModalProps) {
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

  if (!isOpen || !galeri) {
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

      <div className="relative z-10 w-full max-w-4xl overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="grid lg:grid-cols-[minmax(0,1.35fr)_22rem]">
          <div
            className="min-h-[22rem] bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center"
            style={galeri.imageUrl ? { backgroundImage: `url(${galeri.imageUrl})` } : undefined}
          />

          <div className="flex flex-col border-t border-zinc-200 lg:border-l lg:border-t-0">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-7 py-6">
              <div className="space-y-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Detail Galeri
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {galeri.title}
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

            <div className="flex-1 space-y-6 px-7 py-6">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Jumlah Foto
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900">{galeri.photos}</p>
              </div>

              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Update Terakhir
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900">{galeri.updated}</p>
              </div>

              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Nama File
                </p>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  {galeri.fileName ?? "Foto dokumentasi galeri desa"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
