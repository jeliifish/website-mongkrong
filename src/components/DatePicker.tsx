"use client";

import { useEffect, useRef, useState } from "react";

const indonesianFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const monthTitleFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
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
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            return;
          }

          openCalendar();
        }}
        className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf9_100%)] px-4 py-3 text-left transition hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
      >
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-900">
            {value || "Pilih tanggal publikasi"}
          </p>
          <p className="text-xs text-zinc-500">
            {value ? "Tanggal berita yang akan ditampilkan" : "Buka kalender untuk memilih tanggal"}
          </p>
        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
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
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+0.65rem)] z-30 w-[19rem] max-w-full rounded-[1.4rem] border border-zinc-200 bg-white p-3 shadow-[0_20px_52px_rgba(15,23,42,0.14)]">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Pilih tanggal
              </p>
              <p className="mt-1 text-[0.95rem] font-semibold text-zinc-950">
                {monthTitleFormatter.format(visibleMonth)}
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

          <div className="grid grid-cols-7 gap-0.5 text-center text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {weekDays.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-0.5">
            {calendarDays.map((date) => {
              const isSelected = selectedDate ? isSameDate(date, selectedDate) : false;
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
              const isToday = isSameDate(date, today);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => selectDate(date)}
                  className={`flex h-8 items-center justify-center rounded-lg text-[0.92rem] font-medium transition ${
                    isSelected
                      ? "bg-emerald-700 text-white shadow-[0_12px_24px_rgba(4,120,87,0.22)]"
                      : isCurrentMonth
                        ? "text-zinc-800 hover:bg-emerald-50"
                        : "text-zinc-300 hover:bg-zinc-50"
                  } ${isToday && !isSelected ? "ring-1 ring-emerald-200" : ""}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="text-xs font-medium text-zinc-500 transition hover:text-zinc-900"
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
      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-3 w-3"
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

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return stripTime(new Date(`${value}T00:00:00`));
  }

  const [day, monthName, year] = value.trim().split(/\s+/);
  const month = monthMap[monthName?.toLowerCase() ?? ""];

  if (!day || !month || !year) {
    return null;
  }

  return stripTime(new Date(`${year}-${month}-${day.padStart(2, "0")}T00:00:00`));
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
