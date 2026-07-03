import Link from "next/link";
import type { PemetaanItem } from "@/lib/pemetaan";

type PublicPemetaanDetailProps = {
  item: PemetaanItem | undefined;
};

export default function PublicPemetaanDetail({ item }: PublicPemetaanDetailProps) {
  if (!item) {
    return (
      <section className="rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Peta tidak ditemukan
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Peta yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          href="/pemetaan"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Pemetaan
        </Link>
      </section>
    );
  }

  return (
    <div>
      <Link
        href="/pemetaan"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Kembali ke Pemetaan
      </Link>

      <section className="mt-5 overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {item.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600">
            {item.summary}
          </p>

          {item.lastUpdated ? (
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Data diperbarui {item.lastUpdated}
            </div>
          ) : null}

          <div className="mt-8 space-y-8 border-t border-zinc-100 pt-8">
            {item.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {section.heading}
                </h2>
                <ul className="mt-3 space-y-2">
                  {section.body.map((paragraph, index) => (
                    <li
                      key={index}
                      className="flex gap-2.5 text-sm leading-7 text-zinc-600"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-emerald-600" />
                      <span>{paragraph}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
