"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/Table";
import {
  createBeritaItem,
  fetchBeritaItems,
  removeBeritaItem,
  updateBeritaItem,
} from "@/lib/berita-firestore";
import { createGaleriItem } from "@/lib/galeri-firestore";
import { isFirebaseConfigured, missingFirebaseConfigKeys } from "@/lib/firebase";
import { isCloudinaryConfigured, getMissingCloudinaryConfig, uploadImageToCloudinary } from "@/lib/cloudinary-upload";
import type { BeritaItem } from "@/types/berita";

import AddBeritaModal from "./AddBeritaModal";
import DetailBeritaModal from "./DetailBeritaModal";
import DeleteBeritaModal from "./DeleteBeritaModal";
import EditBeritaModal from "./EditBeritaModal";

type BeritaTableSectionProps = {
  items: BeritaItem[];
};

export default function BeritaTableSection({ items }: BeritaTableSectionProps) {
  const pageSize = 5;
  const [beritaItems, setBeritaItems] = useState<BeritaItem[]>(() =>
    isFirebaseConfigured ? [] : items,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingBerita, setIsAddingBerita] = useState(false);
  const [selectedBerita, setSelectedBerita] = useState<BeritaItem | null>(null);
  const [editingBerita, setEditingBerita] = useState<BeritaItem | null>(null);
  const [deletingBerita, setDeletingBerita] = useState<BeritaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadBerita = async () => {
      setIsLoading(true);
      setSyncError(null);

      try {
        const remoteItems = await fetchBeritaItems();

        if (!isCancelled) {
          setBeritaItems(remoteItems);
          setCurrentPage(1);
        }
      } catch {
        if (!isCancelled) {
          setSyncError("Gagal memuat berita dari Firestore. Sementara data lokal tetap ditampilkan.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadBerita();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredItems = beritaItems.filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [item.title, item.description, item.date, item.author, item.category].some((value) =>
      value.toLowerCase().includes(query),
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize,
  );

  const tableRows = paginatedItems.map((row) => ({
    id: row.id,
    cells: [
      <div key="photo" className="flex items-center py-1">
        <div
          className="h-12 w-12 rounded-2xl bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center"
          style={row.imageUrl ? { backgroundImage: `url(${row.imageUrl})` } : undefined}
        />
      </div>,
      <span key="title" className="font-semibold text-zinc-900 truncate max-w-[200px]" title={row.title}>
        {row.title}
      </span>,
      <span key="category" className="text-zinc-600">
        {row.category}
      </span>,
      <span key="author" className="text-zinc-600">
        {row.author}
      </span>,
      <span key="date" className="text-zinc-500">
        {row.date}
      </span>,
    ],
    actions: [
      { label: "Detail", onClick: () => setSelectedBerita(row) },
      { label: "Edit", onClick: () => setEditingBerita(row) },
      { label: "Hapus", tone: "danger" as const, onClick: () => setDeletingBerita(row) },
    ],
  }));

  const handleSaveEdit = async (updatedBerita: BeritaItem & { file?: File | null }) => {
    const previousItems = beritaItems;

    const optimisticItem: BeritaItem = {
      ...updatedBerita,
      imageUrl: updatedBerita.file ? URL.createObjectURL(updatedBerita.file) : updatedBerita.imageUrl,
      fileName: updatedBerita.file ? updatedBerita.file.name : updatedBerita.fileName,
    };

    setBeritaItems((current) =>
      current.map((item) => (item.id === optimisticItem.id ? optimisticItem : item)),
    );

    if (!isFirebaseConfigured) {
      return;
    }

    try {
      const uploadedImage =
        updatedBerita.file && isCloudinaryConfigured("berita")
          ? await uploadImageToCloudinary(updatedBerita.file, "berita")
          : undefined;

      const savedItem = await updateBeritaItem({
        ...updatedBerita,
        imageUrl: uploadedImage?.imageUrl ?? updatedBerita.imageUrl,
        imagePublicId: uploadedImage?.imagePublicId ?? updatedBerita.imagePublicId,
        fileName: uploadedImage?.fileName ?? updatedBerita.fileName,
      });

      setBeritaItems((current) =>
        current.map((item) => (item.id === savedItem.id ? savedItem : item)),
      );
      setSyncError(null);
    } catch {
      setBeritaItems(previousItems);
      setSyncError("Gagal menyimpan perubahan berita ke Firestore.");
    }
  };

  const handleAddBerita = async ({
    title,
    description,
    date,
    author,
    category,
    file,
  }: {
    title: string;
    description: string;
    date: string;
    author: string;
    category: string;
    file: File | null;
  }) => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedDate = date.trim();
    const trimmedAuthor = author.trim() || "Admin Desa";
    const trimmedCategory = category.trim() || "Informasi Desa";

    if (!trimmedTitle || !trimmedDescription || !trimmedDate) {
      return;
    }

    const localItem: BeritaItem = {
      id: `berita-${Date.now()}`,
      title: trimmedTitle,
      description: trimmedDescription,
      date: trimmedDate,
      category: trimmedCategory,
      author: trimmedAuthor,
      content: [trimmedDescription],
      imageUrl: file ? URL.createObjectURL(file) : undefined,
      fileName: file?.name,
    };

    if (!isFirebaseConfigured) {
      setBeritaItems((current) => [localItem, ...current]);
      setCurrentPage(1);
      setSearchQuery("");
      return;
    }

    try {
      const uploadedImage =
        file && isCloudinaryConfigured("berita")
          ? await uploadImageToCloudinary(file, "berita")
          : undefined;

      const createdItem = await createBeritaItem({
        title: trimmedTitle,
        description: trimmedDescription,
        date: trimmedDate,
        author: trimmedAuthor,
        category: trimmedCategory,
        imageUrl: uploadedImage?.imageUrl,
        imagePublicId: uploadedImage?.imagePublicId,
        fileName: uploadedImage?.fileName ?? file?.name,
      });

      // Auto-sync to Galeri if an image was uploaded
      if (uploadedImage?.imageUrl) {
        try {
          await createGaleriItem({
            title: trimmedTitle,
            imageUrl: uploadedImage.imageUrl,
            imagePublicId: uploadedImage.imagePublicId,
            fileName: uploadedImage.fileName ?? file?.name,
          });
        } catch (err) {
          console.error("Gagal sinkronisasi ke galeri:", err);
        }
      }

      setBeritaItems((current) => [createdItem, ...current]);
      setCurrentPage(1);
      setSearchQuery("");
      setSyncError(null);
    } catch {
      setSyncError("Gagal menambahkan berita ke Firestore.");
    }
  };

  const handleDeleteBerita = async (id: string) => {
    const previousItems = beritaItems;
    const nextItems = beritaItems.filter((item) => item.id !== id);

    setBeritaItems(nextItems);
    setSelectedBerita((current) => (current?.id === id ? null : current));
    setEditingBerita((current) => (current?.id === id ? null : current));
    setCurrentPage(1);

    if (!isFirebaseConfigured) {
      return;
    }

    try {
      await removeBeritaItem(id);
      setSyncError(null);
    } catch {
      setBeritaItems(previousItems);
      setCurrentPage((current) =>
        Math.min(current, Math.max(1, Math.ceil(previousItems.length / pageSize))),
      );
      setSyncError("Gagal menghapus berita dari Firestore.");
    }
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col gap-5">
        <div className="border-b border-zinc-200/80 pb-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-center">
            <SearchBar
              placeholder="Cari berita berdasarkan judul, kategori, atau penulis"
              className="w-full max-w-2xl"
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
            />
            <Button fullWidth className="gap-3" onClick={() => setIsAddingBerita(true)}>
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
              <span>Tulis Berita</span>
            </Button>
          </div>

          {!isFirebaseConfigured ? (
            <div className="mt-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Firebase belum aktif di project lokal ini. Isi <code>.env.local</code> dengan
              config Web App dulu. Selama itu, halaman berita masih memakai data lokal.
              {missingFirebaseConfigKeys.length > 0 ? (
                <span className="block pt-1 text-amber-800">
                  Key yang belum diisi: {missingFirebaseConfigKeys.join(", ")}
                </span>
              ) : null}
            </div>
          ) : null}

          {isFirebaseConfigured && !isCloudinaryConfigured("berita") ? (
            <div className="mt-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Upload gambar berita ke Cloudinary belum lengkap.
              <span className="block pt-1 text-amber-800">
                Key yang belum diisi: {getMissingCloudinaryConfig("berita").join(", ")}
              </span>
            </div>
          ) : null}

          {syncError ? (
            <div className="mt-4 border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
              {syncError}
            </div>
          ) : null}
        </div>

        <section className="mt-1 flex min-h-0 flex-1 flex-col">
          <Table
            columns={[
              { label: "Foto" },
              { label: "Judul" },
              { label: "Kategori" },
              { label: "Penulis" },
              { label: "Tanggal" },
              { label: "Aksi", className: "text-right" },
            ]}
            rows={tableRows}
            gridTemplate="0.6fr 2fr 1.2fr 1.2fr 1fr 0.8fr"
            scrollable
            className="h-full"
            emptyMessage={
              isLoading ? "Memuat berita dari Firestore..." : "Belum ada berita yang tersedia."
            }
          />
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))}
          />
        </section>
      </div>

      <DetailBeritaModal
        berita={selectedBerita}
        isOpen={selectedBerita !== null}
        onClose={() => setSelectedBerita(null)}
      />
      <AddBeritaModal
        isOpen={isAddingBerita}
        onClose={() => setIsAddingBerita(false)}
        onSave={handleAddBerita}
      />
      <EditBeritaModal
        berita={editingBerita}
        isOpen={editingBerita !== null}
        onClose={() => setEditingBerita(null)}
        onSave={handleSaveEdit}
      />
      <DeleteBeritaModal
        berita={deletingBerita}
        isOpen={deletingBerita !== null}
        onClose={() => setDeletingBerita(null)}
        onConfirm={handleDeleteBerita}
      />
    </>
  );
}
