import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Padukuhan Mongkrong - Kalurahan Sampang, Gedangsari",
    template: "%s | Padukuhan Mongkrong"
  },
  description: "Website resmi informasi kependudukan, berita, galeri, pemetaan lahan, dan potensi UMKM Padukuhan Mongkrong, Kalurahan Sampang, Gedangsari, Gunungkidul.",
  keywords: ["Padukuhan Mongkrong", "Desa Mongkrong", "Sampang", "Gedangsari", "Gunungkidul", "UMKM Mongkrong", "Profil Padukuhan"],
  authors: [{ name: "KKN Padukuhan Mongkrong" }],
  openGraph: {
    title: "Padukuhan Mongkrong - Kalurahan Sampang",
    description: "Portal informasi resmi kependudukan, profil wilayah, pemetaan lahan, berita kegiatan, dan UMKM Padukuhan Mongkrong.",
    url: "https://website-mongkrong.vercel.app",
    siteName: "Padukuhan Mongkrong",
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
