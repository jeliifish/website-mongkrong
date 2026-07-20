import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Desa Mongkrong - Kalurahan Sampang, Gedangsari",
    template: "%s | Desa Mongkrong"
  },
  description: "Website resmi informasi kependudukan, berita, galeri, pemetaan lahan, dan potensi UMKM Padukuhan Mongkrong, Kalurahan Sampang, Gedangsari, Gunungkidul.",
  keywords: ["Desa Mongkrong", "Padukuhan Mongkrong", "Sampang", "Gedangsari", "Gunungkidul", "UMKM Mongkrong", "Profil Desa"],
  authors: [{ name: "KKN Desa Mongkrong" }],
  openGraph: {
    title: "Desa Mongkrong - Kalurahan Sampang",
    description: "Portal informasi resmi kependudukan, profil wilayah, pemetaan lahan, berita kegiatan, dan UMKM Desa Mongkrong.",
    url: "https://website-mongkrong.vercel.app",
    siteName: "Desa Mongkrong",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
