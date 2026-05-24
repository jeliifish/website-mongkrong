"use client";

import { useState, type ReactNode } from "react";

import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
