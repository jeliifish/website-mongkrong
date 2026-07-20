"use client";

import { useEffect, useState } from "react";
import type { KontakInfo } from "@/types/kontak";
import {
  fetchKontakInfo,
  createPesan,
  fallbackKontakInfo,
} from "@/lib/kontak-firestore";

export default function PublicKontakPage() {
  const [kontakInfo, setKontakInfo] = useState<KontakInfo>(fallbackKontakInfo);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [subjek, setSubjek] = useState("");
  const [pesan, setPesan] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const info = await fetchKontakInfo();
      setKontakInfo(info);
    };
    void load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim()) return;

    setIsSending(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createPesan({
        nama: nama.trim(),
        email: email.trim(),
        subjek: subjek.trim(),
        pesan: pesan.trim(),
      });
      setNama("");
      setEmail("");
      setSubjek("");
      setPesan("");
      setSuccessMessage("Pesan Anda berhasil dikirim! Terima kasih.");
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      setErrorMessage("Gagal mengirim pesan. Silakan coba lagi nanti.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Hubungi Kami
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-zinc-600">
          Punya pertanyaan atau masukan untuk Dusun Mongkrong? Jangan ragu untuk
          mengirim pesan kepada kami melalui formulir di bawah ini.
        </p>
      </div>

      {/* Content Grid */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Left — Info Cards */}
        <div className="flex flex-col gap-4">
          {/* Alamat */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Alamat Balai</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600 whitespace-pre-wrap">
                  {kontakInfo.alamat || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Telepon */}
          {kontakInfo.telepon && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Nomor Telepon</p>
                  <p className="mt-1 text-sm text-zinc-600">+{kontakInfo.telepon}</p>
                  <p className="text-xs text-zinc-400">Senin – Jumat, 08.00 – 15.00 WIB</p>
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          {kontakInfo.email && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Surel Resmi</p>
                  <p className="mt-1 text-sm text-zinc-600">{kontakInfo.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right — Form */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Kirim Pesan
          </h2>

          {successMessage && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Budi Pratama"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@example.com"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Subjek Pesan
              </label>
              <input
                type="text"
                value={subjek}
                onChange={(e) => setSubjek(e.target.value)}
                placeholder="Contoh: Pertanyaan UMKM"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Isi Pesan
              </label>
              <textarea
                required
                rows={5}
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Ketikkan pesan atau masukan Anda di sini..."
                className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {isSending ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
