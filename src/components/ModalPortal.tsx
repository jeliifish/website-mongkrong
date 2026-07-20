"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalPortalProps = {
  children: ReactNode;
};

export default function ModalPortal({ children }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}
