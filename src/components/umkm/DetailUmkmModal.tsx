"use client";

import { useEffect } from "react";

type UmkmDetail = {
  id: string;
  name: string;
  owner: string;
  imageUrl?: string;
  fileName?: string;
};

type DetailUmkmModalProps = {
  umkm: UmkmDetail | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function DetailUmkmModal({
  umkm,
  isOpen,
  onClose,
}: DetailUmkmModalProps) {
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

  if (!isOpen || !umkm) {
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

      <div className="relative z-10 w-full max-w-3xl overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-8 py-6">
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Detail UMKM
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
              {umkm.name}
            </h2>
          </div>

          <CloseButton onClick={onClose} />
        </div>

        <div className="grid gap-8 px-8 py-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div
            className="h-56 rounded-[1.5rem] bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center"
            style={umkm.imageUrl ? { backgroundImage: `url(${umkm.imageUrl})` } : undefined}
          />

          <div className="space-y-6">
            <InfoBlock label="Nama Usaha" value={umkm.name} />
            <InfoBlock label="Pemilik" value={umkm.owner} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-base font-medium text-zinc-900">{value}</p>
    </div>
  );
}
