"use client";

import { useState } from "react";

import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/Table";
import AddUmkmModal from "@/components/umkm/AddUmkmModal";
import DeleteUmkmModal from "@/components/umkm/DeleteUmkmModal";
import DetailUmkmModal from "@/components/umkm/DetailUmkmModal";
import EditUmkmModal from "@/components/umkm/EditUmkmModal";

type UmkmItem = {
  id: string;
  name: string;
  owner: string;
  imageUrl?: string;
  fileName?: string;
};

type UmkmTableSectionProps = {
  items: UmkmItem[];
};

export default function UmkmTableSection({ items }: UmkmTableSectionProps) {
  const pageSize = 5;
  const [umkmItems, setUmkmItems] = useState(items);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingUmkm, setIsAddingUmkm] = useState(false);
  const [selectedUmkm, setSelectedUmkm] = useState<UmkmItem | null>(null);
  const [editingUmkm, setEditingUmkm] = useState<UmkmItem | null>(null);
  const [deletingUmkm, setDeletingUmkm] = useState<UmkmItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleAddUmkm = ({
    name,
    owner,
    file,
  }: {
    name: string;
    owner: string;
    file: File | null;
  }) => {
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
  };

  const handleEditUmkm = (updatedUmkm: UmkmItem & { file?: File | null }) => {
    setUmkmItems((current) =>
      current.map((item) =>
        item.id === updatedUmkm.id
          ? {
              ...updatedUmkm,
              imageUrl: updatedUmkm.file ? URL.createObjectURL(updatedUmkm.file) : item.imageUrl,
              fileName: updatedUmkm.file ? updatedUmkm.file.name : item.fileName,
            }
          : item,
      ),
    );
  };

  const handleDeleteUmkm = (id: string) => {
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
