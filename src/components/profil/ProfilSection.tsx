"use client";

import { useState } from "react";

import EditProfilModal from "@/components/profil/EditProfilModal";

type ProfilItem = {
  id: string;
  title: string;
  description: string;
};

type ProfilSectionProps = {
  items: ProfilItem[];
};

export default function ProfilSection({ items }: ProfilSectionProps) {
  const [sections, setSections] = useState(items);
  const [editingItem, setEditingItem] = useState<ProfilItem | null>(null);

  const handleSave = (updatedItem: ProfilItem) => {
    setSections((current) =>
      current.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
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

      <EditProfilModal
        item={editingItem}
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
      />
    </>
  );
}
