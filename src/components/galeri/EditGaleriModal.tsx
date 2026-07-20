"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import Button from "@/components/Button";
import ModalPortal from "@/components/ModalPortal";
import type { GaleriItem } from "@/types/galeri";

type EditGaleriModalProps = {
  galeri: GaleriItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (galeri: { id: string; title: string; file?: File | null }) => void;
};

export default function EditGaleriModal({
  galeri,
  isOpen,
  onClose,
  onSave,
}: EditGaleriModalProps) {
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

        <EditGaleriForm key={galeri.id} galeri={galeri} onClose={onClose} onSave={onSave} />
      </div>
    </ModalPortal>
  );
}

type EditGaleriFormProps = {
  galeri: GaleriItem;
  onClose: () => void;
  onSave: (galeri: { id: string; title: string; file?: File | null }) => void;
};

function EditGaleriForm({ galeri, onClose, onSave }: EditGaleriFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(galeri.title);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onSave({
      id: galeri.id,
      title: title.trim(),
      file: selectedFile,
    });
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-8 py-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Edit Galeri
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Perbarui data foto
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
        <label className="block space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Judul Gambar
          </span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </label>

        <div className="space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Ganti Foto
          </span>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-36 w-full items-center gap-5 border border-dashed border-zinc-300 bg-zinc-50 px-5 py-5 text-left transition hover:border-emerald-400 hover:bg-emerald-50/40"
          >
            <div
              className="h-20 w-20 shrink-0 rounded-2xl bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center"
              style={galeri.imageUrl ? { backgroundImage: `url(${galeri.imageUrl})` } : undefined}
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900">
                {selectedFile ? selectedFile.name : "Pilih foto pengganti"}
              </p>
              <p className="text-xs text-zinc-500">
                {selectedFile
                  ? "File baru akan menggantikan foto saat ini"
                  : galeri.fileName ?? "Gunakan JPG, PNG, atau WEBP"}
              </p>
            </div>
          </button>
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
        <Button type="submit" className="h-12 px-8 shadow-none hover:translate-y-0">
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
