"use client";

import type { ReactNode } from "react";

export default function PublicTemplate({ children }: { children: ReactNode }) {
  return <div className="animate-page-enter">{children}</div>;
}
