"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import type { BeritaItem } from "@/types/berita";

type EditBeritaModalProps = {
  berita: BeritaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (berita: BeritaItem & { file?: File | null }) => void;
};

type FormState = {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
};

export default function EditBeritaModal({
  berita,
  isOpen,
  onClose,
  onSave,
}: EditBeritaModalProps) {
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

      <EditBeritaForm key={berita.id} berita={berita} onClose={onClose} onSave={onSave} />
    </div>
  );
}

type EditBeritaFormProps = {
  berita: BeritaItem;
  onClose: () => void;
  onSave: (berita: BeritaItem & { file?: File | null }) => void;
};

function EditBeritaForm({ berita, onClose, onSave }: EditBeritaFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>({
    title: berita.title,
    description: berita.description,
    date: berita.date,
    author: berita.author,
    category: berita.category,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      return;
    }

    const trimmedDescription = form.description.trim();

    onSave({
      ...berita,
      title: form.title.trim(),
      description: trimmedDescription,
      date: form.date.trim(),
      author: form.author.trim() || "Admin Desa",
      category: form.category.trim() || "Informasi Desa",
      content: trimmedDescription ? [trimmedDescription] : [],
      file: selectedFile,
    });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-8 py-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Edit Berita
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Perbarui data berita
          </h2>
          <p className="text-sm leading-7 text-zinc-600">
            Ubah judul, deskripsi, tanggal, penulis, dan foto utama berita.
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

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="mx-auto max-w-3xl space-y-6">
          <Field label="Judul Berita">
            <input
              type="text"
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Penulis (Author)">
              <input
                type="text"
                value={form.author}
                onChange={(event) => handleChange("author", event.target.value)}
                placeholder="Masukkan nama penulis/lembaga"
                className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
              />
            </Field>

            <Field label="Kategori Berita">
              <select
                value={form.category}
                onChange={(event) => handleChange("category", event.target.value)}
                className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 bg-white outline-none transition focus:border-emerald-500"
              >
                <option value="Informasi Desa">Informasi Desa</option>
                <option value="Kegiatan Warga">Kegiatan Warga</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="UMKM">UMKM</option>
                <option value="Pendidikan">Pendidikan</option>
              </select>
            </Field>
          </div>

          <Field label="Deskripsi & Isi Berita">
            <textarea
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              rows={8}
              className="w-full resize-none border border-zinc-200 px-4 py-3 text-sm leading-7 text-zinc-800 outline-none transition focus:border-emerald-500"
            />
          </Field>

          <Field label="Tanggal Berita">
            <DatePicker
              value={form.date}
              onChange={(value) => handleChange("date", value)}
            />
          </Field>

          <div className="space-y-2">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Foto Utama Berita
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
              className="flex min-h-32 w-full items-center gap-5 border border-dashed border-zinc-300 bg-zinc-50 px-5 py-5 text-left transition hover:border-emerald-400 hover:bg-emerald-50/40"
            >
              <div
                className="h-20 w-20 shrink-0 rounded-2xl bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center"
                style={berita.imageUrl ? { backgroundImage: `url(${berita.imageUrl})` } : undefined}
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-900">
                  {selectedFile ? selectedFile.name : "Pilih foto pengganti"}
                </p>
                <p className="text-xs text-zinc-500">
                  {selectedFile
                    ? "File baru akan menggantikan foto saat ini"
                    : berita.fileName ?? "Belum ada foto berita"}
                </p>
              </div>
            </button>
          </div>
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

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}
