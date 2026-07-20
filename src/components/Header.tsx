"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Berita", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
  { label: "UMKM", href: "/umkm" },
  { label: "Pemetaan", href: "/pemetaan" },
  { label: "Kontak", href: "/kontak" },
];

type HeaderProps = {
  variant?: "overlay" | "solid";
};

export default function Header({ variant = "overlay" }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const isOverlay = variant === "overlay";

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const { fetchLogoConfig } = await import("@/lib/profil-firestore");
        const config = await fetchLogoConfig();
        if (config && config.imageUrl) {
          setLogoUrl(config.imageUrl);
        }
      } catch (err) {
        console.error("Gagal load logo di Header:", err);
      }
    };
    void loadLogo();

    const handleLogoUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      setLogoUrl(customEvent.detail || null);
    };
    window.addEventListener("logoUpdated", handleLogoUpdate);

    if (!isOverlay) {
      return () => {
        window.removeEventListener("logoUpdated", handleLogoUpdate);
      };
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("logoUpdated", handleLogoUpdate);
    };
  }, [isOverlay]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const useSolidTheme = !isOverlay || isScrolled;
  const headerClass = useSolidTheme
    ? "fixed inset-x-0 top-0 z-50 border-b border-emerald-950/15 bg-[#173b2a]/95 text-white shadow-sm backdrop-blur"
    : "fixed inset-x-0 top-0 z-50 text-white";
  const brandTextClass = "text-white";
  const brandSubtextClass = useSolidTheme ? "text-emerald-100/80" : "text-white/85";
  const activeNavClass = useSolidTheme
    ? "bg-white/12 text-white"
    : "bg-white/12 text-white";
  const inactiveNavClass = useSolidTheme
    ? "text-emerald-50 hover:text-white"
    : "text-white hover:text-white/75";
  const loginButtonClass = useSolidTheme
    ? "border-white/20 text-white hover:bg-white/10"
    : "border-white/55 text-white hover:bg-white/10";
  const mobileButtonClass = useSolidTheme
    ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
    : "border-white/40 bg-white/10 text-white hover:bg-white/15";
  const mobileMenuClass = useSolidTheme
    ? "mx-4 rounded-2xl border border-white/10 bg-[#163423] px-4 py-4 text-white shadow-lg backdrop-blur md:hidden"
    : "mx-4 rounded-2xl border border-white/15 bg-[#10361f]/92 px-4 py-4 text-white shadow-lg backdrop-blur md:hidden";
  const mobileActiveClass = useSolidTheme
    ? "bg-white/12 text-white"
    : "bg-white/14 text-white";
  const mobileInactiveClass = useSolidTheme
    ? "text-emerald-50 hover:bg-white/10"
    : "text-white hover:bg-white/10";
  const mobileLoginClass = useSolidTheme
    ? "border-white/15 text-white hover:bg-white/10"
    : "border-white/30 text-white hover:bg-white/10";

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className={`flex items-center gap-3 ${brandTextClass}`}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo Padukuhan" className="h-11 w-auto max-w-11 object-contain" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[0.68rem] font-bold tracking-[0.18em] text-emerald-800 shadow-sm">
              PM
            </div>
          )}
          <div>
            <p className="text-xl font-semibold leading-tight tracking-tight">
              Padukuhan Mongkrong
            </p>
            <p className={`text-sm ${brandSubtextClass}`}>
              Kalurahan Sampang
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition-all duration-300 ease-out ${
                isActive(item.href) ? activeNavClass : inactiveNavClass
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${loginButtonClass}`}
          >
            Login
          </Link>
        </nav>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition md:hidden ${mobileButtonClass}`}
        >
          <span className="sr-only">Buka navigasi</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {isOpen ? (
        <div id="mobile-menu" className={mobileMenuClass}>
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(item.href) ? mobileActiveClass : mobileInactiveClass
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className={`mt-2 rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${mobileLoginClass}`}
            >
              Login
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
