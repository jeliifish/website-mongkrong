"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import type { KontakInfo, PesanMasuk } from "@/types/kontak";
import {
  fetchKontakInfo,
  updateKontakInfo,
  fetchPesanMasuk,
  deletePesan,
  fallbackKontakInfo,
} from "@/lib/kontak-firestore";

export default function AdminKontakPage() {
  // ─── Kontak Info ──────────────────────────────────
  const [kontakInfo, setKontakInfo] = useState<KontakInfo>(fallbackKontakInfo);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);

  // ─── Pesan Masuk ──────────────────────────────────
  const [pesanList, setPesanList] = useState<PesanMasuk[]>([]);
  const [isLoadingPesan, setIsLoadingPesan] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [info, pesan] = await Promise.all([
        fetchKontakInfo(),
        fetchPesanMasuk(),
      ]);
      setKontakInfo(info);
      setPesanList(pesan);
      setIsLoadingPesan(false);
    };
    void load();
  }, []);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    setInfoSaved(false);
    try {
      await updateKontakInfo(kontakInfo);
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 3000);
    } catch (err) {
      console.error("Gagal menyimpan info kontak:", err);
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleDeletePesan = async (id: string) => {
    setDeletingId(id);
  };

  const confirmDeletePesan = async () => {
    if (!deletingId) return;
    try {
      await deletePesan(deletingId);
      setPesanList((prev) => prev.filter((p) => p.id !== deletingId));
    } catch (err) {
      console.error("Gagal menghapus pesan:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminShell>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Hubungi Kami &amp; Pesan Masuk
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kelola informasi alamat/kontak resmi padukuhan dan tinjau pesan masuk
          dari formulir kontak publik.
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[380px_1fr]">
        {/* Left Column — Edit Info Kontak */}
        <form
          onSubmit={handleSaveInfo}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm self-start"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-900">
              Info Kontak Balai
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Alamat Lengkap Balai
              </label>
              <textarea
                rows={4}
                value={kontakInfo.alamat}
                onChange={(e) =>
                  setKontakInfo((prev) => ({ ...prev, alamat: e.target.value }))
                }
                className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Nomor WhatsApp/Telepon
                <span className="ml-1 normal-case tracking-normal text-zinc-400">
                  (gunakan format angka e.g. 62812...)
                </span>
              </label>
              <input
                type="text"
                value={kontakInfo.telepon}
                onChange={(e) =>
                  setKontakInfo((prev) => ({ ...prev, telepon: e.target.value }))
                }
                placeholder="6281234567890"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Surel / Email Resmi
              </label>
              <input
                type="email"
                value={kontakInfo.email}
                onChange={(e) =>
                  setKontakInfo((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="info@mongkrong.desa.id"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingInfo}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {isSavingInfo ? "Menyimpan..." : "Simpan Info Kontak"}
          </button>

          {infoSaved && (
            <p className="mt-3 text-center text-sm text-emerald-600 font-medium">
              ✓ Berhasil disimpan!
            </p>
          )}
        </form>

        {/* Right Column — Pesan Masuk */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-900">
              Kotak Masuk Pesan ({pesanList.length})
            </h2>
          </div>

          {isLoadingPesan ? (
            <p className="mt-6 text-center text-sm text-zinc-400">
              Memuat pesan...
            </p>
          ) : pesanList.length === 0 ? (
            <p className="mt-6 text-center text-sm italic text-zinc-400">
              Kotak masuk kosong. Belum ada pesan dari warga.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left">
                    <th className="pb-3 pr-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Pengirim
                    </th>
                    <th className="pb-3 pr-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Subjek
                    </th>
                    <th className="pb-3 pr-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Tanggal Masuk
                    </th>
                    <th className="pb-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {pesanList.map((p) => (
                    <tr key={p.id} className="group">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-zinc-900">{p.nama}</p>
                        {p.email && (
                          <p className="text-xs text-zinc-400">{p.email}</p>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-zinc-600">
                        {p.subjek || "—"}
                      </td>
                      <td className="py-3 pr-4 text-zinc-500 whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(expandedId === p.id ? null : p.id)
                            }
                            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-emerald-300 hover:text-emerald-700"
                          >
                            {expandedId === p.id ? "Tutup" : "Baca"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePesan(p.id)}
                            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-rose-500 transition hover:border-rose-300 hover:bg-rose-50"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Expanded message view */}
              {expandedId && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Isi Pesan
                  </p>
                  <p className="mt-2 text-sm leading-7 text-zinc-700 whitespace-pre-wrap">
                    {pesanList.find((p) => p.id === expandedId)?.pesan || ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-6 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Tutup modal"
            className="absolute inset-0 cursor-default"
            onClick={() => setDeletingId(null)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-8 py-6">
              <div className="space-y-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-rose-600">
                  Hapus Pesan
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  Hapus pesan ini?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900"
              >
                <span className="sr-only">Tutup</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6 18 18" />
                  <path d="M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="px-8 py-7">
              <p className="text-sm leading-7 text-zinc-600">
                Tindakan ini akan menghapus pesan secara permanen dari kotak masuk. Pastikan pesan ini memang sudah tidak diperlukan.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-8 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeletePesan}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-rose-600 px-6 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Hapus Pesan
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
