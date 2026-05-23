import Link from "next/link";
import type { ReactNode } from "react";

type TableColumn = {
  label: string;
  className?: string;
};

type TableAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  tone?: "default" | "danger";
  disabled?: boolean;
};

type TableRow = {
  id: string;
  cells: ReactNode[];
  actions?: TableAction[];
};

type TableProps = {
  columns: TableColumn[];
  rows: TableRow[];
  gridTemplate: string;
  emptyMessage?: string;
  className?: string;
  scrollable?: boolean;
};

export default function Table({
  columns,
  rows,
  gridTemplate,
  emptyMessage = "Data belum tersedia.",
  className = "",
  scrollable = false,
}: TableProps) {
  return (
    <div
      className={`overflow-hidden border border-zinc-200 bg-white ${
        scrollable ? "flex min-h-0 flex-1 flex-col" : ""
      } ${className}`}
    >
      <div
        className={`grid gap-3 border-b border-zinc-200 bg-white px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-zinc-500 ${
          scrollable ? "sticky top-0 z-10 shrink-0" : ""
        }`}
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((column) => (
          <span key={column.label} className={column.className}>
            {column.label}
          </span>
        ))}
      </div>

      <div className={scrollable ? "min-h-0 flex-1 overflow-y-auto" : ""}>
        {rows.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-500">{emptyMessage}</div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="grid gap-3 border-b border-zinc-100 px-6 py-5 text-sm transition hover:bg-[#f8fbf7] last:border-b-0"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {row.cells.map((cell, index) => (
                <div key={`${row.id}-${index}`}>{cell}</div>
              ))}
              <div className="flex justify-end">
                <details className="group relative">
                  <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900">
                    <span className="sr-only">Buka aksi</span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                  </summary>

                  <div className="absolute right-0 top-12 z-10 min-w-40 overflow-hidden border border-zinc-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                    {(row.actions ?? []).map((action) =>
                      action.href ? (
                        <Link
                          key={action.label}
                          href={action.href}
                          className={`block px-4 py-3 text-sm transition ${
                            action.tone === "danger"
                              ? "text-rose-600 hover:bg-rose-50"
                              : "text-zinc-700 hover:bg-zinc-50"
                          }`}
                        >
                          {action.label}
                        </Link>
                      ) : (
                        <button
                          key={action.label}
                          type="button"
                          disabled={action.disabled}
                          onClick={(event) => {
                            event.currentTarget
                              .closest("details")
                              ?.removeAttribute("open");
                            action.onClick?.();
                          }}
                          className={`block w-full px-4 py-3 text-left text-sm transition ${
                            action.disabled
                              ? "cursor-not-allowed text-zinc-400"
                              : action.tone === "danger"
                                ? "text-rose-600 hover:bg-rose-50"
                                : "text-zinc-700 hover:bg-zinc-50"
                          }`}
                        >
                          {action.label}
                        </button>
                      ),
                    )}
                  </div>
                </details>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
