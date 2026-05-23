"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import Button from "@/components/Button";

type NewGaleri = {
  title: string;
  file: File;
};

type AddGaleriModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (galeri: NewGaleri) => void;
};

export default function AddGaleriModal({
  isOpen,
  onClose,
  onSave,
}: AddGaleriModalProps) {
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

  if (!isOpen) {
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

      <AddGaleriForm onClose={onClose} onSave={onSave} />
    </div>
  );
}

function AddGaleriForm({
  onClose,
  onSave,
}: Omit<AddGaleriModalProps, "isOpen">) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !selectedFile) {
      return;
    }

    onSave({
      title: title.trim(),
      file: selectedFile,
    });
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-8 py-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Tambah Galeri
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Upload foto baru
          </h2>
          <p className="text-sm leading-7 text-zinc-600">
            Isi judul gambar lalu pilih file foto yang akan dimasukkan ke galeri.
          </p>
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
            placeholder="Masukkan judul gambar"
            className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </label>

        <div className="space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Upload Foto
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
            className="flex min-h-36 w-full flex-col items-center justify-center gap-3 border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 16V5" />
                <path d="m7 10 5-5 5 5" />
                <path d="M5 19h14" />
              </svg>
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900">
                {selectedFile ? selectedFile.name : "Pilih file foto"}
              </p>
              <p className="text-xs text-zinc-500">
                Format JPG, PNG, atau WEBP
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
        <Button
          type="submit"
          className="h-12 px-8 shadow-none hover:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!title.trim() || !selectedFile}
        >
          Simpan Foto
        </Button>
      </div>
    </form>
  );
}
