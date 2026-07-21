"use client";

import { useEffect } from "react";
import ModalPortal from "@/components/ModalPortal";
import type { AdminProfile } from "@/lib/admin-firestore";

type DeletePenggunaModalProps = {
  admin: AdminProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isDeleting?: boolean;
};

export default function DeletePenggunaModal({
  admin,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeletePenggunaModalProps) {
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

  if (!isOpen || !admin) {
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
          disabled={isDeleting}
        />

        <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-8 py-6">
            <div className="space-y-2">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-rose-600">
                Hapus Hak Akses
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                Hapus profil admin ini?
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-50 cursor-pointer"
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

          <div className="space-y-5 px-8 py-7">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Nama Pengguna
                </p>
                <p className="mt-1 text-base font-semibold text-zinc-950">{admin.name}</p>
              </div>

              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Email & Peran
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-700">{admin.email}</span>
                  <span
                    className={`inline-block text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full ${
                      admin.role === "Super Admin"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {admin.role}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-7 text-zinc-600">
              Tindakan ini akan menghapus profil admin{" "}
              <span className="font-semibold text-zinc-950">{admin.name}</span> dan menonaktifkan hak aksesnya ke panel admin. Data yang dihapus tidak dapat dikembalikan.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-8 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => onConfirm(admin.uid)}
              disabled={isDeleting}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-rose-600 px-6 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? "Menghapus..." : "Hapus Akses"}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
