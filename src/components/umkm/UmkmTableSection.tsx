"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/Table";
import AddUmkmModal from "@/components/umkm/AddUmkmModal";
import DeleteUmkmModal from "@/components/umkm/DeleteUmkmModal";
import DetailUmkmModal from "@/components/umkm/DetailUmkmModal";
import EditUmkmModal from "@/components/umkm/EditUmkmModal";
import {
  getMissingCloudinaryConfig,
  isCloudinaryConfigured,
  uploadImageToCloudinary,
} from "@/lib/cloudinary-upload";
import {
  createUmkmItem,
  fetchUmkmItems,
  removeUmkmItem,
  updateUmkmItem,
} from "@/lib/umkm-firestore";
import { isFirebaseConfigured, missingFirebaseConfigKeys } from "@/lib/firebase";
import type { UmkmItem } from "@/types/umkm";

type UmkmTableSectionProps = {
  items: UmkmItem[];
};

export default function UmkmTableSection({ items }: UmkmTableSectionProps) {
  const pageSize = 5;
  const [umkmItems, setUmkmItems] = useState<UmkmItem[]>(() =>
    isFirebaseConfigured ? [] : items,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingUmkm, setIsAddingUmkm] = useState(false);
  const [selectedUmkm, setSelectedUmkm] = useState<UmkmItem | null>(null);
  const [editingUmkm, setEditingUmkm] = useState<UmkmItem | null>(null);
  const [deletingUmkm, setDeletingUmkm] = useState<UmkmItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadUmkm = async () => {
      setIsLoading(true);
      setSyncError(null);

      try {
        const remoteItems = await fetchUmkmItems();

        if (!isCancelled) {
          setUmkmItems(remoteItems);
          setCurrentPage(1);
        }
      } catch {
        if (!isCancelled) {
          setSyncError("Gagal memuat data UMKM dari Firestore. Data cadangan tetap ditampilkan.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadUmkm();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredItems = umkmItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize,
  );

  const tableRows = paginatedItems.map((item) => ({
    id: item.id,
    cells: [
      <div key="photo" className="flex items-center">
        <div
          className="h-12 w-12 rounded-2xl bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center"
          style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
        />
      </div>,
      <span key="name" className="font-semibold text-zinc-900">
        {item.name}
      </span>,
      <span key="owner" className="text-zinc-600">
        {item.owner}
      </span>,
    ],
    actions: [
      { label: "Detail", onClick: () => setSelectedUmkm(item) },
      { label: "Edit", onClick: () => setEditingUmkm(item) },
      { label: "Hapus", tone: "danger" as const, onClick: () => setDeletingUmkm(item) },
    ],
  }));

  const handleAddUmkm = async ({
    name,
    owner,
    file,
  }: {
    name: string;
    owner: string;
    file: File | null;
  }) => {
    if (!name.trim() || !owner.trim()) {
      return;
    }

    if (!isFirebaseConfigured) {
      setUmkmItems((current) => [
        {
          id: `umkm-${Date.now()}`,
          name,
          owner,
          imageUrl: file ? URL.createObjectURL(file) : undefined,
          fileName: file?.name,
        },
        ...current,
      ]);
      setCurrentPage(1);
      return;
    }

    try {
      const uploadedImage =
        file && isCloudinaryConfigured("umkm")
          ? await uploadImageToCloudinary(file, "umkm")
          : undefined;

      const createdItem = await createUmkmItem({
        name,
        owner,
        imageUrl: uploadedImage?.imageUrl,
        imagePublicId: uploadedImage?.imagePublicId,
        fileName: uploadedImage?.fileName ?? file?.name,
      });

      setUmkmItems((current) => [createdItem, ...current]);
      setCurrentPage(1);
      setSyncError(null);
    } catch {
      setSyncError("Gagal menambahkan UMKM. Cek Cloudinary preset dan koneksi Firestore.");
    }
  };

  const handleEditUmkm = async (updatedUmkm: UmkmItem & { file?: File | null }) => {
    const previousItems = umkmItems;

    const optimisticItem: UmkmItem = {
      ...updatedUmkm,
      imageUrl: updatedUmkm.file ? URL.createObjectURL(updatedUmkm.file) : updatedUmkm.imageUrl,
      fileName: updatedUmkm.file ? updatedUmkm.file.name : updatedUmkm.fileName,
    };

    setUmkmItems((current) =>
      current.map((item) => (item.id === optimisticItem.id ? optimisticItem : item)),
    );

    if (!isFirebaseConfigured) {
      return;
    }

    try {
      const uploadedImage =
        updatedUmkm.file && isCloudinaryConfigured("umkm")
          ? await uploadImageToCloudinary(updatedUmkm.file, "umkm")
          : undefined;

      const savedItem = await updateUmkmItem({
        ...updatedUmkm,
        imageUrl: uploadedImage?.imageUrl ?? updatedUmkm.imageUrl,
        imagePublicId: uploadedImage?.imagePublicId ?? updatedUmkm.imagePublicId,
        fileName: uploadedImage?.fileName ?? updatedUmkm.fileName,
      });

      setUmkmItems((current) =>
        current.map((item) => (item.id === savedItem.id ? savedItem : item)),
      );
      setSyncError(null);
    } catch {
      setUmkmItems(previousItems);
      setSyncError("Gagal memperbarui UMKM di Firestore.");
    }
  };

  const handleDeleteUmkm = async (id: string) => {
    const previousItems = umkmItems;
    const nextItems = umkmItems.filter((item) => item.id !== id);

    setUmkmItems(nextItems);
    setSelectedUmkm((current) => (current?.id === id ? null : current));
    setEditingUmkm((current) => (current?.id === id ? null : current));
    setCurrentPage((current) =>
      Math.min(
        current,
        Math.max(
          1,
          Math.ceil(
            nextItems.filter(
              (item) =>
                item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                item.owner.toLowerCase().includes(searchQuery.trim().toLowerCase()),
            ).length / pageSize,
          ),
        ),
      ),
    );

    if (!isFirebaseConfigured) {
      return;
    }

    try {
      await removeUmkmItem(id);
      setSyncError(null);
    } catch {
      setUmkmItems(previousItems);
      setSyncError("Gagal menghapus UMKM dari Firestore.");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="grid gap-3 border-b border-zinc-200 pb-6 xl:grid-cols-[minmax(0,1fr)_16rem] xl:items-center">
        <SearchBar
          placeholder="Cari nama usaha atau pemilik"
          className="w-full max-w-2xl"
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
        />
        <div className="w-full sm:w-[16rem] xl:justify-self-end">
          <Button fullWidth className="gap-3" onClick={() => setIsAddingUmkm(true)}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span>Tambah UMKM</span>
          </Button>
        </div>
      </div>

      {!isFirebaseConfigured ? (
        <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Firebase belum aktif penuh untuk UMKM. Data masih memakai cadangan lokal.
          {missingFirebaseConfigKeys.length > 0 ? (
            <span className="block pt-1 text-amber-800">
              Key yang belum diisi: {missingFirebaseConfigKeys.join(", ")}
            </span>
          ) : null}
        </div>
      ) : null}

      {isFirebaseConfigured && !isCloudinaryConfigured("umkm") ? (
        <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Upload gambar UMKM ke Cloudinary belum lengkap.
          <span className="block pt-1 text-amber-800">
            Key yang belum diisi: {getMissingCloudinaryConfig("umkm").join(", ")}
          </span>
        </div>
      ) : null}

      {syncError ? (
        <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {syncError}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col">
        <Table
          columns={[
            { label: "Foto" },
            { label: "Nama Usaha" },
            { label: "Pemilik" },
            { label: "Aksi", className: "text-right" },
          ]}
          rows={tableRows}
          gridTemplate="0.5fr 1.9fr 1.2fr 0.5fr"
          scrollable
          className="h-full"
          emptyMessage={
            isLoading ? "Memuat data UMKM dari Firestore..." : "Belum ada data UMKM."
          }
        />
        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))}
        />
      </div>

      <AddUmkmModal
        isOpen={isAddingUmkm}
        onClose={() => setIsAddingUmkm(false)}
        onSave={handleAddUmkm}
      />
      <DetailUmkmModal
        umkm={selectedUmkm}
        isOpen={selectedUmkm !== null}
        onClose={() => setSelectedUmkm(null)}
      />
      <EditUmkmModal
        umkm={editingUmkm}
        isOpen={editingUmkm !== null}
        onClose={() => setEditingUmkm(null)}
        onSave={handleEditUmkm}
      />
      <DeleteUmkmModal
        umkm={deletingUmkm}
        isOpen={deletingUmkm !== null}
        onClose={() => setDeletingUmkm(null)}
        onConfirm={handleDeleteUmkm}
      />
    </div>
  );
}
