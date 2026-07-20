"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const heroImages = [
  { src: "/hero/hero-1.jpg", alt: "Pemandangan sawah Desa Mongkrong saat matahari terbit" },
  { src: "/hero/hero-2.jpg", alt: "Hamparan pertanian dan perbukitan Desa Mongkrong" },
  { src: "/hero/hero-3.jpg", alt: "Kegiatan warga bermain voli di Desa Mongkrong" },
  { src: "/hero/hero-4.jpg", alt: "Suasana sore di area pertanian Desa Mongkrong" },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 900);
    },
    [current, isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % heroImages.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + heroImages.length) % heroImages.length);
  }, [current, goTo]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <>
      {/* Background images */}
      {heroImages.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            zIndex: i === current ? 1 : 0,
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(180deg, rgba(18,24,20,0.35) 0%, rgba(18,24,20,0.5) 40%, rgba(18,24,20,0.7) 100%)",
        }}
      />

      {/* Navigation arrows */}
      <button
        onClick={prev}
        aria-label="Foto sebelumnya"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/80 backdrop-blur-sm transition hover:bg-black/50 hover:text-white sm:left-6 sm:p-3"
        style={{ zIndex: 10 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Foto berikutnya"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/80 backdrop-blur-sm transition hover:bg-black/50 hover:text-white sm:right-6 sm:p-3"
        style={{ zIndex: 10 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2"
        style={{ zIndex: 10 }}
      >
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Lihat foto ${i + 1}`}
            className="group relative h-2.5 rounded-full transition-all duration-300"
            style={{
              width: i === current ? "2rem" : "0.625rem",
              backgroundColor: i === current ? "white" : "rgba(255,255,255,0.45)",
            }}
          >
            <span className="sr-only">Foto {i + 1}</span>
          </button>
        ))}
      </div>
    </>
  );
}
