import type { ReactNode } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  itemLabel?: string;
  className?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50],
  onPageChange,
  onPageSizeChange,
  itemLabel = "data",
  className = "",
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = buildPages(currentPage, totalPages);

  return (
    <div className={`flex flex-col gap-3 pt-4 pb-2 sm:flex-row sm:items-center sm:justify-between border-t border-zinc-100 ${className}`}>
      {/* Left side: Item Count & Page Size Dropdown */}
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-500">
        <span>
          {totalItems === 0
            ? `Belum ada ${itemLabel}.`
            : `Menampilkan ${startItem}-${endItem} dari ${totalItems} ${itemLabel}`}
        </span>

        {onPageSizeChange && totalItems > 0 && (
          <div className="flex items-center gap-1.5 border-l border-zinc-200 pl-3">
            <span>Tampilkan</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-bold text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span>per halaman</span>
          </div>
        )}
      </div>

      {/* Right side: Page Buttons */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <PaginationButton
          label="Sebelumnya"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <path d="m14 6-6 6 6 6" />
        </PaginationButton>

        <div className="flex items-center gap-1.5">
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <span key={`${page}-${index}`} className="px-1 text-xs text-zinc-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-xs font-bold transition cursor-pointer ${
                  page === currentPage
                    ? "bg-emerald-600 text-white shadow-sm"
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
          disabled={currentPage >= totalPages}
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
      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
