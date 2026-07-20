import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicKontakPage from "@/components/kontak/PublicKontakPage";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description:
    "Kirim pesan, pertanyaan, atau masukan kepada perangkat Dusun Mongkrong melalui formulir kontak resmi.",
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f4] text-zinc-900">
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <PublicKontakPage />
      </main>

      <Footer />
    </div>
  );
}
