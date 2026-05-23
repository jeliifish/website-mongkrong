import UmkmTableSection from "@/components/umkm/UmkmTableSection";

const businesses = [
  { id: "umkm-1", name: "Kripik Singkong Rumahan", owner: "Bu Sari" },
  { id: "umkm-2", name: "Kerajinan Anyaman Bambu", owner: "Pak Rono" },
  { id: "umkm-3", name: "Jasa Katering Warga", owner: "Bu Tini" },
];

export default function AdminUmkmPage() {
  return <UmkmTableSection items={businesses} />;
}
