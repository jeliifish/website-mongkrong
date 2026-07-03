"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchUmkmItemById } from "@/lib/umkm-firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { UmkmItem } from "@/types/umkm";

type PublicUmkmDetailProps = {
  id: string;
  fallbackItem: UmkmItem | null;
};

export default function PublicUmkmDetail({
  id,
  fallbackItem,
}: PublicUmkmDetailProps) {
  const [item, setItem] = useState<UmkmItem | null>(() =>
    isFirebaseConfigured ? null : fallbackItem,
  );
  const [isLoading, setIsLoading] = useState(() => isFirebaseConfigured);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isFirebaseConfigured) {
      return;
    }

    const loadUmkm = async () => {
      setIsLoading(true);

      try {
        const remoteItem = await fetchUmkmItemById(id);

        if (isCancelled) {
          return;
        }

        setItem(remoteItem ?? fallbackItem);
        setSyncError(null);
      } catch {
        if (!isCancelled) {
          setSyncError(
            "Detail UMKM dari Firebase belum bisa dimuat. Menampilkan data yang tersedia.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadUmkm();

    return () => {
      isCancelled = true;
    };
  }, [fallbackItem, id]);

  if (isLoading) {
    return (
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          UMKM Desa
        </p>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Memuat detail UMKM...
        </p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
          UMKM tidak ditemukan
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Data usaha yang kamu cari belum tersedia
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
          Bisa jadi data sudah dihapus, ID tidak cocok, atau koneksi database sedang bermasalah.
        </p>
        <Link
          href="/umkm"
          className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Kembali ke daftar UMKM
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-6 shadow-sm sm:px-10 sm:py-10">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          <span aria-hidden="true">&larr;</span>
          Kembali ke daftar UMKM
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
            Produk Lokal
          </span>
          <span className="text-zinc-400">&middot;</span>
          <span className="text-zinc-500">Pemilik: {item.owner}</span>
        </div>

        <h1 className="mt-5 max-w-5xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          {item.name}
        </h1>
      </section>

      {syncError ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 sm:mt-8">
          {syncError}
        </div>
      ) : null}

      <section className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:gap-8">
        <div className="space-y-6 sm:space-y-8">
          <article className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
            <div
              className="min-h-[18rem] bg-[linear-gradient(180deg,#d7e5d8_0%,#96c498_100%)] bg-cover bg-center sm:min-h-[24rem]"
              style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
            />
            
            <div className="px-6 py-6 sm:px-8 sm:py-8 border-t border-zinc-100">
              <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Tentang Usaha</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 whitespace-pre-line">
                {item.description || "Belum ada deskripsi penjelasan untuk usaha ini."}
              </p>
            </div>
          </article>
        </div>

        <aside className="h-fit rounded-[2rem] border border-zinc-200 bg-white px-5 py-6 shadow-sm sm:px-6 sm:py-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Informasi Usaha
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Nama Usaha
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{item.name}</p>
            </div>

            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Pemilik
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{item.owner}</p>
            </div>

            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Alamat Usaha
              </p>
              <p className="mt-2 text-sm text-zinc-800 leading-6">
                {item.address || "Desa Mongkrong, Kalurahan Sampang"}
              </p>
            </div>

            {item.phone && (
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Nomor WhatsApp
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900">{item.phone}</p>
              </div>
            )}
          </div>

          {item.phone && (
            <a
              href={`https://wa.me/${item.phone.replace(/\D/g, "").replace(/^0/, "62")}?text=Halo%20${encodeURIComponent(item.owner)},%20saya%20tertarik%20dengan%20produk%20UMKM%20"${encodeURIComponent(item.name)}"%20yang%20saya%20lihat%20di%20website%20Desa%20Mongkrong.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 hover:shadow-md active:translate-y-px"
            >
              <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.558 1.874 14.09 .843 11.457.843 6.022.843 1.6 5.263 1.595 10.7c-.001 1.64.43 3.244 1.25 4.67l-.999 3.65 3.73-.978c1.41.77 2.94 1.17 4.47 1.17zM17.75 14.73c-.33-.165-1.954-.964-2.254-1.074-.3-.11-.519-.165-.739.165-.22.33-.85.8-.85.99s-.165.22-.495.055c-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.64-1.953-1.832-2.282-.19-.33-.02-.508.147-.674.15-.15.33-.385.495-.578.165-.19.22-.33.33-.55.11-.22.055-.412-.028-.578-.082-.166-.739-1.78-.964-2.335-.219-.533-.44-.46-.604-.469-.16-.008-.344-.01-.529-.01s-.485.07-.74.344c-.255.275-.975.954-.975 2.329s1.005 2.705 1.145 2.89c.14.185 1.977 3.02 4.79 4.23.67.29 1.192.463 1.6.595.674.214 1.287.184 1.772.112.54-.08 1.954-.8 2.228-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.225-.633-.39z" />
              </svg>
              <span>Hubungi via WhatsApp</span>
            </a>
          )}
        </aside>
      </section>
    </>
  );
}
