import BeritaTableSection from "@/components/berita/BeritaTableSection";

const beritaRows = [
  {
    id: "berita-1",
    title: "Kerja Bakti Lingkungan RW 03",
    description:
      "Warga bergotong royong membersihkan jalan desa dan saluran air menjelang musim hujan.",
    date: "24 Mei 2026",
    category: "Lingkungan",
    author: "Admin Desa",
    content: [
      "Kegiatan kerja bakti lingkungan dilaksanakan bersama warga RW 03 pada Minggu pagi untuk membersihkan jalan utama desa, parit, dan area sekitar balai pertemuan.",
      "Selain menjaga kebersihan lingkungan, kegiatan ini juga menjadi ruang koordinasi warga untuk menyiapkan antisipasi banjir saat curah hujan mulai meningkat dalam beberapa pekan ke depan.",
      "Pemerintah desa mengimbau agar jadwal gotong royong serupa terus dijaga secara berkala supaya kondisi lingkungan tetap rapi, sehat, dan aman bagi seluruh warga.",
    ],
  },
  {
    id: "berita-2",
    title: "Pelatihan Digital untuk UMKM Desa",
    description:
      "Pelaku usaha lokal mendapat pendampingan promosi produk lewat media sosial dan marketplace.",
    date: "23 Mei 2026",
    category: "UMKM",
    author: "Sekretariat Desa",
    content: [
      "Pelatihan digital untuk UMKM desa diikuti oleh pelaku usaha makanan, kerajinan, dan produk rumah tangga yang ingin meningkatkan jangkauan pemasaran secara daring.",
      "Materi yang diberikan meliputi pengambilan foto produk, penulisan deskripsi, pengelolaan akun media sosial, dan pengenalan marketplace yang relevan untuk usaha skala desa.",
      "Melalui program ini, pemerintah desa berharap pelaku UMKM lebih siap memasarkan produk secara konsisten dan mampu memperluas pasar di luar wilayah sekitar.",
    ],
  },
  {
    id: "berita-3",
    title: "Jadwal Posyandu Bulan Juni",
    description:
      "Informasi layanan kesehatan ibu dan anak di balai desa untuk agenda bulan berikutnya.",
    date: "22 Mei 2026",
    category: "Kesehatan",
    author: "Kader Kesehatan",
    content: [
      "Jadwal Posyandu bulan Juni telah disusun untuk mendukung pelayanan rutin bagi ibu hamil, balita, serta pemantauan tumbuh kembang anak di lingkungan desa.",
      "Layanan akan dipusatkan di balai desa dengan agenda penimbangan, imunisasi, konsultasi gizi, dan edukasi kesehatan keluarga yang dipandu petugas serta kader setempat.",
      "Warga diimbau hadir sesuai jadwal yang diumumkan agar proses pelayanan lebih tertib dan seluruh peserta dapat terlayani dengan baik.",
    ],
  },
];

export default function AdminBeritaPage() {
  return <BeritaTableSection items={beritaRows} />;
}
