"use client";

import { useEffect, useRef, useState } from "react";

const indonesianFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const monthTitleFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
});

const monthMap: Record<string, string> = {
  januari: "01",
  februari: "02",
  maret: "03",
  april: "04",
  mei: "05",
  juni: "06",
  juli: "07",
  agustus: "08",
  september: "09",
  oktober: "10",
  november: "11",
  desember: "12",
};

const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function DatePicker({
  value,
  onChange,
  className = "",
}: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDisplayDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(selectedDate ?? new Date()),
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const calendarDays = buildCalendarDays(visibleMonth);
  const today = stripTime(new Date());

  const openCalendar = () => {
    setVisibleMonth(startOfMonth(selectedDate ?? new Date()));
    setIsOpen(true);
  };

  const selectDate = (date: Date) => {
    onChange(indonesianFormatter.format(date));
    setVisibleMonth(startOfMonth(date));
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            return;
          }

          openCalendar();
        }}
        className={`group flex min-h-14 w-full cursor-pointer items-center justify-between rounded-2xl border bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf9_100%)] px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 ${
          isOpen
            ? "border-zinc-300 bg-white"
            : "border-zinc-200 hover:border-zinc-300"
        }`}
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-900">
            {value || "Pilih tanggal publikasi"}
          </p>
          <p className="text-xs text-zinc-500">
            {value
              ? "Klik area ini atau ikon kalender untuk mengganti tanggal"
              : "Klik area ini untuk membuka kalender dan memilih tanggal"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-600 sm:block">
            {isOpen ? "Kalender aktif" : "Pilih tanggal"}
          </div>

          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M3 10h18" />
              <rect x="3" y="4" width="18" height="17" rx="2" />
            </svg>
          </span>

          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`hidden h-4 w-4 text-zinc-400 transition sm:block ${
              isOpen ? "rotate-180 text-zinc-600" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+0.75rem)] z-30 w-[22rem] max-w-full rounded-[1.6rem] border border-zinc-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Pilih tanggal
              </p>
              <p className="text-[1rem] font-semibold text-zinc-950">
                {monthTitleFormatter.format(visibleMonth)}
              </p>
              <p className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                {value ? `Dipilih: ${value}` : "Belum ada tanggal dipilih"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <IconButton
                label="Bulan sebelumnya"
                onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
              >
                <path d="m14 6-6 6 6 6" />
              </IconButton>
              <IconButton
                label="Bulan berikutnya"
                onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
              >
                <path d="m10 6 6 6-6 6" />
              </IconButton>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {weekDays.map((day) => (
              <span key={day} className="py-1.5">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1 rounded-2xl bg-zinc-50/80 p-2">
            {calendarDays.map((date) => {
              const isSelected = selectedDate ? isSameDate(date, selectedDate) : false;
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
              const isToday = isSameDate(date, today);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectDate(date)}
                  className={`flex h-10 items-center justify-center rounded-xl text-[0.92rem] font-semibold transition ${
                    isSelected
                      ? "bg-emerald-700 text-white shadow-[0_12px_24px_rgba(4,120,87,0.22)]"
                      : isCurrentMonth
                        ? "cursor-pointer bg-white text-zinc-800 hover:bg-emerald-50"
                        : "cursor-pointer text-zinc-300 hover:bg-white"
                  } ${isToday && !isSelected ? "ring-1 ring-emerald-200" : ""}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Kosongkan
            </button>
            <button
              type="button"
              onClick={() => selectDate(today)}
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              Hari ini
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type IconButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-emerald-300 hover:text-zinc-900"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
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

function parseDisplayDate(value: string) {
  if (!value) {
    return null;
  }

  const isoMatch = value.match(isoDatePattern);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return createLocalDate(Number(year), Number(month) - 1, Number(day));
  }

  const [day, monthName, year] = value.trim().split(/\s+/);
  const month = monthMap[monthName?.toLowerCase() ?? ""];

  if (!day || !month || !year) {
    return null;
  }

  return createLocalDate(Number(year), Number(month) - 1, Number(day));
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function createLocalDate(year: number, monthIndex: number, day: number) {
  return new Date(year, monthIndex, day);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(monthDate: Date) {
  const firstDay = startOfMonth(monthDate);
  const firstWeekday = firstDay.getDay();
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return stripTime(date);
  });
}
