"use client";

import { usePathname } from "next/navigation";
import { adminNavigation } from "@/components/adminNavigation";

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const pathname = usePathname();
  const current =
    adminNavigation.find((item) => item.href === pathname) ?? adminNavigation[0];
  const adminLabel = "Admin Desa";
  const adminInitials = "AD";

  return (
    <header className="border-b border-zinc-200 bg-white lg:sticky lg:top-0 lg:z-10">
      <div className="grid min-h-24 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="px-5 py-5 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-start justify-between gap-4 lg:mb-0 lg:block">
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-11 items-center gap-3 rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
              Menu Admin
            </button>

            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1f7a4a_0%,#39a86c_100%)] text-xs font-semibold text-white shadow-[0_10px_24px_rgba(31,122,74,0.18)]">
                {adminInitials}
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-zinc-900">{adminLabel}</p>
                <p className="text-[0.72rem] text-zinc-500">Pengelola Website</p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            {current.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{current.subtitle}</p>
        </div>

        <div className="hidden border-t border-zinc-200 px-5 py-4 sm:px-6 lg:block lg:border-l lg:border-t-0 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1f7a4a_0%,#39a86c_100%)] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(31,122,74,0.18)]">
              {adminInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                {adminLabel}
              </p>
              <p className="text-sm text-zinc-500">Pengelola Website</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
