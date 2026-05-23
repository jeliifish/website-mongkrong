type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-4 border border-t-0 border-zinc-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-500">
        {totalItems === 0
          ? "Belum ada berita."
          : `Menampilkan ${startItem}-${endItem} dari ${totalItems} berita`}
      </p>

      <div className="flex items-center gap-2">
        <PaginationButton
          label="Sebelumnya"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <path d="m14 6-6 6 6 6" />
        </PaginationButton>

        <div className="flex items-center gap-2">
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <span key={`${page}-${index}`} className="px-1 text-sm text-zinc-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                  page === currentPage
                    ? "bg-emerald-700 text-white shadow-[0_10px_24px_rgba(31,122,74,0.22)]"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <PaginationButton
          label="Berikutnya"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <path d="m10 6 6 6-6 6" />
        </PaginationButton>
      </div>
    </div>
  );
}

type PaginationButtonProps = {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
};

function PaginationButton({
  label,
  disabled,
  onClick,
  children,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </button>
  );
}

function buildPages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [1, "ellipsis", currentPage, "ellipsis", totalPages] as const;
}
import type { ReactNode } from "react";
