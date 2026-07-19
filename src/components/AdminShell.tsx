"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile, loading } = useAuth();

  // Route Guard Logic
  let hasAccess = true;
  if (!loading && profile) {
    if (pathname === "/admin/pengguna") {
      hasAccess = profile.role === "Super Admin";
    } else if (pathname.startsWith("/admin/")) {
      const moduleKey = pathname.replace("/admin/", "");
      if (
        moduleKey === "berita" ||
        moduleKey === "galeri" ||
        moduleKey === "profil" ||
        moduleKey === "umkm"
      ) {
        hasAccess =
          profile.role === "Super Admin" ||
          profile.permissions[moduleKey as keyof typeof profile.permissions] === true;
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#eef4ee] text-zinc-900 lg:h-screen lg:overflow-hidden">
      <main className="grid min-h-screen w-full lg:h-full lg:min-h-0 lg:grid-cols-[22rem_minmax(0,1fr)] lg:overflow-hidden">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <section className="flex min-h-screen min-w-0 flex-col bg-[#f6f8f5] lg:h-full lg:min-h-0 lg:overflow-y-auto">
          <AdminTopbar onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
            {!hasAccess ? (
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-[0_12px_24px_rgba(225,29,72,0.1)]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
                  Akses Halaman Ditolak
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
                  Peran Anda adalah <strong className="text-zinc-800">{profile?.role}</strong>. Akun Anda tidak diberikan izin oleh Super Admin untuk mengelola modul ini.
                </p>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-zinc-800 transition"
                  >
                    Kembali ke Halaman Sebelumnya
                  </button>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
