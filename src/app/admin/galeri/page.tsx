import GaleriSection from "@/components/galeri/GaleriSection";

const albums = [
  { id: "galeri-1", title: "Pelatihan UMKM Mei", photos: "18 foto", updated: "24 Mei 2026" },
  { id: "galeri-2", title: "Kerja Bakti RW 03", photos: "12 foto", updated: "23 Mei 2026" },
  { id: "galeri-3", title: "Posyandu Balita", photos: "9 foto", updated: "21 Mei 2026" },
];

export default function AdminGaleriPage() {
  return <GaleriSection items={albums} />;
}
