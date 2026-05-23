import type { ReactNode } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef4ee] text-zinc-900">
      <main className="grid min-h-screen w-full lg:grid-cols-[22rem_minmax(0,1fr)]">
        <AdminSidebar />
        <section className="flex min-h-screen min-w-0 flex-col bg-[#f6f8f5]">
          <AdminTopbar />
          <div className="flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
