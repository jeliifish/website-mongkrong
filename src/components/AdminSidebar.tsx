"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { adminNavigation } from "@/components/adminNavigation";
import { auth } from "@/lib/firebase";

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);

    try {
      if (auth) {
        await signOut(auth);
      }
    } finally {
      startTransition(() => {
        router.replace("/login");
      });
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-zinc-950/35 transition lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm flex-col border-r border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] transition-transform duration-200 lg:static lg:w-auto lg:max-w-none lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6 lg:px-7 lg:py-7">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={onClose}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1f7a4a_0%,#39a86c_100%)] text-base font-semibold text-white shadow-[0_14px_30px_rgba(31,122,74,0.18)] lg:h-14 lg:w-14 lg:text-lg">
              DM
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight text-zinc-950 lg:text-[1.05rem]">
                Desa Mongkrong
              </p>
              <p className="text-sm text-zinc-500">Panel pengelolaan website</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 lg:hidden"
          >
            <span className="sr-only">Tutup sidebar</span>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6 18 18" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="border-t border-zinc-200 px-4 py-5 lg:px-5 lg:py-6">
          <nav className="space-y-2">
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[linear-gradient(135deg,#1f7a4a_0%,#39a86c_100%)] text-white shadow-[0_14px_30px_rgba(31,122,74,0.2)]"
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`text-[0.62rem] uppercase tracking-[0.22em] ${
                      isActive ? "text-white/80" : "text-zinc-400"
                    }`}
                  >
                    {isActive ? "ON" : ""}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-zinc-200 px-5 py-5 sm:px-6 lg:px-7 lg:py-6">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto lg:justify-start lg:border-0 lg:bg-transparent lg:px-0 lg:py-0"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-white lg:h-10 lg:w-10 lg:bg-rose-50"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </span>
            {isSigningOut ? "Logout..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
