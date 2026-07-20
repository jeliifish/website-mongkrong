"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomeBeritaPreview from "@/components/home/HomeBeritaPreview";
import HomeGaleriPreview from "@/components/home/HomeGaleriPreview";
import HomeUmkmPreview from "@/components/home/HomeUmkmPreview";
import HomeStatistik from "@/components/home/HomeStatistik";
import HeroCarousel from "@/components/home/HeroCarousel";
import ScrollReveal from "@/components/ScrollReveal";
import { getFallbackBeritaItems } from "@/lib/berita-public";
import { getFallbackGaleriItems } from "@/lib/galeri-public";
import { getFallbackUmkmItems } from "@/lib/umkm-public";
import { fetchProfilItems, type ProfilItem, fallbackProfilItems } from "@/lib/profil-firestore";

export default function Home() {
  const fallbackBeritaItems = getFallbackBeritaItems();
  const fallbackGaleriItems = getFallbackGaleriItems();
  const fallbackUmkmItems = getFallbackUmkmItems();
  
  const [profileItems, setProfileItems] = useState<ProfilItem[]>(fallbackProfilItems);

  useEffect(() => {
    const loadProfil = async () => {
      const data = await fetchProfilItems();
      setProfileItems(data);
    };
    void loadProfil();
  }, []);

  const sekilas = profileItems.find((x) => x.id === "sekilas") || fallbackProfilItems[0];

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <main>
        <section className="relative min-h-screen overflow-hidden bg-[#223127] text-white">
          <HeroCarousel />
          <Header />

          <div className="relative z-[3] mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 pb-24 pt-36 text-center sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <ScrollReveal animation="fade-down" duration={900} distance={30}>
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
                  Selamat Datang di <span className="text-emerald-400">Dusun Mongkrong</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={300} duration={800}>
                <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/90 sm:text-lg">
                  Pusat informasi resmi Dusun Mongkrong, Kalurahan Sampang, Gedangsari,
                  Gunungkidul. Wadah keterbukaan informasi dan pemberdayaan potensi
                  lokal padukuhan.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={500} duration={800}>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/profil"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-md"
                  >
                    <span>Jelajahi Profil</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/umkm"
                    className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50 shadow-md"
                  >
                    Lihat Produk UMKM
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-[3] h-4 bg-emerald-700" />
        </section>

        <section id="profil" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal animation="fade-up">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Jelajahi Desa
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-emerald-700 sm:text-5xl">
                Profil singkat dan informasi utama.
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={150}>
              <p className="mt-5 text-base leading-8 text-zinc-600 max-w-2xl mx-auto whitespace-pre-wrap">
                {sekilas.description}
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={300}>
              <Link
                href="/profil"
                className="mt-7 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Lihat selengkapnya
              </Link>
            </ScrollReveal>
          </div>
        </section>

        <ScrollReveal animation="fade-up">
          <HomeStatistik />
        </ScrollReveal>

        <section id="berita" className="border-y border-zinc-200 bg-[#f8faf8]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-right">
              <div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Berita
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                    Kabar terbaru dari desa.
                  </h2>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/berita"
                  className="inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Lihat selengkapnya
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <HomeBeritaPreview fallbackItems={fallbackBeritaItems} />
            </ScrollReveal>
          </div>
        </section>

        <section id="galeri" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-left">
            <div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Galeri
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                  Dokumentasi kegiatan warga.
                </h2>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/galeri"
                className="inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Lihat selengkapnya
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <HomeGaleriPreview fallbackItems={fallbackGaleriItems} />
          </ScrollReveal>
        </section>

        <section id="umkm" className="border-t border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <ScrollReveal animation="fade-right">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    UMKM
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                    Produk dan usaha lokal warga.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-zinc-600">
                    Jelajahi berbagai produk dan usaha warga Desa Mongkrong untuk
                    mengenal potensi lokal serta pelaku usaha yang ada di desa.
                  </p>
                  <Link
                    href="/umkm"
                    className="mt-7 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Lihat selengkapnya
                  </Link>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={200}>
                <HomeUmkmPreview fallbackItems={fallbackUmkmItems} />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Peta Lokasi Section */}
        <section id="peta" className="border-t border-zinc-200 bg-[#f8faf8] py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <div className="mb-10 text-center md:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Peta Wilayah
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                  Lokasi Padukuhan Mongkrong
                </h2>
                <p className="mt-3 text-sm text-zinc-500">
                  Kunjungi Padukuhan Mongkrong, Kalurahan Sampang, Kapanewon Gedangsari, Kabupaten Gunungkidul.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="zoom-in" delay={200} duration={800}>
              <div className="w-full h-96 overflow-hidden rounded-[2rem] border border-zinc-200 shadow-sm bg-white p-2">
                <iframe
                  src="https://maps.google.com/maps?q=-7.8156379,110.5647486&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full rounded-[1.75rem]"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
