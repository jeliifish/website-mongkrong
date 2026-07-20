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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("logoUpdated", handleLogoUpdate);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isSolid = !isHomePage || isScrolled;

  const headerClass = isSolid
    ? "fixed inset-x-0 top-0 z-50 border-b border-emerald-900/30 bg-[#173b2a]/95 text-white shadow-lg backdrop-blur-md transition-all duration-300 py-3 sm:py-4"
    : "fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/75 via-black/35 to-transparent text-white transition-all duration-300 py-4 sm:py-5";

  const brandSubtextClass = isSolid ? "text-emerald-100/80" : "text-white/85";

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white group">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo Padukuhan" className="h-11 w-auto max-w-11 object-contain transition group-hover:scale-105" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[0.68rem] font-bold tracking-[0.18em] text-emerald-800 shadow-sm transition group-hover:scale-105">
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-white/18 text-white shadow-sm font-bold"
                    : "text-emerald-50/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="ml-3 rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10 shadow-sm"
          >
            Login
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:hidden cursor-pointer"
        >
          <span className="sr-only">Buka navigasi</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div id="mobile-menu" className="mx-4 mt-3 rounded-2xl border border-white/15 bg-[#143525]/95 px-4 py-4 text-white shadow-xl backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1.5">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active ? "bg-white/18 text-white font-bold" : "text-emerald-50 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-xl border border-white/30 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
