"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Button from "@/components/Button";

type NewUmkm = {
  name: string;
  owner: string;
  description?: string;
  address?: string;
  phone?: string;
  file: File | null;
  mapUrl?: string;
};

type AddUmkmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (umkm: NewUmkm) => void;
};

export default function AddUmkmModal({
  isOpen,
  onClose,
  onSave,
}: AddUmkmModalProps) {
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

      <AddUmkmForm onClose={onClose} onSave={onSave} />
    </div>
  );
}

function AddUmkmForm({ onClose, onSave }: Omit<AddUmkmModalProps, "isOpen">) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("628");
  const [mapUrl, setMapUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !owner.trim()) {
      return;
    }

    onSave({
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
      <div className="flex items-center justify-between border-b border-zinc-200 px-8 py-6">
        <h2 className="text-xl font-bold text-zinc-950">
          Tambah Profil UMKM Baru
        </h2>
        <CloseButton onClick={onClose} />
      </div>

      <div className="max-h-[65vh] overflow-y-auto space-y-5 px-8 py-7">
        {/* Row 1: Nama Usaha & Nama Pemilik */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="NAMA USAHA / MEREK">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contoh: Kripik Tempe J"
              required
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
            />
          </Field>

          <Field label="NAMA PEMILIK">
            <input
              type="text"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              placeholder="Contoh: Ibu Marni"
              required
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
            />
          </Field>
        </div>

        {/* Row 2: No Whatsapp & Unggah Banner */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="NO. WHATSAPP (GUNAKAN 62)">
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Contoh: 628..."
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
            />
          </Field>

          <div className="space-y-2">
            <span className="block text-[0.72rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
              UNGGAH BANNER USAHA
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 cursor-pointer"
              >
                Choose File
              </button>
              <span className="text-xs text-zinc-500 truncate max-w-[200px]">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* Alamat Lengkap */}
        <Field label="ALAMAT LENGKAP USAHA">
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Contoh: RT 01 / RW 02, Padukuhan Mongkrong"
            className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </Field>

        {/* Link Google Maps */}
        <Field label="LINK GOOGLE MAPS (URL IFRAME EMBED SRC)">
          <input
            type="text"
            value={mapUrl}
            onChange={(event) => setMapUrl(event.target.value)}
            placeholder="Contoh: https://www.google.com/maps/embed?pb=..."
            className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </Field>

        {/* Deskripsi Ringkas */}
        <Field label="DESKRIPSI RINGKAS">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ceritakan sejarah singkat atau jenis produk kuliner/kerajinan dari usaha ini..."
            rows={3}
            className="w-full rounded-xl border border-zinc-200 p-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 resize-none"
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-8 py-5 sm:flex-row sm:justify-end">
        <CancelButton onClick={onClose} />
        <Button type="submit" className="h-12 px-8 shadow-none hover:translate-y-0 cursor-pointer">
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-[0.72rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
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
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600 cursor-pointer"
    >
      <span className="sr-only">Tutup</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
      className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 px-6 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-50 cursor-pointer"
    >
      Batal
    </button>
  );
}
