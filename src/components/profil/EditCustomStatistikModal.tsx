"use client";

import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import ModalPortal from "@/components/ModalPortal";
import type { CustomStatistikItem } from "@/types/statistik";

type EditCustomStatistikModalProps = {
  item: CustomStatistikItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, label: string, value: string) => void;
};

export default function EditCustomStatistikModal({
  item,
  isOpen,
  onClose,
  onSave,
}: EditCustomStatistikModalProps) {
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
        <EditForm item={item} onClose={onClose} onSave={onSave} />
      </div>
    </ModalPortal>
  );
}

function EditForm({
  item,
  onClose,
  onSave,
}: {
  item: CustomStatistikItem;
  onClose: () => void;
  onSave: (id: string, label: string, value: string) => void;
}) {
  const [label, setLabel] = useState(item.label);
  const [value, setValue] = useState(item.value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!label.trim() || !value.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(item.id, label.trim(), value.trim());
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
      className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] rounded-2xl"
    >
      <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-8 py-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Kelola Statistik
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Edit Statistik Tambahan
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

      <div className="space-y-6 px-8 py-7">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <label className="block space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Kategori
          </span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
            placeholder="Contoh: Jumlah Ternak Sapi"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Keterangan / Detail
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 rounded-lg"
            placeholder="Contoh: 145 Ekor"
            required
          />
        </label>
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
