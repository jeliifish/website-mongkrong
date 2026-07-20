"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import {
  getMissingCloudinaryConfig,
  isCloudinaryConfigured,
  uploadImageToCloudinary,
} from "@/lib/cloudinary-upload";
import { isFirebaseConfigured, missingFirebaseConfigKeys } from "@/lib/firebase";
import {
  createGaleriItem,
  fetchGaleriItems,
  removeGaleriItem,
  updateGaleriItem,
} from "@/lib/galeri-firestore";
import type { GaleriItem } from "@/types/galeri";

import AddGaleriModal from "./AddGaleriModal";
import DeleteGaleriModal from "./DeleteGaleriModal";
import DetailGaleriModal from "./DetailGaleriModal";
import EditGaleriModal from "./EditGaleriModal";

type GaleriSectionProps = {
  items: GaleriItem[];
};

const todayFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function GaleriSection({ items }: GaleriSectionProps) {
  const [albums, setAlbums] = useState<GaleriItem[]>(() =>
    isFirebaseConfigured ? [] : items,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingGaleri, setIsAddingGaleri] = useState(false);
  const [selectedGaleri, setSelectedGaleri] = useState<GaleriItem | null>(null);
  const [editingGaleri, setEditingGaleri] = useState<GaleriItem | null>(null);
  const [deletingGaleri, setDeletingGaleri] = useState<GaleriItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadGaleri = async () => {
      setIsLoading(true);
      setSyncError(null);

      try {
        const remoteItems = await fetchGaleriItems();

        if (!isCancelled) {
          setAlbums(remoteItems);
        }
      } catch {
        if (!isCancelled) {
          setSyncError(
            "Gagal memuat galeri dari Firestore. Data cadangan tetap ditampilkan.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadGaleri();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleAddGaleri = async ({
    title,
    file,
  }: {
    title: string;
    file: File;
  }) => {
    if (!title.trim()) {
      return;
    }

    if (!isFirebaseConfigured) {
      const imageUrl = URL.createObjectURL(file);

      setAlbums((current) => [
        {
          id: `galeri-${Date.now()}`,
          title,
          photos: "1 foto",
          updated: todayFormatter.format(new Date()),
          imageUrl,
          fileName: file.name,
        },
        ...current,
      ]);
      return;
    }

    try {
      const uploadedImage = await uploadImageToCloudinary(file, "galeri");
      const createdItem = await createGaleriItem({
        title,
        imageUrl: uploadedImage.imageUrl,
        imagePublicId: uploadedImage.imagePublicId,
        fileName: uploadedImage.fileName ?? file.name,
      });

      setAlbums((current) => [createdItem, ...current]);
      setSyncError(null);
    } catch {
      setSyncError("Gagal menambahkan foto galeri. Cek Cloudinary preset dan Firestore.");
    }
  };

  const handleEditGaleri = async ({
    id,
    title,
    file,
  }: {
    id: string;
    title: string;
    file?: File | null;
  }) => {
    const previousItems = albums;
    const targetItem = albums.find((item) => item.id === id);

    if (!targetItem) {
      return;
    }

    const optimisticItem: GaleriItem = {
      ...targetItem,
      title,
      updated: todayFormatter.format(new Date()),
      imageUrl: file ? URL.createObjectURL(file) : targetItem.imageUrl,
      fileName: file ? file.name : targetItem.fileName,
    };

    setAlbums((current) =>
      current.map((item) => (item.id === optimisticItem.id ? optimisticItem : item)),
    );

    if (!isFirebaseConfigured) {
      return;
    }

    try {
      const uploadedImage =
        file && isCloudinaryConfigured("galeri")
          ? await uploadImageToCloudinary(file, "galeri")
          : undefined;

      const savedItem = await updateGaleriItem({
        ...targetItem,
        title,
        updated: todayFormatter.format(new Date()),
        imageUrl: uploadedImage?.imageUrl ?? targetItem.imageUrl ?? "",
        imagePublicId: uploadedImage?.imagePublicId ?? targetItem.imagePublicId,
        fileName: uploadedImage?.fileName ?? targetItem.fileName,
      });

      setAlbums((current) =>
        current.map((item) => (item.id === savedItem.id ? savedItem : item)),
      );
      setSyncError(null);
    } catch {
      setAlbums(previousItems);
      setSyncError("Gagal memperbarui item galeri di Firestore.");
    }
  };

  const handleDeleteGaleri = async (id: string) => {
    const previousItems = albums;
    setAlbums((current) => current.filter((item) => item.id !== id));
    setSelectedGaleri((current) => (current?.id === id ? null : current));
    setEditingGaleri((current) => (current?.id === id ? null : current));

    if (!isFirebaseConfigured) {
      return;
    }

    try {
      await removeGaleriItem(id);
      setSyncError(null);
    } catch {
      setAlbums(previousItems);
      setSyncError("Gagal menghapus item galeri dari Firestore.");
    }
  };

  return (
    <>
      <div className="grid gap-3 border-b border-zinc-200 pb-6 xl:grid-cols-[minmax(0,1fr)_16rem] xl:items-center">
        <SearchBar
          placeholder="Cari judul galeri"
          className="w-full max-w-2xl"
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="w-full sm:w-[16rem] xl:justify-self-end">
          <Button fullWidth onClick={() => setIsAddingGaleri(true)} className="gap-3">
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
            <span>Tambah Foto</span>
          </Button>
        </div>
      </div>

      {!isFirebaseConfigured ? (
        <div className="mt-5 border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Firebase belum aktif penuh untuk galeri. Data masih memakai cadangan lokal.
          {missingFirebaseConfigKeys.length > 0 ? (
            <span className="block pt-1 text-amber-800">
              Key yang belum diisi: {missingFirebaseConfigKeys.join(", ")}
            </span>
          ) : null}
        </div>
      ) : null}

      {isFirebaseConfigured && !isCloudinaryConfigured("galeri") ? (
        <div className="mt-5 border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Upload gambar galeri ke Cloudinary belum lengkap.
          <span className="block pt-1 text-amber-800">
            Key yang belum diisi: {getMissingCloudinaryConfig("galeri").join(", ")}
          </span>
        </div>
      ) : null}

      {syncError ? (
        <div className="mt-5 border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {syncError}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {filteredAlbums.map((album, index) => (
          <article
            key={album.id}
            className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          >
            <button
              type="button"
              onClick={() => setSelectedGaleri(album)}
              className="block w-full text-left"
            >
              <div
                className="flex min-h-44 items-end bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center p-5"
                style={album.imageUrl ? { backgroundImage: `url(${album.imageUrl})` } : undefined}
              >
                <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Galeri {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-5">
                <p className="text-lg font-semibold text-zinc-900">{album.title}</p>
                <p className="mt-2 text-sm text-zinc-500">{album.photos}</p>
                <p className="mt-1 text-sm text-zinc-500">Update: {album.updated}</p>
              </div>
            </button>

            <details className="group/details absolute right-4 top-4 z-10">
              <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full bg-white/92 text-zinc-500 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:text-zinc-900">
                <span className="sr-only">Buka aksi galeri</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </span>
              </summary>

              <div className="absolute right-0 top-12 min-w-40 overflow-hidden border border-zinc-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    setSelectedGaleri(album);
                  }}
                  className="block w-full px-4 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                >
                  Detail
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    setEditingGaleri(album);
                  }}
                  className="block w-full px-4 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    setDeletingGaleri(album);
                  }}
                  className="block w-full px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  Hapus
                </button>
              </div>
            </details>
          </article>
        ))}
      </div>

      {filteredAlbums.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center">
          {isLoading ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <svg className="h-6 w-6 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-700">Memuat galeri...</p>
              <p className="mt-1 text-xs text-zinc-400">Sedang mengambil data dari Firestore</p>
            </>
          ) : searchQuery.trim() ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-700">Galeri tidak ditemukan</p>
              <p className="mt-1 text-xs text-zinc-400">
                Tidak ada galeri dengan judul &quot;{searchQuery.trim()}&quot;. Coba kata kunci lain.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-700">Belum ada foto di galeri</p>
              <p className="mt-1 text-xs text-zinc-400">
                Klik tombol &quot;Tambah Foto&quot; untuk menambahkan foto pertama.
              </p>
            </>
          )}
        </div>
      ) : null}

      <AddGaleriModal
        isOpen={isAddingGaleri}
        onClose={() => setIsAddingGaleri(false)}
        onSave={handleAddGaleri}
      />
      <DetailGaleriModal
        galeri={selectedGaleri}
        isOpen={selectedGaleri !== null}
        onClose={() => setSelectedGaleri(null)}
      />
      <EditGaleriModal
        galeri={editingGaleri}
        isOpen={editingGaleri !== null}
        onClose={() => setEditingGaleri(null)}
        onSave={handleEditGaleri}
      />
      <DeleteGaleriModal
        galeri={deletingGaleri}
        isOpen={deletingGaleri !== null}
        onClose={() => setDeletingGaleri(null)}
        onConfirm={handleDeleteGaleri}
      />
    </>
  );
}
