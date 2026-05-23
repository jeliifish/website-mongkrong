import ProfilSection from "@/components/profil/ProfilSection";

const sections = [
  {
    id: "profil-1",
    title: "Sejarah Desa",
    description:
      "Bagian ini dapat diedit untuk menyesuaikan informasi terbaru yang ingin ditampilkan di website desa.",
  },
  {
    id: "profil-2",
    title: "Visi dan Misi",
    description:
      "Bagian ini dapat diedit untuk menyesuaikan informasi terbaru yang ingin ditampilkan di website desa.",
  },
  {
    id: "profil-3",
    title: "Sambutan Kepala Desa",
    description:
      "Bagian ini dapat diedit untuk menyesuaikan informasi terbaru yang ingin ditampilkan di website desa.",
  },
  {
    id: "profil-4",
    title: "Potensi Unggulan",
    description:
      "Bagian ini dapat diedit untuk menyesuaikan informasi terbaru yang ingin ditampilkan di website desa.",
  },
];

export default function AdminProfilPage() {
  return <ProfilSection items={sections} />;
}
