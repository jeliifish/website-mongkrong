"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import Button from "@/components/Button";
import type { UmkmItem } from "@/types/umkm";

type EditUmkmModalProps = {
  umkm: UmkmItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (umkm: UmkmItem & { file?: File | null }) => void;
};

export default function EditUmkmModal({
  umkm,
  isOpen,
  onClose,
  onSave,
}: EditUmkmModalProps) {
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

      <EditUmkmForm key={umkm.id} umkm={umkm} onClose={onClose} onSave={onSave} />
    </div>
  );
}

function EditUmkmForm({
  umkm,
  onClose,
  onSave,
}: {
  umkm: UmkmItem;
  onClose: () => void;
  onSave: (umkm: UmkmItem & { file?: File | null }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(umkm.name);
  const [owner, setOwner] = useState(umkm.owner);
  const [description, setDescription] = useState(umkm.description ?? "");
  const [address, setAddress] = useState(umkm.address ?? "");
  const [phone, setPhone] = useState(umkm.phone ?? "");
  const [mapUrl, setMapUrl] = useState(umkm.mapUrl ?? "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !owner.trim()) {
      return;
    }

    onSave({
      ...umkm,
      name: name.trim(),
      owner: owner.trim(),
      description: description.trim() || undefined,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      file: selectedFile,
      mapUrl: mapUrl.trim() || undefined,
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
            Edit UMKM
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Perbarui data usaha
          </h2>
        </div>

        <CloseButton onClick={onClose} />
      </div>

      <div className="max-h-[60vh] overflow-y-auto space-y-6 px-8 py-7">
        <Field label="Nama Usaha">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </Field>

        <Field label="Pemilik">
          <input
            type="text"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </Field>

        <Field label="Deskripsi Usaha">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Masukkan deskripsi usaha atau produk yang dijual"
            rows={3}
            className="w-full border border-zinc-200 p-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 resize-none"
          />
        </Field>

        <Field label="Alamat Usaha">
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Contoh: RT 02/RW 03, Dusun Mongkrong"
            className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </Field>

        <Field label="No. WhatsApp">
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Contoh: 08123456789"
            className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </Field>

        <Field label="Link Google Maps Usaha (Opsional)">
          <input
            type="text"
            value={mapUrl}
            onChange={(event) => setMapUrl(event.target.value)}
            placeholder="Pesan link Share, koordinat (-7.84,110.51), atau Link Semat"
            className="h-12 w-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </Field>

        <div className="space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Foto UMKM
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
              style={umkm.imageUrl ? { backgroundImage: `url(${umkm.imageUrl})` } : undefined}
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900">
                {selectedFile ? selectedFile.name : "Pilih foto pengganti"}
              </p>
              <p className="text-xs text-zinc-500">
                {selectedFile
                  ? "File baru akan menggantikan foto saat ini"
                  : umkm.fileName ?? "Belum ada foto usaha"}
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-8 py-5 sm:flex-row sm:justify-end">
        <CancelButton onClick={onClose} />
        <Button type="submit" className="h-12 px-8 shadow-none hover:translate-y-0">
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>
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

function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950"
    >
      Batal
    </button>
  );
}
