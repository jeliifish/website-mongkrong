"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { adminNavigation } from "@/components/adminNavigation";
import { auth } from "@/lib/firebase";

export default function AdminSidebar() {
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
    <aside className="flex flex-col border-b border-zinc-200 bg-white lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="px-6 py-6 lg:px-7 lg:py-7">
        <Link
          href="/"
          className="flex items-center gap-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1f7a4a_0%,#39a86c_100%)] text-lg font-semibold text-white shadow-[0_14px_30px_rgba(31,122,74,0.18)]">
            DM
          </div>
          <div>
            <p className="text-[1.05rem] font-semibold tracking-tight text-zinc-950">
              Desa Mongkrong
            </p>
            <p className="text-sm text-zinc-500">Panel pengelolaan website</p>
          </div>
        </Link>
      </div>

      <div className="border-t border-zinc-200 px-4 py-6 lg:px-5">
        <nav className="space-y-2">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
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

      <div className="mt-auto border-t border-zinc-200 px-6 py-6 lg:px-7">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isSigningOut}
          className="inline-flex items-center gap-3 text-sm font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50"
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
  );
}
