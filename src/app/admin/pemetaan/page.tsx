"use client";

import { useEffect, useState } from "react";
import {
  fetchLahanItems,
  fetchTanamanItems,
  updateLahanItem,
  updateTanamanItem,
  addTanamanItem,
  deleteTanamanItem,
  type LahanItem,
  type TanamanItem,
  defaultLahan,
  defaultTanaman
} from "@/lib/lahan";
import { isFirebaseConfigured } from "@/lib/firebase";
import Button from "@/components/Button";

export default function AdminPemetaanPage() {
  const [lahanItems, setLahanItems] = useState<LahanItem[]>(defaultLahan);
  const [tanamanItems, setTanamanItems] = useState<TanamanItem[]>(defaultTanaman);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [lahanForm, setLahanForm] = useState<{ [key: string]: string }>({});
  const [tanamanForm, setTanamanForm] = useState<{ [key: string]: string }>({});

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<TanamanItem | null>(null); // null if adding
  const [modalForm, setModalForm] = useState({
    name: "",
    landCategoryId: "sawah",
    productivityPerHa: "",
    landUsePct: "100",
    factorNotes: ""
  });
  const [deleteTarget, setDeleteTarget] = useState<TanamanItem | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [lahanData, tanamanData] = await Promise.all([
          fetchLahanItems(),
          fetchTanamanItems()
        ]);

        if (!isCancelled) {
          setLahanItems(lahanData);
          setTanamanItems(tanamanData);

          // Initialize form states
          const lf: typeof lahanForm = {};
          lahanData.forEach((item) => {
            lf[item.id] = item.area.toString();
          });
          setLahanForm(lf);

          const tf: typeof tanamanForm = {};
          tanamanData.forEach((item) => {
            tf[item.id] = item.productivityPerHa.toString();
          });
          setTanamanForm(tf);

          setSyncError(null);
        }
      } catch {
        if (!isCancelled) {
          setSyncError("Gagal mengambil data dari database. Menampilkan data fallback.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleLahanChange = (id: string, value: string) => {
    setLahanForm((prev) => ({ ...prev, [id]: value }));
  };



  const handleSaveLahan = async (id: string) => {
    const valueStr = lahanForm[id];
    if (valueStr === undefined) return;

    const valueNum = parseFloat(valueStr);
    if (isNaN(valueNum) || valueNum < 0) {
      alert("Luas lahan harus berupa angka positif.");
      return;
    }

    if (!isFirebaseConfigured) {
      setLahanItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, area: valueNum } : item))
      );
      setSuccessMessage(`Berhasil memperbarui luas ${id} (lokal).`);
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    try {
      setIsSubmitting(`lahan-${id}`);
      await updateLahanItem(id, valueNum);
      setLahanItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, area: valueNum } : item))
      );
      setSuccessMessage(`Berhasil menyimpan luas lahan ${id} ke database.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      alert("Gagal menyimpan ke database.");
    } finally {
      setIsSubmitting(null);
    }
  };



  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingCrop(null);
    setModalForm({
      name: "",
      landCategoryId: lahanItems[0]?.id || "sawah",
      productivityPerHa: "",
      landUsePct: "100",
      factorNotes: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (crop: TanamanItem) => {
    setEditingCrop(crop);
    setModalForm({
      name: crop.name,
      landCategoryId: crop.landCategoryId,
      productivityPerHa: crop.productivityPerHa.toString(),
      landUsePct: ((crop.landUseFactor !== undefined ? crop.landUseFactor : 1.0) * 100).toFixed(0),
      factorNotes: crop.factorNotes || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      alert("Nama komoditas harus diisi.");
      return;
    }
    const prodVal = parseFloat(modalForm.productivityPerHa);
    if (isNaN(prodVal) || prodVal < 0) {
      alert("Produktivitas harus berupa angka positif.");
      return;
    }
    const pctVal = parseFloat(modalForm.landUsePct);
    if (isNaN(pctVal) || pctVal < 0 || pctVal > 100) {
      alert("Porsi tanam harus berupa angka antara 0% dan 100%.");
      return;
    }

    const landUseFactor = pctVal / 100;
    setIsSubmitting("modal");

    try {
      const cropData = {
        name: modalForm.name.trim(),
        landCategoryId: modalForm.landCategoryId,
        productivityPerHa: prodVal,
        landUseFactor,
        factorNotes: modalForm.factorNotes.trim()
      };

      if (editingCrop) {
        if (isFirebaseConfigured) {
          await updateTanamanItem(editingCrop.id, cropData);
        }
        setTanamanItems((prev) =>
          prev.map((item) => (item.id === editingCrop.id ? { ...item, ...cropData } : item))
        );
        setTanamanForm((prev) => ({ ...prev, [editingCrop.id]: prodVal.toString() }));
        setSuccessMessage(`Berhasil memperbarui komoditas ${cropData.name}.`);
      } else {
        let generatedId = "";
        if (isFirebaseConfigured) {
          generatedId = await addTanamanItem(cropData);
        } else {
          generatedId = cropData.name.toLowerCase().replace(/\s+/g, "-");
        }
        const newCrop: TanamanItem = {
          id: generatedId,
          ...cropData
        };
        setTanamanItems((prev) => [...prev, newCrop]);
        setTanamanForm((prev) => ({ ...prev, [generatedId]: prodVal.toString() }));
        setSuccessMessage(`Berhasil menambahkan komoditas ${cropData.name}.`);
      }
      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      alert("Gagal menyimpan komoditas ke database.");
    } finally {
      setIsSubmitting(null);
    }
  };

  const confirmDeleteCrop = async () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;

    setIsSubmitting(`delete-${id}`);
    try {
      if (isFirebaseConfigured) {
        await deleteTanamanItem(id);
      }
      setTanamanItems((prev) => prev.filter((item) => item.id !== id));
      setTanamanForm((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setSuccessMessage(`Berhasil menghapus komoditas ${name}.`);
      setDeleteTarget(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      alert("Gagal menghapus komoditas dari database.");
    } finally {
      setIsSubmitting(null);
    }
  };

  // Preview computations
  const getPreviewArea = (categoryId: string) => {
    const strVal = lahanForm[categoryId];
    return strVal !== undefined ? parseFloat(strVal) || 0 : 0;
  };

  const getPreviewProd = (cropId: string) => {
    const strVal = tanamanForm[cropId];
    return strVal !== undefined ? parseFloat(strVal) || 0 : 0;
  };

  const totalArea = lahanItems.reduce((acc, curr) => acc + getPreviewArea(curr.id), 0);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="rounded-3xl bg-white p-8 border border-zinc-200/80 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Kelola Data Pemetaan & Hasil Panen
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Kelola data luas lahan (**pekarangan**, **sawah**, **tegalan**) serta rata-rata produktivitas komoditas secara langsung. Anda juga dapat menambah, mengedit, dan menghapus komoditas tanaman hasil panen kustom secara dinamis.
        </p>

        {!isFirebaseConfigured ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
            ⚠️ Firebase belum dikonfigurasi. Perubahan data hanya akan tersimpan sementara di memori browser (offline fallback).
          </div>
        ) : null}

        {syncError ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-800">
            {syncError}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800">
            ✅ {successMessage}
          </div>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Forms column */}
        <div className="space-y-8">
          {/* Lahan Area Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-800 border-b border-zinc-200 pb-2">1. Luas Wilayah Lahan</h2>
            {isLoading ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">
                Memuat data luas lahan...
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {lahanItems.map((item) => {
                  const areaVal = lahanForm[item.id] || "0";
                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-zinc-950 text-sm">{item.name}</h3>
                        <p className="text-[0.68rem] text-zinc-400 mt-0.5">ID: {item.id}</p>
                        <div className="mt-4">
                          <label htmlFor={`area-${item.id}`} className="block text-[0.65rem] font-bold text-zinc-500 mb-1 uppercase tracking-wider">
                            Luas (Ha)
                          </label>
                          <input
                            id={`area-${item.id}`}
                            type="number"
                            step="any"
                            value={areaVal}
                            onChange={(e) => handleLahanChange(item.id, e.target.value)}
                            className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-xs text-zinc-900 outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10"
                          />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-50 flex justify-end">
                        <Button
                          type="button"
                          disabled={isSubmitting === `lahan-${item.id}`}
                          onClick={() => handleSaveLahan(item.id)}
                        >
                          {isSubmitting === `lahan-${item.id}` ? "Menyimpan..." : "Simpan"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tanaman Productivity Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
              <h2 className="text-xl font-bold text-zinc-800">2. Parameter Produktivitas Komoditas</h2>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 text-xs font-semibold text-white shadow-sm transition-colors duration-200"
              >
                + Tambah Komoditas
              </button>
            </div>
            {isLoading ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">
                Memuat data komoditas...
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {tanamanItems.map((crop) => {
                  const prodVal = tanamanForm[crop.id] || "0";
                  const landCategory = lahanItems.find((l) => l.id === crop.landCategoryId);
                  const landUseFactor = crop.landUseFactor !== undefined ? crop.landUseFactor : 1.0;
                  const factorPct = (landUseFactor * 100).toFixed(0);
                  return (
                    <div
                      key={crop.id}
                      className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-zinc-950 text-sm">{crop.name}</h3>
                            <p className="text-[0.62rem] text-zinc-400 mt-0.5">ID: {crop.id}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-700 uppercase">
                              {landCategory?.name || ""}
                            </span>
                            <span className="text-[0.65rem] font-medium text-zinc-500">
                              Porsi Lahan: {factorPct}%
                            </span>
                          </div>
                        </div>
                        {crop.factorNotes ? (
                          <p className="text-[0.65rem] italic text-zinc-500 bg-zinc-50 border border-zinc-100 p-2 rounded-lg mt-2">
                            {crop.factorNotes}
                          </p>
                        ) : null}
                        <div className="mt-4">
                          <label htmlFor={`prod-${crop.id}`} className="block text-[0.65rem] font-bold text-zinc-500 mb-1 uppercase tracking-wider">
                            Produktivitas (Ton/Ha)
                          </label>
                          <input
                            id={`prod-${crop.id}`}
                            type="number"
                            step="any"
                            disabled
                            value={prodVal}
                            className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-xs text-zinc-500 bg-zinc-50/80 cursor-not-allowed outline-none"
                          />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-50 flex justify-between items-center">
                        <button
                          type="button"
                          disabled={isSubmitting !== null}
                          onClick={() => setDeleteTarget(crop)}
                          className="text-[0.7rem] font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                        >
                          Hapus
                        </button>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(crop)}
                            className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-[0.7rem] font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Live preview column */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <h2 className="text-lg font-semibold text-zinc-800">Preview Hasil Publik</h2>
          
          <div className="rounded-3xl bg-white text-zinc-800 p-6 shadow-sm border border-zinc-200/80">
            <p className="text-[0.68rem] font-bold tracking-widest text-emerald-700 uppercase">Live Preview Panel</p>
            <h3 className="mt-3 text-lg font-bold text-zinc-950">Simulasi Panen & Lahan</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              Berikut adalah visualisasi simulasi dari data di sebelah kiri yang dihitung langsung sebelum Anda menekan tombol simpan.
            </p>

            <div className="mt-6 space-y-6 border-t border-zinc-100 pt-6">
              {/* Crops simulation output */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Estimasi Panen Komoditas</p>
                <div className="space-y-2">
                  {tanamanItems.map((crop) => {
                    const area = getPreviewArea(crop.landCategoryId);
                    const prod = getPreviewProd(crop.id);
                    const landUseFactor = crop.landUseFactor !== undefined ? crop.landUseFactor : 1.0;

                    const harvest = area * landUseFactor * prod;
                    const formattedHarvest = new Intl.NumberFormat("id-ID", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4
                    }).format(harvest);
                    return (
                      <div
                        key={crop.id}
                        className="flex justify-between items-center text-xs bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-950/5"
                      >
                        <span className="font-semibold text-zinc-700">
                          {crop.name} <span className="text-[0.62rem] text-zinc-400 font-normal">({(landUseFactor * 100).toFixed(0)}% lahan)</span>
                        </span>
                        <span className="font-extrabold text-emerald-700 text-sm">{formattedHarvest} Ton</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress bar preview */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Proporsi Distribusi Wilayah</p>
                {lahanItems.map((item) => {
                  const area = getPreviewArea(item.id);
                  const pct = totalArea > 0 ? ((area / totalArea) * 100).toFixed(1) : "0";
                  const formattedArea = new Intl.NumberFormat("id-ID", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4
                  }).format(area);
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500 font-medium">{item.name}</span>
                        <span className="text-zinc-800 font-semibold">
                          {formattedArea} Ha ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden border border-zinc-200/30">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-xs font-bold text-zinc-500 border-t border-zinc-100 pt-3">
                <span>Total Luas Wilayah:</span>
                <span className="text-zinc-900 font-bold">
                  {new Intl.NumberFormat("id-ID", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4
                  }).format(totalArea)} Ha
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-zinc-200/80 shadow-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="text-xl font-bold text-zinc-900">
                {editingCrop ? `Edit Komoditas: ${editingCrop.name}` : "Tambah Komoditas Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                  Nama Komoditas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kedelai, Kacang Tanah"
                  value={modalForm.name}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                    Kategori Wilayah Lahan
                  </label>
                  <select
                    value={modalForm.landCategoryId}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, landCategoryId: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900 bg-white outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10"
                  >
                    {lahanItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                    Produktivitas (Ton/Ha)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0"
                    placeholder="Contoh: 3.5"
                    value={modalForm.productivityPerHa}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, productivityPerHa: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                    Porsi Lahan / Faktor (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0"
                    max="100"
                    placeholder="0 - 100"
                    value={modalForm.landUsePct}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, landUsePct: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                    Catatan Faktor / Koefisien
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Porsi Tanam Tegalan (30%)"
                    value={modalForm.factorNotes}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, factorNotes: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-[#1f7a4a] focus:ring-2 focus:ring-[#1f7a4a]/10"
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting === "modal"}
                  className="h-12 rounded-xl bg-[linear-gradient(135deg,#1f7a4a_0%,#2fa866_100%)] px-6 text-sm font-semibold text-white shadow-md hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting === "modal" ? "Menyimpan..." : "Simpan Komoditas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-md rounded-3xl bg-white border border-zinc-200/80 shadow-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 animate-scale-up">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900">
                Hapus Komoditas
              </h3>
            </div>

            <div className="mt-4">
              <p className="text-sm text-zinc-600 font-medium">
                Apakah Anda yakin ingin menghapus komoditas <span className="font-extrabold text-zinc-950">“{deleteTarget.name}”</span>? Tindakan ini akan menghapus data dari database dan tidak dapat dibatalkan.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isSubmitting !== null}
                onClick={() => setDeleteTarget(null)}
                className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors duration-200 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting !== null}
                onClick={confirmDeleteCrop}
                className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-sm transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting === `delete-${deleteTarget.id}` ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
