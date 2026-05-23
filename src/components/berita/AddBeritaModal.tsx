"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";

type NewBerita = {
  title: string;
  description: string;
  date: string;
};

type AddBeritaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (berita: NewBerita) => void;
};

type FormState = {
  title: string;
  description: string;
  date: string;
};

const todayFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function AddBeritaModal({
  isOpen,
  onClose,
  onSave,
}: AddBeritaModalProps) {
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

      <AddBeritaForm onClose={onClose} onSave={onSave} />
    </div>
  );
}

function AddBeritaForm({
  onClose,
  onSave,
}: Omit<AddBeritaModalProps, "isOpen">) {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    date: todayFormatter.format(new Date()),
  });

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date.trim(),
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
            Tulis Berita
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Tambah berita baru
          </h2>
          <p className="text-sm leading-7 text-zinc-600">
            Isi judul, deskripsi, dan tanggal berita sebelum dipublikasikan.
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
              placeholder="Masukkan judul berita"
              className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
            />
          </Field>

          <Field label="Deskripsi Berita">
            <textarea
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              placeholder="Tulis deskripsi singkat berita"
              rows={6}
              className="w-full resize-none border border-zinc-200 px-4 py-3 text-sm leading-7 text-zinc-800 outline-none transition focus:border-emerald-500"
            />
          </Field>

          <Field label="Tanggal Berita">
            <DatePicker
              value={form.date}
              onChange={(value) => handleChange("date", value)}
            />
          </Field>
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
          Simpan Berita
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
