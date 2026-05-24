"use client";

import { startTransition, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { missingFirebaseConfigKeys } from "@/lib/firebase";

export default function AdminAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, isConfigured } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      startTransition(() => {
        router.replace("/login");
      });
    }
  }, [loading, router, user]);

  if (!isConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef4ee] px-6 text-zinc-900">
        <div className="max-w-xl rounded-[2rem] border border-amber-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Firebase belum siap
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
            Konfigurasi Firebase masih kurang
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Isi environment variable berikut dulu agar login admin bisa
            dipakai: {missingFirebaseConfigKeys.join(", ")}.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Kembali ke login
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef4ee] px-6 text-zinc-900">
        <div className="rounded-[2rem] border border-zinc-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Admin
          </p>
          <p className="mt-3 text-lg font-medium text-zinc-900">
            Memeriksa sesi login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
