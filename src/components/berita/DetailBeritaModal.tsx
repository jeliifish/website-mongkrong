"use client";

import { useEffect } from "react";
import type { BeritaItem } from "@/types/berita";
import ModalPortal from "@/components/ModalPortal";

type DetailBeritaModalProps = {
  berita: BeritaItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function DetailBeritaModal({
  berita,
  isOpen,
  onClose,
}: DetailBeritaModalProps) {
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

  const visibleContent = berita.content.filter(
    (paragraph) => paragraph.trim().length > 0 && !isDuplicateSummary(paragraph, berita.description),
  );

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 sm:p-6 backdrop-blur-sm">
        <button
          type="button"
          aria-label="Tutup modal"
          className="fixed inset-0 cursor-default"
          onClick={onClose}
        />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="border-b border-zinc-200 px-8 py-6">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                  {berita.category}
                </span>
                <span className="text-zinc-400">&middot;</span>
                <span className="text-zinc-500">{berita.date}</span>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                  {berita.title}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-zinc-600">
                  {berita.description}
                </p>
              </div>
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

        <div
          className={`px-8 py-7 max-h-[60vh] overflow-y-auto ${
            visibleContent.length > 0
              ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]"
              : "border-t border-zinc-200"
          }`}
        >
          <div className="space-y-5">
            {berita.imageUrl && (
              <div
                className="h-64 rounded-2xl bg-cover bg-center mb-6"
                style={{ backgroundImage: `url(${berita.imageUrl})` }}
              />
            )}
            {visibleContent.length > 0 && (
              <div className="space-y-5">
                {visibleContent.map((paragraph, index) => (
                  <p
                    key={`${berita.title}-paragraph-${index}`}
                    className="text-[1.02rem] leading-8 text-zinc-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          <aside
            className={`grid gap-5 h-fit ${
              visibleContent.length > 0
                ? "border-t border-zinc-200 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0"
                : "sm:grid-cols-2"
            }`}
          >
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Penulis
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{berita.author}</p>
            </div>

            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Tanggal Publikasi
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{berita.date}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}

function isDuplicateSummary(content: string, description: string) {
  return normalizeText(content) === normalizeText(description);
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}
