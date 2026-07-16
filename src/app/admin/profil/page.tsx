import ProfilSection from "@/components/profil/ProfilSection";

const sections = [
  {
    id: "sekilas",
    title: "Sekilas Tentang Mongkrong",
    description:
      "Loading deskripsi sekilas tentang Mongkrong...",
  },
];

export default function AdminProfilPage() {
  return <ProfilSection items={sections} />;
}
