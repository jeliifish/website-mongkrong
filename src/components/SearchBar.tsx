type SearchBarProps = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function SearchBar({
  placeholder = "Cari data",
  className = "",
  value,
  onChange,
}: SearchBarProps) {
  return (
    <label
      className={`flex h-12 items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-500 transition focus-within:border-emerald-400 focus-within:text-zinc-700 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-zinc-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>

      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
      />
    </label>
  );
}
