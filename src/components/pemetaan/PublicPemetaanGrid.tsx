import Link from "next/link";
import type { PemetaanItem } from "@/lib/pemetaan";

type PublicPemetaanGridProps = {
  items: PemetaanItem[];
};

export default function PublicPemetaanGrid({ items }: PublicPemetaanGridProps) {
  return (
    <section className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/pemetaan/${item.slug}`}
          className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-900/5 transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              {item.category}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              {item.title}
            </h2>
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-zinc-600">
              {item.summary}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              Lihat detail peta
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
