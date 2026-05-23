"use client";

import { useState } from "react";

import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/Table";

import AddBeritaModal from "./AddBeritaModal";
import DetailBeritaModal from "./DetailBeritaModal";
import DeleteBeritaModal from "./DeleteBeritaModal";
import EditBeritaModal from "./EditBeritaModal";

type BeritaItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  content: string[];
};

type BeritaTableSectionProps = {
  items: BeritaItem[];
};

export default function BeritaTableSection({ items }: BeritaTableSectionProps) {
  const pageSize = 5;
  const [beritaItems, setBeritaItems] = useState(items);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingBerita, setIsAddingBerita] = useState(false);
  const [selectedBerita, setSelectedBerita] = useState<BeritaItem | null>(null);
  const [editingBerita, setEditingBerita] = useState<BeritaItem | null>(null);
  const [deletingBerita, setDeletingBerita] = useState<BeritaItem | null>(null);
  const totalPages = Math.max(1, Math.ceil(beritaItems.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedItems = beritaItems.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize,
  );

  const tableRows = paginatedItems.map((row) => ({
    id: row.id,
    cells: [
      <span key="title" className="font-semibold text-zinc-900">
        {row.title}
      </span>,
      <p key="description" className="max-w-[42rem] leading-7 text-zinc-600">
        {row.description}
      </p>,
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

  const handleSaveEdit = (updatedBerita: BeritaItem) => {
    setBeritaItems((current) =>
      current.map((item) => (item.id === updatedBerita.id ? updatedBerita : item)),
    );
  };

  const handleAddBerita = ({
    title,
    description,
    date,
  }: {
    title: string;
    description: string;
    date: string;
  }) => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedDate = date.trim();

    if (!trimmedTitle || !trimmedDescription || !trimmedDate) {
      return;
    }

    const newItem: BeritaItem = {
      id: `berita-${Date.now()}`,
      title: trimmedTitle,
      description: trimmedDescription,
      date: trimmedDate,
      category: "Informasi Desa",
      author: "Admin Desa",
      content: [trimmedDescription],
    };

    setBeritaItems((current) => [newItem, ...current]);
    setCurrentPage(1);
  };

  const handleDeleteBerita = (id: string) => {
    const nextItems = beritaItems.filter((item) => item.id !== id);

    setBeritaItems(nextItems);
    setSelectedBerita((current) => (current?.id === id ? null : current));
    setEditingBerita((current) => (current?.id === id ? null : current));
    setCurrentPage((current) => Math.min(current, Math.max(1, Math.ceil(nextItems.length / pageSize))));
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col gap-5">
        <div className="border-b border-zinc-200/80 pb-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-center">
            <SearchBar
              placeholder="Cari berita atau pengumuman"
              className="w-full max-w-2xl"
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
        </div>

        <section className="mt-1 flex min-h-0 flex-1 flex-col">
        <Table
          columns={[
            { label: "Judul" },
            { label: "Deskripsi" },
            { label: "Tanggal" },
            { label: "Aksi", className: "text-right" },
          ]}
          rows={tableRows}
          gridTemplate="1.2fr 2.4fr 0.9fr 0.5fr"
          scrollable
          className="h-full"
        />
        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          totalItems={beritaItems.length}
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
