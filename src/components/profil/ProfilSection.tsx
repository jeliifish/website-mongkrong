"use client";

import { useEffect, useState } from "react";

import EditProfilModal from "@/components/profil/EditProfilModal";
import EditStatistikModal from "@/components/profil/EditStatistikModal";
import EditCustomStatistikModal from "@/components/profil/EditCustomStatistikModal";
import DeleteCustomStatistikModal from "@/components/profil/DeleteCustomStatistikModal";
import { fetchStatistik, updateStatistik } from "@/lib/statistik-firestore";
import {
  fetchProfilItems,
  updateProfilItem,
  fetchLogoConfig,
  updateLogoConfig,
  deleteLogoConfig,
  type ProfilItem,
  type LogoConfig,
} from "@/lib/profil-firestore";
import { isCloudinaryConfigured, uploadImageToCloudinary } from "@/lib/cloudinary-upload";
import type { StatistikItem, CustomStatistikItem } from "@/types/statistik";

type ProfilSectionProps = {
  items: ProfilItem[];
};

export default function ProfilSection({ items }: ProfilSectionProps) {
  const [sections, setSections] = useState<ProfilItem[]>([]);
  const [editingItem, setEditingItem] = useState<ProfilItem | null>(null);
  const [statistik, setStatistik] = useState<StatistikItem | null>(null);
  const [isEditingStatistik, setIsEditingStatistik] = useState(false);
  const [logoConfig, setLogoConfig] = useState<LogoConfig | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoMessage, setLogoMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [profilData, statData, logoData] = await Promise.all([
        fetchProfilItems(),
        fetchStatistik(),
        fetchLogoConfig(),
      ]);
      setSections(profilData);
      setStatistik(statData);
      setLogoConfig(logoData);
    };
    void loadData();
  }, []);

  const readFileAsDataUrl = (file: File): Promise<LogoConfig> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          imageUrl: reader.result as string,
          fileName: file.name,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setLogoMessage("");

    try {
      let config: LogoConfig;
      if (isCloudinaryConfigured("galeri")) {
        try {
          const res = await uploadImageToCloudinary(file, "galeri");
          config = {
            imageUrl: res.imageUrl,
            imagePublicId: res.imagePublicId,
            fileName: res.fileName || file.name,
          };
        } catch (err) {
          console.warn("Cloudinary upload failed, using Data URL fallback:", err);
          config = await readFileAsDataUrl(file);
        }
      } else {
        config = await readFileAsDataUrl(file);
      }

      await updateLogoConfig(config);
      setLogoConfig(config);
      setLogoMessage("Logo berhasil diperbarui!");
      setTimeout(() => setLogoMessage(""), 3500);
    } catch (err) {
      console.error("Gagal mengunggah logo:", err);
      setLogoMessage("Gagal mengunggah logo.");
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleDeleteLogo = async () => {
    setIsUploadingLogo(true);
    setLogoMessage("");
    try {
      await deleteLogoConfig();
      setLogoConfig(null);
      setLogoMessage("Logo berhasil dihapus.");
      setTimeout(() => setLogoMessage(""), 3500);
    } catch (err) {
      console.error("Gagal menghapus logo:", err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (updatedItem: ProfilItem) => {
    try {
      await updateProfilItem(updatedItem);
      setSections((current) =>
        current.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
    }
  };

  const handleSaveStatistik = async (updatedStat: StatistikItem) => {
    try {
      const saved = await updateStatistik(updatedStat);
      setStatistik(saved);
    } catch (err) {
      console.error("Gagal menyimpan statistik:", err);
    }
  };

  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingCustomStat, setEditingCustomStat] = useState<CustomStatistikItem | null>(null);
  const [deletingCustomStat, setDeletingCustomStat] = useState<CustomStatistikItem | null>(null);

  const handleSaveCustomStat = async (id: string, label: string, value: string) => {
    if (!statistik) return;
    try {
      const updatedCustomStats = (statistik.customStats || []).map((item) =>
        item.id === id ? { ...item, label, value } : item
      );
      await handleSaveStatistik({
        ...statistik,
        customStats: updatedCustomStats,
      });
    } catch (err) {
      console.error("Gagal mengubah statistik kustom:", err);
      throw err;
    }
  };

  const handleAddCustomStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statistik || !newLabel.trim() || !newValue.trim()) return;

    setIsAdding(true);
    try {
      const updatedCustomStats = [
        ...(statistik.customStats || []),
        {
          id: `custom-${Date.now()}`,
          label: newLabel.trim(),
          value: newValue.trim(),
        },
      ];
      await handleSaveStatistik({
        ...statistik,
        customStats: updatedCustomStats,
      });
      setNewLabel("");
      setNewValue("");
    } catch (err) {
      console.error("Gagal menambah statistik kustom:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCustomStat = async (id: string) => {
    if (!statistik) return;

    try {
      const updatedCustomStats = (statistik.customStats || []).filter((item) => item.id !== id);
      await handleSaveStatistik({
        ...statistik,
        customStats: updatedCustomStats,
      });
    } catch (err) {
      console.error("Gagal menghapus statistik kustom:", err);
    }
  };

  return (
    <>
      {/* Kustomisasi Logo Padukuhan */}
      <div className="mb-8 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-zinc-900">Kustomisasi Logo Padukuhan</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Unggah logo kustom untuk memperbarui logo yang tampil di topbar &amp; header website.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-100 bg-[#f9fbf8] p-5">
          <div className="flex items-center gap-4">
            {logoConfig?.imageUrl ? (
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
                <img
                  src={logoConfig.imageUrl}
                  alt="Logo Padukuhan"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1f7a4a_0%,#39a86c_100%)] text-lg font-bold text-white shadow-sm">
                PM
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                PILIH FILE LOGO
              </p>
              <p className="text-sm font-medium text-zinc-800 mt-1">
                {logoConfig?.fileName || (logoConfig?.imageUrl ? "Logo Kustom Aktif" : "Default (Teks Brand PM)")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-sm disabled:opacity-60">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {isUploadingLogo ? "Mengunggah..." : "Pilih File Logo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={isUploadingLogo}
                className="sr-only"
              />
            </label>

            {logoConfig?.imageUrl && (
              <button
                type="button"
                onClick={handleDeleteLogo}
                disabled={isUploadingLogo}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus Logo
              </button>
            )}
          </div>
        </div>

        {logoMessage && (
          <p className="mt-3 text-sm font-medium text-emerald-600">
            ✓ {logoMessage}
          </p>
        )}
      </div>
      <div className={`grid gap-4 ${sections.length === 1 ? "grid-cols-1" : "md:grid-cols-2"}`}>
        {sections.map((item) => (
          <article
            key={item.id}
            className="group rounded-[2rem] border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-lg font-semibold text-zinc-900">{item.title}</p>
              <button
                type="button"
                aria-label={`Edit ${item.title}`}
                onClick={() => setEditingItem(item)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="m16.5 3.5 4 4L7 21l-4 1 1-4Z" />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h3 className="text-xl font-semibold text-zinc-900">Statistik Padukuhan</h3>
            <p className="text-sm text-zinc-500 mt-1">Data letak geografis, luas wilayah, dan jumlah KK padukuhan.</p>
          </div>
          {statistik && (
            <button
              type="button"
              onClick={() => setIsEditingStatistik(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-zinc-200 rounded-full text-sm font-semibold text-emerald-700 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition shrink-0"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="m16.5 3.5 4 4L7 21l-4 1 1-4Z" />
              </svg>
              Edit Statistik Utama
            </button>
          )}
        </div>

        {statistik ? (
          <div className="space-y-8">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-100 bg-[#f9fbf8] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Jumlah Penduduk</span>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">{statistik.jumlahPenduduk}</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-[#f9fbf8] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Jumlah KK</span>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">{statistik.jumlahKK}</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-[#f9fbf8] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Luas Wilayah</span>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">{statistik.luasWilayah}</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-[#f9fbf8] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Jumlah RT</span>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">{statistik.jumlahRT}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-white p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 block">Batas Wilayah</span>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="border-l-2 border-emerald-600 pl-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Utara</span>
                  <p className="text-sm font-semibold text-zinc-800 mt-1">{statistik.batasUtara}</p>
                </div>
                <div className="border-l-2 border-emerald-600 pl-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Timur</span>
                  <p className="text-sm font-semibold text-zinc-800 mt-1">{statistik.batasTimur}</p>
                </div>
                <div className="border-l-2 border-emerald-600 pl-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Selatan</span>
                  <p className="text-sm font-semibold text-zinc-800 mt-1">{statistik.batasSelatan}</p>
                </div>
                <div className="border-l-2 border-emerald-600 pl-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">Barat</span>
                  <p className="text-sm font-semibold text-zinc-800 mt-1">{statistik.batasBarat}</p>
                </div>
              </div>
            </div>

            {/* DYNAMIC STATISTICS SECTION */}
            <div className="border-t border-zinc-100 pt-8">
              <div className="flex items-center gap-2 mb-6">
                <svg className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <h4 className="text-lg font-semibold text-zinc-900">Kelola Statistik Tambahan</h4>
              </div>

              {/* LIST OF DYNAMIC STATS */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {(statistik.customStats || []).length > 0 ? (
                  (statistik.customStats || []).map((cs) => (
                    <div
                      key={cs.id}
                      className="group relative rounded-2xl border border-zinc-200 bg-[#f8faf8] p-5 hover:border-emerald-200 hover:bg-white transition-all duration-300"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCustomStat(cs);
                        }}
                        className="absolute right-12 top-3 z-20 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition shadow-sm"
                        title="Edit statistik"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingCustomStat(cs);
                        }}
                        className="absolute right-3 top-3 z-20 flex items-center justify-center h-8 w-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition shadow-sm"
                        title="Hapus statistik"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 block pr-6">
                        {cs.label}
                      </span>
                      <p className="mt-1.5 text-lg font-semibold text-zinc-900 leading-tight">
                        {cs.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-6 text-center text-sm text-zinc-500 border border-dashed border-zinc-200 rounded-2xl">
                    Belum ada statistik tambahan.
                  </div>
                )}
              </div>

              {/* ADD NEW STATISTIC FORM */}
              <form onSubmit={handleAddCustomStat} className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Tambah Statistik Baru</h5>
                
                <div className="grid gap-4 md:grid-cols-2 items-end">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Kategori</span>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Contoh: Jumlah Ternak Sapi"
                      required
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Keterangan / Detail</span>
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Contoh: 145 Ekor"
                      required
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </label>

                  <div className="md:col-span-2 flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={isAdding}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 px-6 text-sm font-semibold text-zinc-700 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/30 transition shadow-sm disabled:opacity-60"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      {isAdding ? "Menambahkan..." : "Tambah"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        ) : (
          <div className="text-sm text-zinc-500 bg-[#f8faf8] border border-zinc-200 border-dashed rounded-2xl p-8 text-center">
            Memuat data statistik...
          </div>
        )}
      </div>

      <EditProfilModal
        item={editingItem}
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
      />

      <EditStatistikModal
        item={statistik}
        isOpen={isEditingStatistik}
        onClose={() => setIsEditingStatistik(false)}
        onSave={handleSaveStatistik}
      />

      <EditCustomStatistikModal
        item={editingCustomStat}
        isOpen={editingCustomStat !== null}
        onClose={() => setEditingCustomStat(null)}
        onSave={handleSaveCustomStat}
      />

      <DeleteCustomStatistikModal
        item={deletingCustomStat}
        isOpen={deletingCustomStat !== null}
        onClose={() => setDeletingCustomStat(null)}
        onConfirm={handleDeleteCustomStat}
      />
    </>
  );
}

