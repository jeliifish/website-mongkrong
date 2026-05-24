import type { ReactNode } from "react";
import AdminAuthGate from "@/components/AdminAuthGate";
import AdminShell from "@/components/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGate>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  );
}
