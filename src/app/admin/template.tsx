"use client";

import type { ReactNode } from "react";

export default function AdminTemplate({ children }: { children: ReactNode }) {
  return <div className="animate-page-enter flex-1">{children}</div>;
}
